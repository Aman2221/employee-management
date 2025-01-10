import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token');
    if (!token) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
}

// routes that should be protected
export const config = {
    matcher: ['/view-leaves', "/", "/my-updates", "/view-updates", "/register", "/profile"],
};
