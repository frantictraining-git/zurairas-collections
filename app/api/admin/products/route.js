import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { cookies } from 'next/headers';

// Helper to check admin auth
const checkAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  if (!token || token.value !== process.env.ADMIN_PASSWORD) {
    return false;
  }
  return true;
};

export async function GET() {
  const isAuth = await checkAdminAuth();
  if (!isAuth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  const isAuth = await checkAdminAuth();
  if (!isAuth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    await dbConnect();

    // Create a new product
    const newProduct = await Product.create(data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    // Check if duplicate key error for 'id'
    if (error.code === 11000) {
      return NextResponse.json({ message: 'A product with this ID already exists.' }, { status: 400 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
