import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { password } = await req.json();
    
    const validPassword = process.env.ADMIN_PASSWORD || 'ZurairaAdmin2026';
    
    // Check against env variable or fallback
    if (password === validPassword) {
      const response = NextResponse.json({ success: true });
      // Set an HTTP-only cookie
      response.cookies.set('admin_token', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      return response;
    } else {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
