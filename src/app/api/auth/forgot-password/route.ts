import { NextResponse } from 'next/server';
import { generateResetCode } from '@/services/authService';
import { sendPasswordResetEmail } from '@/services/emailService';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const code = await generateResetCode(email);

    if (code) {
      console.log(`Reset code for ${email}: ${code}`);
      
      // Send the email using our email service
      const emailResult = await sendPasswordResetEmail(email, code);
      if (!emailResult.success) {
        console.error('Failed to send reset email', emailResult.error);
        // We still return success to prevent email enumeration, but log the error
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({ message: 'If an account exists with that email, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
