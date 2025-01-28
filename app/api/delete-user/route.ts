import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Check and log Firebase Admin environment variables
console.log("Initializing Firebase Admin SDK with the following configuration:");
console.log({
    project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    has_private_key: !!process.env.NEXT_PUBLIC_PRIVATE_KEY,
    has_client_email: !!process.env.NEXT_PUBLIC_CLIENT_EMAIL,
});

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
    try {
        const serviceAccount = {
            type: "service_account",
            project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            private_key: process.env.NEXT_PUBLIC_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            client_email: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
        };

        // Check if required environment variables are available
        if (!serviceAccount.private_key || !serviceAccount.client_email) {
            throw new Error(
                "Missing Firebase Admin credentials. Ensure PRIVATE_KEY and CLIENT_EMAIL are set in the environment variables."
            );
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as any),
        });

        console.log("Firebase Admin SDK initialized successfully.");
    } catch (error) {
        console.error("Failed to initialize Firebase Admin SDK:", error);
    }
}

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const { uid, docId } = await request.json();

        console.log("Request received with UID and docId:", { uid, docId });

        // Validate input
        if (!uid || !docId) {
            console.error("Missing uid or docId in request body.");
            return NextResponse.json(
                { error: "Missing uid or docId" },
                { status: 400 }
            );
        }

        // Delete user from Firebase Auth
        await admin.auth().deleteUser(uid);
        console.log(`User with UID: ${uid} deleted from Firebase Auth.`);

        // Delete corresponding document in Firestore
        const db = admin.firestore();
        await db.collection("users").doc(docId).delete();
        console.log(`Document with ID: ${docId} deleted from Firestore.`);

        // Return success response
        return NextResponse.json(
            { message: "User and document deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error deleting user:", error.message || error);
        return NextResponse.json(
            {
                error: "Failed to delete user and document",
                details: error.message || error,
            },
            { status: 500 }
        );
    }
}
