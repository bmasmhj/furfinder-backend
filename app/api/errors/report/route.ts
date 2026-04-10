
import { NextRequest, NextResponse } from 'next/server';
import { sendErrorToDiscord } from '@/lib/discord-errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { error, stack, deviceInfo, userId } = body;
    
    console.error(`[MobileError] ${error}\nStack: ${stack}\nDevice: ${JSON.stringify(deviceInfo)}\nUser: ${userId}`);
    
    sendErrorToDiscord(error, stack, { deviceInfo, userId }).catch(() => {});
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error reporting error:', error);
    return NextResponse.json({ message: 'Failed to report error' }, { status: 500 });
  }
}
