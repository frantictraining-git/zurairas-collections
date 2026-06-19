import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Only act on confirmed payments
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Retrieve the cart items we stored in metadata during checkout
    const cartItems = JSON.parse(session.metadata?.cartItems || '[]');

    if (cartItems.length > 0) {
      await dbConnect();

      for (const item of cartItems) {
        const sizeKey = `inventory.${item.size}`;
        await Product.findOneAndUpdate(
          { id: item.id, [sizeKey]: { $gt: 0 } },
          { $inc: { [sizeKey]: -item.quantity } }
        );
      }

      console.log(`✅ Inventory decremented for session ${session.id}`);
    }
  }

  return NextResponse.json({ received: true });
}
