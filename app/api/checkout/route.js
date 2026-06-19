import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { cartItems } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    await dbConnect();

    // ── PHASE 1: Read-only stock check — find ALL sold-out items ──
    const soldOutItems = [];
    for (const item of cartItems) {
      const sizeKey = `inventory.${item.size}`;
      const product = await Product.findOne({ id: item.id, [sizeKey]: { $gt: 0 } });
      if (!product) {
        soldOutItems.push({ id: item.id, size: item.size, title: item.title });
      }
    }

    if (soldOutItems.length > 0) {
      return NextResponse.json({
        soldOutItems,
        message: soldOutItems.length === cartItems.length
          ? 'All pieces in your bag have just been claimed by other shoppers.'
          : `${soldOutItems.length} piece${soldOutItems.length > 1 ? 's have' : ' has'} just been claimed. You may still proceed with the remaining pieces in your bag.`,
      }, { status: 409 });
    }

    // ── PHASE 2: Create Stripe session — NO inventory decrement yet ──
    // Inventory is only decremented AFTER Stripe confirms payment via webhook.
    // We store the full cart as metadata so the webhook knows what to decrement.
    const line_items = cartItems.map((item) => {
      const absoluteImage = item.images && item.images.length > 0
        ? `${process.env.NEXT_PUBLIC_SITE_URL}${item.images[0]}`
        : undefined;

      return {
        price_data: {
          currency: 'cad',
          product_data: {
            name: `${item.title} - Size: ${item.size}`,
            images: absoluteImage ? [absoluteImage] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
      // Store cart in metadata so the webhook can decrement inventory after payment
      metadata: {
        cartItems: JSON.stringify(cartItems.map(i => ({ id: i.id, size: i.size, quantity: i.quantity }))),
      },
    });

    return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url });

  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ message: error.message || "An error occurred during checkout" }, { status: 400 });
  }
}
