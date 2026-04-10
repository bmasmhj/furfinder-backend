
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const userResult = await db.query(
      'SELECT referral_code, premium_until FROM users WHERE id = $1',
      [user.id]
    );
    const referralCode = userResult.rows[0]?.referral_code || '';
    const premiumUntil = userResult.rows[0]?.premium_until;

    const referralCount = await db.query(
      'SELECT COUNT(*)::int AS count FROM users WHERE referred_by = $1',
      [user.id]
    );

    const rewardsResult = await db.query(
      'SELECT type, days_awarded, reason, created_at FROM referral_rewards WHERE user_id = $1 ORDER BY created_at DESC',
      [user.id]
    );

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sharesResult = await db.query(
      'SELECT platform, shared_date FROM social_shares WHERE user_id = $1 AND shared_date >= $2 ORDER BY shared_date DESC',
      [user.id, startOfMonth.toISOString()]
    );

    const totalSharesThisMonth = sharesResult.rows.length;

    return NextResponse.json({
      referralCode,
      referralCount: referralCount.rows[0].count,
      premiumUntil: premiumUntil ? new Date(premiumUntil).toISOString() : null,
      rewards: rewardsResult.rows.map((r: any) => ({
        type: r.type,
        daysAwarded: r.days_awarded,
        reason: r.reason,
        createdAt: r.created_at.toISOString(),
      })),
      sharesThisMonth: totalSharesThisMonth,
      shares: sharesResult.rows.map((s: any) => ({
        platform: s.platform,
        date: s.shared_date,
      })),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
