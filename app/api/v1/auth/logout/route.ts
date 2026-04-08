import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // For JWT-based auth, logout is handled on the client by removing the token
  return NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  );
}
