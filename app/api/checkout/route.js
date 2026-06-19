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

    // ── PHASE 1: Read-only check — find ALL sold-out items before touching anything ──
    const soldOutItems = [];
    for (const item of cartItems) {
      const sizeKey = `inventory.${item.size}`;
      const product = await Product.findOne({ id: item.id, [sizeKey]: { $gt: 0 } });
      if (!product) {
        soldOutItems.push({ id: item.id, size: item.size, title: item.title });
      }
    }

    // If any items are sold out, tell the frontend exactly which ones —
    // but DON'T block the whole checkout. Let the user decide.
    if (soldOutItems.length > 0) {
      return NextResponse.json({
        soldOutItems,
        message: soldOutItems.length === cartItems.length
          ? 'All pieces in your bag have just been claimed by other shoppers.'
          : `${soldOutItems.length} piece${soldOutItems.length > 1 ? 's have' : ' has'} just been claimed. You may still proceed with the remaining pieces in your bag.`,
      }, { status: 409 });
    }

    // ── PHASE 2: All items available — atomically decrement and create Stripe session ──
    dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    const line_items = [];
    for (const item of cartItems) {
      const sizeKey = `inventory.${item.size}`;
      await Product.findOneAndUpdate(
        { id: item.id, [sizeKey]: { $gt: 0 } },
        { $inc: { [sizeKey]: -1 } },
        { new: true, session: dbSession }
      );

      const absoluteImage = item.images && item.images.length > 0
        ? `${process.env.NEXT_PUBLIC_SITE_URL}${item.images[0]}`
        : undefined;

      line_items.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: `${item.title} - Size: ${item.size}`,
            images: absoluteImage ? [absoluteImage] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
    });

    await dbSession.commitTransaction();
    dbSession.endSession();

    return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url });

  } catch (error) {
    if (dbSession) {
      await dbSession.abortTransaction();
      dbSession.endSession();
    }
    console.error("Checkout error:", error);
    return NextResponse.json({ message: error.message || "An error occurred during checkout" }, { status: 400 });
  }
}
