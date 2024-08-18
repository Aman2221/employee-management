import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { token } = await request.json();

    const response = NextResponse.json({ message: 'Login successful' });

    // Set the token as an HTTP-only cookie
    response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
    });

    return response;

}
