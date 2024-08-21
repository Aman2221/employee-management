// pages/api/remove-cookie.ts
import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Set-Cookie', cookie.serialize('sessionId', '', {
        maxAge: -1, // Invalidate the cookie
        path: '/',  // Ensure it matches the original path
    }));

    res.status(200).json({ message: 'Cookie removed' });
}
