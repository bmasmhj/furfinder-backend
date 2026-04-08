import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword, generateToken } from '@/lib/auth';
import { validateRegisterData } from '@/lib/validation';
import { ApiError, handleApiError } from '@/lib/api-errors';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateRegisterData(body);
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

    const { email, password, display_name } = validation.data;

    // Check if user exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new ApiError('Email already registered', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, full_name, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, email, full_name, created_at`,
      [email, hashedPassword, display_name]
    );

    const user = result.rows[0];
    const token = generateToken({ userId: user.id, email: user.email });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
