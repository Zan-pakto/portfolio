// firebase-messaging-sw.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getMessaging,
  onBackgroundMessage,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-sw.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB2SSldCQjLWMmyvuGKlnPa_va84SR971o",
  authDomain: "testpush-38190.firebaseapp.com",
  projectId: "testpush-38190",
  storageBucket: "testpush-38190.firebasestorage.app",
  messagingSenderId: "490727428858",
  appId: "1:490727428858:web:e0525374114f29553b2f43",
  measurementId: "G-2JV0VF2FEQ",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Show custom notifications from payload
onBackgroundMessage(messaging, async (payload) => {
  console.log("Background message received:", payload);

  const targetUrl =
    payload.data?.url ||
    payload.webpush?.fcmOptions?.link ||
    "/";

  const notificationOptions = {
    body: payload.data?.body || "",
    icon: payload.data?.icon || "/favicon.ico",
    badge: "/favicon.ico",
    tag: payload.data?.notificationId || "default",
    data: {
      url: targetUrl,
      notificationId: payload.data?.notificationId || null,
    },
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
  };

  if (payload.data?.image) {
    notificationOptions.image = payload.data.image; // direct assign
    console.log("Image added from payload:", payload.data.image);
  }

  // ✅ FIX: Properly handle the promise with event.waitUntil()
  const notificationPromise = self.registration.showNotification(
    payload.data?.title || "Notification",
    notificationOptions
  );

  // Track received
  if (payload.data?.notificationId) {
    const trackingPromise = fetch("https://ompush.edugic.com/api/notifications/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId: payload.data.notificationId,
        status: "received",
      }),
    }).catch((err) => console.error("Failed to track notification:", err));

    // Wait for both notification display and tracking to complete
    await Promise.all([notificationPromise, trackingPromise]);
  } else {
    // Wait for notification display to complete
    await notificationPromise;
  }
});

// Click handler — no normalization, just open raw
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const rawUrl = event.notification.data?.url || "/";
  const notificationId = event.notification.data?.notificationId;

  console.log("Raw URL from notification:", rawUrl);

  if (notificationId) {
    fetch("https://ompush.edugic.com/api/clicks/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId, url: rawUrl }),
    }).catch((err) => console.error("Failed to track click:", err));
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((wins) => {
        const matchingWin = wins.find((w) => w.url.includes(rawUrl));
        return matchingWin ? matchingWin.focus() : clients.openWindow(rawUrl);
      })
  );
});

self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));