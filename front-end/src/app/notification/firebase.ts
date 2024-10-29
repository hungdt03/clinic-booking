import { type FirebaseOptions, initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import { getAccessToken } from "../../utils/auth";
import deviceTokenService from "../../services/device-token-service";

const config: FirebaseOptions = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


const app = initializeApp(config);
export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
    if ("Notification" in window) {
        try {
            // requesting notification permission
            const permission = await (
                Notification || window.Notification
            ).requestPermission();

            if (permission) {
                console.info("Notification permission granted.");
            }
        } catch (error) {
            console.error("Unable to get permission to notify.", error);
        }
    }
};

export const getFCMToken = async () => {
    let token: string | null = null;
    if ("serviceWorker" in navigator) {
        try {
            // installing firebase service worker and try getting the token
            token = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
            });

            localStorage.setItem("fcmToken", JSON.stringify(token));
            const accessToken = getAccessToken();
            if (accessToken) {
                await deviceTokenService.saveToken(token);
            }

            console.info("Got FCM token:", token);
        } catch (error) {
            console.error("Unable to get FCM token.", error);
        }
    }

    return token;
};

export const initializeFCM = async () => {
    await Promise.all([requestNotificationPermission(), getFCMToken()]);
};