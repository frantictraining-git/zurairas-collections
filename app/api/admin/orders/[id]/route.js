import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { cookies } from 'next/headers';

const checkAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return token && token.value === process.env.ADMIN_PASSWORD;
};

export async function PATCH(req, { params }) {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params; // Next.js 15+ params are promises

  let dbSession = null;
  try {
    const { action } = await req.json(); // action can be 'confirm' or 'cancel'
    
    await dbConnect();
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (action === 'confirm') {
      if (order.status !== 'awaiting_payment') {
        return NextResponse.json({ message: "Order is not awaiting payment" }, { status: 400 });
      }
      
      order.status = 'paid';
      order.expiresAt = null; // Remove soft lock expiration
      await order.save();

      // TODO: Send confirmation receipt email here in the future

      return NextResponse.json({ message: "Order confirmed", order });

    } else if (action === 'cancel') {
      if (order.status !== 'awaiting_payment' && order.status !== 'expired') {
        return NextResponse.json({ message: "Cannot cancel a paid order" }, { status: 400 });
      }

      // Restore inventory
      dbSession = await mongoose.startSession();
      dbSession.startTransaction();

      for (const item of order.cartItems) {
        const sizeKey = `inventory.${item.size}`;
        await Product.findOneAndUpdate(
          { id: item.id },
          { $inc: { [sizeKey]: item.quantity } },
          { session: dbSession }
        );
      }

      order.status = 'cancelled';
      order.expiresAt = null;
      await order.save({ session: dbSession });

      await dbSession.commitTransaction();
      dbSession.endSession();

      return NextResponse.json({ message: "Order cancelled and stock restored", order });

    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

  } catch (error) {
    if (dbSession) {
      await dbSession.abortTransaction();
      dbSession.endSession();
    }
    console.error("Order update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
