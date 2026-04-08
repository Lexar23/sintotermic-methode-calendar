import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import pool from '@/lib/db/database';

export async function GET(request: Request) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ success: false }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  try {
    let queryStr = 'SELECT * FROM daily_records WHERE user_id = $1';
    const params: any[] = [auth.userId];

    if (year && month) {
      queryStr += ' AND EXTRACT(YEAR FROM date) = $2 AND EXTRACT(MONTH FROM date) = $3';
      params.push(year, month);
    }

    queryStr += ' ORDER BY date ASC';
    const result = await pool.query(queryStr, params);
    return NextResponse.json({ success: true, data: { records: result.rows } });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ success: false }, { status: 401 });

  try {
    const body = await request.json();
    const { date, basal_temp, flow_type, cycle_day, had_sex, used_condom, notes } = body;

    // Lógica de cálculo de día de ciclo simplificada para la migración
    const result = await pool.query(
      `INSERT INTO daily_records (user_id, date, basal_temp, flow_type, cycle_day, had_sex, used_condom, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [auth.userId, date, basal_temp, flow_type, cycle_day, had_sex, used_condom, notes]
    );

    return NextResponse.json({ success: true, data: { record: result.rows[0] } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Error al crear registro' }, { status: 500 });
  }
}
