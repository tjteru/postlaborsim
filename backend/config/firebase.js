const admin = require('firebase-admin');

let db;

function initializeFirebase() {
    if (!db) {
        // Initialize Firebase Admin SDK
        // In production, use service account key or default credentials
        // For development, you can use the Firebase emulator
        
        if (process.env.NODE_ENV === 'production') {
            // Production: Use service account key from environment variable
            if (process.env.FIREBASE_SERVICE_ACCOUNT) {
                const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    projectId: process.env.FIREBASE_PROJECT_ID
                });
            } else {
                // Use default credentials (for Google Cloud environments)
                admin.initializeApp({
                    projectId: process.env.FIREBASE_PROJECT_ID
                });
            }
        } else {
            // Development: Use Firebase emulator or test project
            const projectId = process.env.FIREBASE_PROJECT_ID || 'postlaborsim-dev';
            
            if (process.env.FIRESTORE_EMULATOR_HOST) {
                // Using Firebase emulator
                admin.initializeApp({
                    projectId: projectId
                });
            } else {
                // Development with actual Firebase project (requires service account)
                try {
                    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './config/serviceAccountKey.json';
                    const serviceAccount = require(serviceAccountPath);
                    admin.initializeApp({
                        credential: admin.credential.cert(serviceAccount),
                        projectId: projectId
                    });
                } catch (error) {
                    console.warn('Firebase service account not found, falling back to default credentials');
                    admin.initializeApp({
                        projectId: projectId
                    });
                }
            }
        }
        
        db = admin.firestore();
        console.log('Firebase initialized successfully');
    }
    
    return db;
}

function getFirestore() {
    if (!db) {
        return initializeFirebase();
    }
    return db;
}

module.exports = {
    initializeFirebase,
    getFirestore,
    admin
};