
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { handleApiError } from '@/lib/api-errors';
import { batchRunning, runBatchMatch } from '@/lib/batch-match';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    if (batchRunning) {
      return NextResponse.json({ message: "A scan is already running. Please wait." }, { status: 409 });
    }

    // In a serverless environment, triggering a long-running task can be problematic.
    // However, we initiate it here.
    runBatchMatch()
      .then(r => console.log('[BatchMatch] Manual run complete:', r))
      .catch(err => console.error('[BatchMatch] Manual run error:', err));

    return NextResponse.json({ success: true, message: "Batch scan started. Check back in a few minutes." });
  } catch (error) {
    return handleApiError(error);
  }
}
