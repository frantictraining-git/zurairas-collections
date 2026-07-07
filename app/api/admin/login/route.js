import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();
    
    // Find admin user
    const adminUser = await User.findOne({ email, role: 'admin' });
    
    if (!adminUser) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, adminUser.password);
    
    if (isMatch) {
      const response = NextResponse.json({ success: true, email: adminUser.email });
      // Set an HTTP-only cookie with a proper token or identifier
      // For simplicity in this implementation, we can just use the email as the token payload
      response.cookies.set('admin_token', adminUser.email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return response;
    } else {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
