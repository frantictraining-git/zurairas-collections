import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token');
  
  if (!token || !token.value) {
    return false;
  }
  
  try {
    await dbConnect();
    const adminUser = await User.findOne({ email: token.value, role: 'admin' });
    return !!adminUser;
  } catch (err) {
    console.error('Auth Check Error:', err);
    return false;
  }
}
