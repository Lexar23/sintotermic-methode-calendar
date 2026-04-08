import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import pool from '@/lib/db/database';

export async function GET(request: Request) {
  const auth = await getAuthUser();
  if (!auth) return NextResponse.json({ success: false }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const months = searchParams.get('months') || '3';

  try {
    const result = await pool.query(
      `SELECT date, basal_temp, flow_type, cycle_day, had_sex, used_condom
       FROM daily_records
       WHERE user_id = $1 AND date >= CURRENT_DATE - INTERVAL '1 month' * $2 AND basal_temp IS NOT NULL
       ORDER BY date ASC`,
      [auth.userId, months]
    );

    return NextResponse.json({ success: true, data: { chart: result.rows } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
