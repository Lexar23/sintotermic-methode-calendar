import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import pool from '@/lib/db/database';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ success: false }, { status: 401 });

  const { date } = await params;
  try {
    const body = await request.json();
    const { basal_temp, flow_type, cycle_day, had_sex, used_condom, notes } = body;

    const result = await pool.query(
      `INSERT INTO daily_records (user_id, date, basal_temp, flow_type, cycle_day, had_sex, used_condom, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id, date) DO UPDATE SET
       basal_temp = EXCLUDED.basal_temp,
       flow_type = EXCLUDED.flow_type,
       cycle_day = EXCLUDED.cycle_day,
       had_sex = EXCLUDED.had_sex,
       used_condom = EXCLUDED.used_condom,
       notes = EXCLUDED.notes,
       updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [auth.userId, date, basal_temp, flow_type, cycle_day, had_sex, used_condom, notes]
    );

    return NextResponse.json({ success: true, data: { record: result.rows[0] } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ date: string }> }
) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ success: false }, { status: 401 });

  const { date } = await params;
  try {
    const result = await pool.query(
      'DELETE FROM daily_records WHERE user_id = $1 AND date = $2',
      [auth.userId, date]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ success: false, message: 'No encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
