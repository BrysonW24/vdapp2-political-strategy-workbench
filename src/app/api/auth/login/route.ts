import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Simple credential check - in production, use proper authentication
    // For now, using hardcoded credentials for demo purposes
    const validCredentials =
      username === 'admin' && password === 'admin123'

    if (!validCredentials) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create auth data structure expected by middleware
    const authData = {
      state: {
        isAuthenticated: true,
        user: {
          username,
          role: 'admin'
        }
      }
    }

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: authData.state.user
    })

    // Set the auth-storage cookie
    response.cookies.set('auth-storage', JSON.stringify(authData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
