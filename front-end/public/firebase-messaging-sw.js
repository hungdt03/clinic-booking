// Here I am using Firebase version 10.12.3, 
// you can use Firebase version 10.12.3 and above, 
// because the Firebase legacy API has been turned off as of July 20 2024,
// see https://firebase.google.com/docs/cloud- messaging/migrate-v1
importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.3/firebase-app-compat.min.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/firebase/10.12.3/firebase-messaging-compat.min.js");

firebase.initializeApp({
    apiKey: "AIzaSyBy93YTA4Lv792j9NWH8-bJr2MPovUBXjw",
    authDomain: "clinic-schedule-23e8a.firebaseapp.com",
    projectId: "clinic-schedule-23e8a",
    storageBucket: "clinic-schedule-23e8a.appspot.com",
    messagingSenderId: "598507738411",
    appId: "1:598507738411:web:9787152b6840c806dc616e",
    measurementId: "G-HMSQM7BZ5P"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (message) => {
    console.log("firebase-messaging-sw.js: Received background message ", message);

    self?.registration?.showNotification(message?.data?.title || "Notification Title", {
        icon: message?.data?.icon,
        badge: message?.data?.badge,
        body: message?.data?.content,
        
    })

})