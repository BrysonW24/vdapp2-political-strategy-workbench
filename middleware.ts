import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to login page
  if (pathname === '/login') {
    return NextResponse.next()
  }

  // Check for auth token in cookies
  const token = request.cookies.get('auth-storage')?.value

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Parse the token to check if user is authenticated
  try {
    const authData = JSON.parse(token)
    if (!authData.state?.isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Configure which routes to protect
export const config = {
  matcher: [
    '/',
    '/moat-finder/:path*',
    '/disruption-radar/:path*',
    '/news/:path*',
  ],
}
