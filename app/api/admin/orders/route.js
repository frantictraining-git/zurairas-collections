import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { cookies } from 'next/headers';

// Simple admin auth check
const checkAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return token && token.value === process.env.ADMIN_PASSWORD;
};

export async function GET(req) {
  if (!(await checkAuth())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await dbConnect();
    // Fetch all orders, sort by newest first
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}
