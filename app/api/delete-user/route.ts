import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
    const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string;
    const serviceAccount = JSON.parse(
        Buffer.from(base64Key, "base64").toString("utf-8")
    );

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const { uid, docId } = await request.json();

        if (!uid || !docId) {
            return NextResponse.json({ error: "Missing uid or docId" }, { status: 400 });
        }

        // Delete user from Firebase Auth
        await admin.auth().deleteUser(uid);
        console.log(`User with UID: ${uid} deleted from Firebase Auth.`);

        // Delete corresponding document in Firestore
        const db = admin.firestore();
        await db.collection("users").doc(docId).delete();
        console.log(`Document with ID: ${docId} deleted from Firestore.`);

        return NextResponse.json({ message: "User and document deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user and document" }, { status: 500 });
    }
}
