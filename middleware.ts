import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('auth-token'); // Example: replace with your auth logic

    if (!token) {
        return NextResponse.redirect(new URL('/select-login-type', req.url));
    }

    return NextResponse.next();
}

// Define routes that should be protected
export const config = {
    matcher: ['/home'], // Adjust paths as needed
};
