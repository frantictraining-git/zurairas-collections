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

  const session = event.data.object;
  const cartItems = JSON.parse(session.metadata?.cartItems || '[]');

  if (cartItems.length === 0) {
    return NextResponse.json({ received: true });
  }

  await dbConnect();

  if (event.type === 'checkout.session.completed') {
    // ✅ Payment confirmed — stock was already held, nothing to change.
    // Just log it for your records.
    console.log(`✅ Payment confirmed for session ${session.id}. Inventory hold is now permanent.`);
  }

  if (event.type === 'checkout.session.expired') {
    // ⏰ Customer abandoned the payment after 30 minutes.
    // Restore the stock so other customers can buy it.
    for (const item of cartItems) {
      const sizeKey = `inventory.${item.size}`;
      await Product.findOneAndUpdate(
        { id: item.id },
        { $inc: { [sizeKey]: item.quantity } }
      );
    }
    console.log(`⏰ Session ${session.id} expired — stock restored for ${cartItems.length} item(s).`);
  }

  return NextResponse.json({ received: true });
}
