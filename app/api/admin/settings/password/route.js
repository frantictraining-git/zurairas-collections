import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    await dbConnect();
    
    // We get the email from the cookie, which was set during login
    const cookieStore = cookies();
    const adminToken = cookieStore.get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ message: "New password must be at least 8 characters" }, { status: 400 });
    }

    // Find the admin user by email (admin_token contains the email)
    const adminUser = await User.findOne({ email: adminToken, role: 'admin' });
    
    if (!adminUser) {
      return NextResponse.json({ message: "Admin user not found" }, { status: 404 });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, adminUser.password);
    
    if (!isMatch) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 401 });
    }

    // Hash and update the new password
    adminUser.password = await bcrypt.hash(newPassword, 10);
    await adminUser.save();

    return NextResponse.json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error('Password Update Error:', error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
