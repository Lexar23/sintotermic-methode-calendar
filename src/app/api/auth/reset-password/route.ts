import { NextResponse } from 'next/server';
import { resetPassword } from '@/services/authService';

export async function POST(request: Request) {
  try {
    const { email, code, password } = await request.json();

    if (!email || !code || !password) {
      return NextResponse.json({ error: 'Email, code and password are required' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
    }

    const success = await resetPassword(email, code, password);

    if (!success) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
