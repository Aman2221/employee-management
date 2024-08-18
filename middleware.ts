import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token');
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
}

// Define routes that should be protected
export const config = {
    matcher: ['/home', "/"], // Adjust paths as needed
};
