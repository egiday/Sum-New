import { NextRequest } from 'next/server';
import { verifyToken } from './auth';
import { cookies } from 'next/headers';

export interface AuthUser {
  userId: string;
  email: string;
}

export async function getCurrentUser(request?: NextRequest): Promise<AuthUser | null> {
  try {
    let token: string | undefined;

    if (request) {
      // Get token from request cookies
      token = request.cookies.get('auth-token')?.value;
    } else {
      // Get token from server-side cookies
      const cookieStore = await cookies();
      token = cookieStore.get('auth-token')?.value;
    }

    if (!token) {
      return null;
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
    };
  } catch (error) {
    return null;
  }
}
