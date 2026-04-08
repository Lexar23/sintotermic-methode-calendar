import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import pool from '@/lib/db/database';

export async function PUT(request: Request) {
  const auth = await getAuthUser();
  if (!auth) {
    return NextResponse.json({ success: false, message: 'No autorizado' }, { status: 401 });
  }

  try {
    const { name, email } = await request.json();

    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email, created_at',
      [name, email, auth.userId]
    );

    return NextResponse.json({ 
      success: true, 
      data: { user: result.rows[0] } 
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Error al actualizar perfil' }, { status: 500 });
  }
}
