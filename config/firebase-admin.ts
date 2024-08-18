import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(), // or use serviceAccountKey.json
});

const auth = admin.auth();

// Function to set a user as a super user
async function setSuperUser(email: string) {
    try {
        const user = await auth.getUserByEmail(email);

        await auth.setCustomUserClaims(user.uid, { superUser: true });

        console.log(`Successfully set ${email} as a super user.`);
    } catch (error) {
        console.error('Error setting super user:', error);
    }
}

// Example usage
setSuperUser(process.env.NEXT_PUBLIC_FIREBASE_SUPER_USER as string);
