import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // If there's an error, redirect to login with error message
    if (error) {
      const errorMessage = errorDescription || 'Authentication failed';
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}&message=${encodeURIComponent(errorMessage)}`, request.url)
      );
    }

    // If we have a code and state, redirect to the callback page
    if (code && state) {
      return NextResponse.redirect(
        new URL(`/callback?code=${code}&state=${state}`, request.url)
      );
    }

    // If no authentication parameters, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=callback_error&message=Authentication callback failed', request.url)
    );
  }
}
