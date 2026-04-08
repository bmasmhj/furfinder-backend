// Alias for compatibility with route imports
export const generateToken = createToken;
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { headers } from 'next/headers'
import type { TokenPayload } from './types'
import { ApiError, ERROR_CODES } from './api-errors'
import type { Secret, SignOptions } from 'jsonwebtoken'

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production'
const JWT_EXPIRES_IN: SignOptions['expiresIn'] = (process.env.JWT_EXPIRES_IN || '24h') as SignOptions['expiresIn']

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcryptjs.genSalt(10)
  return bcryptjs.hash(password, salt)
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

type TokenInput = {
  userId: string
  email: string
}

export function createToken(userId: string, email: string): string
export function createToken(payload: TokenInput): string
export function createToken(
  userIdOrPayload: string | TokenInput,
  email?: string
): string {
  const payload =
    typeof userIdOrPayload === 'string'
      ? {
          sub: userIdOrPayload,
          email: email ?? '',
        }
      : {
          sub: userIdOrPayload.userId,
          email: userIdOrPayload.email,
        }

  return jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Omit<TokenPayload, 'userId'>
    return {
      ...decoded,
      userId: decoded.sub,
    }
  } catch (error) {
    throw new ApiError(401, ERROR_CODES.INVALID_TOKEN, 'Invalid or expired token')
  }
}

export async function getCurrentUser() {
  try {
    const headersList = await headers()
    const authHeader = headersList.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    return {
      id: payload.sub,
      email: payload.email,
    }
  } catch (error) {
    return null
  }
}

export function generateAuthToken(userId: string, email: string): string {
  return createToken(userId, email)
}
