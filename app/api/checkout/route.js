import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  let dbSession = null;
  try {
    const { cartItems } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    await dbConnect();
    
    // Start a MongoDB Transaction to ensure atomic inventory locking
    dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    const line_items = [];

    for (const item of cartItems) {
      const sizeKey = `inventory.${item.size}`;
      
      // Optimistic Concurrency Control Check: 
      // Atomically decrement stock ONLY IF stock is greater than 0
      const updatedProduct = await Product.findOneAndUpdate(
        { id: item.id, [sizeKey]: { $gt: 0 } },
        { $inc: { [sizeKey]: -1 } },
        { new: true, session: dbSession }
      );

      // If updatedProduct is null, it means someone else bought the last one!
      if (!updatedProduct) {
        throw new Error(`We're sorry! "${item.title}" in size ${item.size} just sold out.`);
      }

      // Add to Stripe Line Items
      line_items.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: `${item.title} - Size: ${item.size}`,
            images: item.images && item.images.length > 0 ? [item.images[0]] : [],
          },
          unit_amount: Math.round(item.price * 100), // Stripe expects cents
        },
        quantity: item.quantity,
      });
    }

    // Generate Secure Stripe Payment Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      // Set the session to expire in 30 minutes (minimum allowed by Stripe)
      // This holds the inventory. If abandoned, a webhook would restore the inventory.
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
    });

    // Commit the database transaction since all items were in stock
    await dbSession.commitTransaction();
    dbSession.endSession();

    return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url });

  } catch (error) {
    // If any item was out of stock, rollback the transaction so we don't accidentally
    // deduct inventory for the other items in their cart!
    if (dbSession) {
      await dbSession.abortTransaction();
      dbSession.endSession();
    }
    console.error("Checkout error:", error);
    return NextResponse.json({ message: error.message || "An error occurred during checkout" }, { status: 400 });
  }
}
