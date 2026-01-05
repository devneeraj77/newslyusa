import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This is an empty middleware function that does nothing.
// It exists to satisfy the Next.js requirement for a middleware file.
export default function middleware(request: NextRequest) {
  return NextResponse.next();
}
