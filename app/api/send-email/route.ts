// app/api/send-email/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
// Note: Next.js does not have built-in support to disable body parsing in the `app` directory like in the `pages` directory.
// You need to manually handle the request body parsing.

export async function POST(request: NextRequest, response: NextApiResponse) {
    try {
        // Read the request body stream
        const reader = request.body?.getReader();
        const result = await reader?.read();
        const body = result?.value ? Buffer.from(result.value).toString() : '';

        // Parse the body as JSON
        const { email, subject, message, html } = JSON.parse(body);

        if (!email || !subject || !message) {
            return NextResponse.json({ message: 'Email, subject, and message are required' }, { status: 400 });
        }

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.NEXT_PUBLIC_EMAIL_USER,
                    pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.NEXT_PUBLIC_EMAIL_USER,
                to: email,
                subject: subject,
                text: message,
                html: `<h1>${html}</h1>`
            };

            // Send email
            const info = await transporter.sendMail(mailOptions);
            return NextResponse.json({ message: 'Email sent' }, { status: 200 });
        } catch (error) {
            return NextResponse.json({ message: 'Error sending email' }, { status: 405 });
        }
    }
    catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
