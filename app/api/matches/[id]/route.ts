import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/lib/api-errors';
import { findMatchesForReport } from '@/lib/match-service';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const reportId = await params.id;
    const matches = await findMatchesForReport(reportId);

    return NextResponse.json({ matches });
  } catch (error) {
    return handleApiError(error);
  }
}
