import { NextResponse } from 'next/server';
import { deriveSessionToken, timingSafeEqual } from './lib/auth.js';

export async function proxy(request) {
  const expected = process.env.ADMIN_PASSWORD;
  const token = request.cookies.get('admin_token')?.value;

  let isValid = false;
  if (expected && token) {
    const expectedToken = await deriveSessionToken(expected);
    isValid = timingSafeEqual(token, expectedToken);
  }

  if (!isValid) {
    const loginUrl = new URL('/blog/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin'],
};
