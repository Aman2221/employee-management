import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    const allCookies = await cookies();
    const userToken = allCookies?.get('token')?.value;
    return NextResponse.json({ userToken });
}
