import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
    try {
        const serviceAccount = {
            type: "service_account",
            project_id: process.env.FIREBASE_PROJECT_ID,
            private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
        };
        console.log("serviceAccount", serviceAccount, process.env.FIREBASE_PROJECT_ID)
        console.log('Private Key EXISTS:', !!process.env.FIREBASE_PRIVATE_KEY)
        console.log('Client Email EXISTS:', !!process.env.FIREBASE_CLIENT_EMAIL)
        console.log('Project ID EXISTS:', !!process.env.FIREBASE_PROJECT_ID)

        if (!serviceAccount.private_key || !serviceAccount.client_email) {
            throw new Error(
                "Missing Firebase Admin credentials. Ensure PRIVATE_KEY and CLIENT_EMAIL are set in the environment variables."
            );
        }

        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as any),
        });

    } catch (error) {
        console.error("Failed to initialize Firebase Admin SDK:", error);
    }
}

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const { uid, docId } = await request.json();

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

        // Delete corresponding document in Firestore
        const db = admin.firestore();
        await db.collection("users").doc(docId).delete();

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
