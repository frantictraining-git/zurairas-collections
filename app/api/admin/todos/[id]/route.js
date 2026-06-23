import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Todo from '@/models/Todo';
import { cookies } from 'next/headers';

const checkAuth = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  return token && token.value === process.env.ADMIN_PASSWORD;
};

export async function PUT(req, { params }) {
  if (!(await checkAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    const data = await req.json();
    await dbConnect();
    const updated = await Todo.findByIdAndUpdate(id, data, { new: true });
    if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  if (!(await checkAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await params;
    await dbConnect();
    const deleted = await Todo.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
