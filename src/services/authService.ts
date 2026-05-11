import { query } from '@/lib/db/database';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function generateResetCode(email: string) {
  const user = await query('SELECT id FROM users WHERE email = $1', [email]);
  
  if (user.rowCount === 0) {
    return null; // User not found
  }

  const userId = user.rows[0].id;
  // Generate a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  // We can store it directly or hashed. For simplicity and since it's short-lived, 
  // we'll store it as is but we could hash it for extra security.
  const expiry = new Date(Date.now() + 15 * 60000); // 15 minutes for a code

  await query(
    'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE id = $3',
    [code, expiry, userId]
  );

  return code;
}

export async function verifyResetCode(email: string, code: string) {
  const result = await query(
    'SELECT id, reset_token_expiry FROM users WHERE email = $1 AND reset_token = $2',
    [email, code]
  );

  if (result.rowCount === 0) {
    return null;
  }

  const user = result.rows[0];
  if (new Date() > new Date(user.reset_token_expiry)) {
    return null; // Expired
  }

  return user.id;
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  const userId = await verifyResetCode(email, code);
  
  if (!userId) {
    return false;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await query(
    'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
    [passwordHash, userId]
  );

  return true;
}

export async function changePassword(userId: number, currentPassword: string, newPassword: string) {
  const result = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
  
  if (result.rowCount === 0) {
    return { success: false, error: 'User not found' };
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(currentPassword, user.password_hash);

  if (!isMatch) {
    return { success: false, error: 'Incorrect current password' };
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, userId]);

  return { success: true };
}
