// firebase-messaging-sw.js

// 1️⃣ Import the modular SDK directly
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getMessaging,
  onBackgroundMessage,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-sw.js";

// 2️⃣ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAYLKwvkcorfHF6jfj9dQkHfsY-oSPY3rM",
  authDomain: "basic-224c7.firebaseapp.com",
  projectId: "basic-224c7",
  storageBucket: "basic-224c7.firebasestorage.app",
  messagingSenderId: "241479667416",
  appId: "1:241479667416:web:c182ccbadc9008bd0f91ad",
  measurementId: "G-KN5K9X56BX",
};

// 3️⃣ Initialize the app & messaging
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 4️⃣ Handle background messages — always show manually
onBackgroundMessage(messaging, (payload) => {
  console.log("Background message received:", payload);

  // Directly take the URL as it comes
  const targetUrl =
    payload.webpush?.fcmOptions?.link || payload.data?.url || "/";

  // Show the notification manually
  self.registration.showNotification(
    payload.notification?.title || payload.data?.title || "Notification",
    {
      body: payload.notification?.body || payload.data?.body || "",
      icon: payload.notification?.icon || payload.data?.icon || "/favicon.ico",
      data: {
        url: targetUrl,
        notificationId: payload.data?.notificationId || null,
      },
    }
  );

  // Optional: Track "received"
  if (payload.data?.notificationId) {
    fetch("http://192.168.1.6:4000/api/notifications/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId: payload.data.notificationId,
        status: "received",
      }),
    }).catch((err) => console.error("Failed to track notification:", err));
  }
});

// 5️⃣ Notification-click handler with tracking
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";
  const notificationId = event.notification.data?.notificationId;

  // Track click if ID present
  if (notificationId) {
    fetch("http://192.168.1.6:4000/api/clicks/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId,
        url,
      }),
    }).catch((err) => console.error("Failed to track click:", err));
  }

  // Focus existing tab or open new one
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((wins) => {
        const win = wins.find((w) => w.url === url);
        return win ? win.focus() : clients.openWindow(url);
      })
  );
});

// 6️⃣ Skip waiting & claim clients
self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));
