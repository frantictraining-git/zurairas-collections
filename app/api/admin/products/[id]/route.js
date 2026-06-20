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

export async function PUT(req, { params }) {
  const isAuth = await checkAuth();
  if (!isAuth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params; // Note: In Next.js 15, params is a promise.
    const data = await req.json();
    await dbConnect();

    // Update by our custom string `id` or MongoDB `_id`. Let's use custom `id`.
    const updatedProduct = await Product.findOneAndUpdate({ id: id }, data, { new: true });
    
    if (!updatedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const isAuth = await checkAuth();
  if (!isAuth) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    await dbConnect();

    const deletedProduct = await Product.findOneAndDelete({ id: id });
    
    if (!deletedProduct) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
