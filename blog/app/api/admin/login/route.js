import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deriveSessionToken, timingSafeEqual } from '../../../../lib/auth.js';

export async function POST(request) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const { password } = await request.json();
  if (typeof password !== 'string' || !timingSafeEqual(password, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = await deriveSessionToken(expected);
  const cookieStore = await cookies();
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: '/',
  });

  return NextResponse.json({ ok: true });
}
