// app/api/notify/route.ts

import { NextRequest, NextResponse } from 'next/server';
import webPush from 'web-push';
import { firestore } from '@/lib/firebase'; // Assuming you've set up Firebase

webPush.setVapidDetails(
    'mailto:your-email@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
    const { userId, message } = await request.json();

    // Fetch the user's subscription from Firestore
    const userDoc = await firestore.collection('users').doc(userId).get();
    const subscription = userDoc.data()?.subscription;

    if (subscription) {
        const payload = JSON.stringify({
            title: 'Leave Approved',
            body: message,
        });

        await webPush.sendNotification(subscription, payload);
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false });
}
