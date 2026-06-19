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

    // ── PHASE 1: Read-only check — find ALL sold-out items first ──
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

    // ── PHASE 2: Immediately hold/decrement stock (like Ticketmaster) ──
    // This prevents any other customer reaching Stripe for the same last item.
    // If the session expires or payment fails, the webhook will restore the stock.
    dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    for (const item of cartItems) {
      const sizeKey = `inventory.${item.size}`;
      const updated = await Product.findOneAndUpdate(
        { id: item.id, [sizeKey]: { $gt: 0 } },
        { $inc: { [sizeKey]: -item.quantity } },
        { new: true, session: dbSession }
      );
      // Double-check: if another customer just bought the last one in the milliseconds
      // between Phase 1 and Phase 2, catch it here and abort safely.
      if (!updated) {
        throw new Error(`RACE_CONDITION:${item.id}:${item.size}:${item.title}`);
      }
    }

    // ── PHASE 3: Create Stripe session with cart in metadata ──
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
      // 30-minute hold — after this, Stripe fires checkout.session.expired
      // and our webhook automatically restores the stock
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
      // Store cart so webhook can restore stock if session expires
      metadata: {
        cartItems: JSON.stringify(
          cartItems.map(i => ({ id: i.id, size: i.size, quantity: i.quantity }))
        ),
      },
    });

    await dbSession.commitTransaction();
    dbSession.endSession();

    return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url });

  } catch (error) {
    // Rollback the inventory hold if anything went wrong
    if (dbSession) {
      await dbSession.abortTransaction();
      dbSession.endSession();
    }

    // If it was a race condition (another customer just beat them to the last item)
    if (error.message?.startsWith('RACE_CONDITION:')) {
      const [, id, size, title] = error.message.split(':');
      return NextResponse.json({
        soldOutItems: [{ id, size, title }],
        message: `1 piece has just been claimed. You may still proceed with the remaining pieces in your bag.`,
      }, { status: 409 });
    }

    console.error("Checkout error:", error);
    return NextResponse.json({ message: error.message || "An error occurred." }, { status: 400 });
  }
}
