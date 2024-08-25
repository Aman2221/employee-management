import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type Data = {
    message: string;
};

export async function POST(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        const { to, subject, text } = req.body;

        // Configure the transporter
        let transporter = nodemailer.createTransport({
            service: 'Gmail', // You can also use SMTP for other providers
            auth: {
                user: process.env.NEXT_PUBLIC_EMAIL_USER, // Your email address
                pass: process.env.NEXT_PUBLIC_EMAIL_PASS, // Your email password or app-specific password
            },
        });

        try {
            // Send the email
            await transporter.sendMail({
                from: process.env.NEXT_PUBLIC_EMAIL_USER, // Sender address
                to, // List of receivers
                subject, // Subject line
                text, // Plain text body
            });

            res.status(200).json({ message: 'Email sent successfully!' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Failed to send email.' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed.' });
    }
}
