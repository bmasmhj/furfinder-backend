
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { ApiError, handleApiError } from '@/lib/api-errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const result = await db.query(
      'SELECT id, email, password_hash, display_name, phone, role FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const row = result.rows[0];
    const validPassword = await verifyPassword(password, row.password_hash);
    if (!validPassword) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    const user = {
      id: row.id,
      email: row.email,
      display_name: row.display_name,
      phone: row.phone,
      role: row.role || 'user',
    };

    const token = generateToken(user);
    return NextResponse.json({ user, token });
  } catch (error) {
    return handleApiError(error);
  }
}
