import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function POST(req) {
  let dbSession = null;
  try {
    const { cartItems, email } = await req.json();

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
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

    // ── PHASE 2: Immediately hold/decrement stock ──
    dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    let total = 0;

    for (const item of cartItems) {
      total += item.price * item.quantity;
      const sizeKey = `inventory.${item.size}`;
      const updated = await Product.findOneAndUpdate(
        { id: item.id, [sizeKey]: { $gt: 0 } },
        { $inc: { [sizeKey]: -item.quantity } },
        { new: true, session: dbSession }
      );
      if (!updated) {
        throw new Error(`RACE_CONDITION:${item.id}:${item.size}:${item.title}`);
      }
    }

    // Add taxes and shipping (must match frontend logic)
    const taxes = total * 0.13;
    const shipping = total > 0 ? 15 : 0;
    const finalTotal = total + taxes + shipping;

    // ── PHASE 3: Create E-Transfer Order ──
    // Generate a unique 6-character alphanumeric order ID (e.g. ZC-A8X9K2)
    const orderId = 'ZC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Set expiry to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await Order.create([{
      orderId,
      email,
      cartItems,
      total: finalTotal,
      paymentMethod: 'etransfer',
      status: 'awaiting_payment',
      expiresAt
    }], { session: dbSession });

    await dbSession.commitTransaction();
    dbSession.endSession();

    return NextResponse.json({ orderId });

  } catch (error) {
    if (dbSession) {
      await dbSession.abortTransaction();
      dbSession.endSession();
    }

    if (error.message?.startsWith('RACE_CONDITION:')) {
      const [, id, size, title] = error.message.split(':');
      return NextResponse.json({
        soldOutItems: [{ id, size, title }],
        message: `1 piece has just been claimed. You may still proceed with the remaining pieces in your bag.`,
      }, { status: 409 });
    }

    console.error("E-Transfer Checkout error:", error);
    return NextResponse.json({ message: error.message || "An error occurred." }, { status: 400 });
  }
}
