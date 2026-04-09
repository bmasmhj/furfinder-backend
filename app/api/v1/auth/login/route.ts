import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { validateLoginData } from '@/lib/validation';
import { ApiError, handleApiError } from '@/lib/api-errors';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = validateLoginData(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid input',
          details:
            validation.error instanceof ZodError
              ? validation.error.issues
              : [{ message: validation.error.message }],
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Find user
    const result = await db.query(
      'SELECT id, email, password_hash, display_name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new ApiError('Invalid credentials', 401);
    }

    const user = result.rows[0];

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      throw new ApiError('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          display_name: user.display_name,
        },
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
