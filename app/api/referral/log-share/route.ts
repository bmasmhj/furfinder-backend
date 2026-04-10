
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser, awardPremiumDays } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ message: 'Authentication required' }, { status: 401 });

    const body = await request.json();
    const { platform } = body;
    if (!platform) return NextResponse.json({ message: "Platform is required" }, { status: 400 });

    const validPlatforms = ['instagram', 'facebook', 'tiktok'];
    if (!validPlatforms.includes(platform)) {
      return NextResponse.json({ message: "Invalid platform" }, { status: 400 });
    }

    try {
      await db.query(
        'INSERT INTO social_shares (user_id, platform) VALUES ($1, $2)',
        [user.id, platform]
      );
    } catch (e: any) {
      if (e.code === '23505') {
        return NextResponse.json({ message: "You already logged a share on this platform today" }, { status: 409 });
      }
      throw e;
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const countResult = await db.query(
      'SELECT COUNT(*)::int AS count FROM social_shares WHERE user_id = $1 AND shared_date >= $2',
      [user.id, startOfMonth.toISOString()]
    );

    const totalShares = countResult.rows[0].count;

    let rewardEarned = false;
    if (totalShares === 20) {
      await awardPremiumDays(user.id, 7, 'ambassador', 'Social ambassador - 20 shares this month - earned 1 free week');
      rewardEarned = true;
    }

    return NextResponse.json({
      message: "Share logged",
      sharesThisMonth: totalShares,
      rewardEarned,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
