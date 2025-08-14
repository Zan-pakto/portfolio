import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-sw.js";

const firebaseConfig = {
  apiKey: "AIzaSyAYLKwvkcorfHF6jfj9dQkHfsY-oSPY3rM",
  authDomain: "basic-224c7.firebaseapp.com",
  projectId: "basic-224c7",
  storageBucket: "basic-224c7.firebasestorage.app",
  messagingSenderId: "241479667416",
  appId: "1:241479667416:web:c182ccbadc9008bd0f91ad",
  measurementId: "G-KN5K9X56BX",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ✅ Only show notification manually
onBackgroundMessage(messaging, (payload) => {
  console.log("Background message received:", payload);

  const targetUrl =
    payload.data?.url ||
    payload.webpush?.fcmOptions?.link ||
    "/";

  self.registration.showNotification(
    payload.data?.title || "Notification",
    {
      body: payload.data?.body || "",
      icon: payload.data?.icon || "/favicon.ico",
      data: {
        url: targetUrl,
        notificationId: payload.data?.notificationId || null,
      },
    }
  );

  if (payload.data?.notificationId) {
    fetch("http://192.168.1.6:4000/api/notifications/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId: payload.data.notificationId,
        status: "received",
      }),
    }).catch((err) =>
      console.error("Failed to track notification:", err)
    );
  }
});

// ✅ Handle clicks properly
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const rawUrl = event.notification.data?.url || "/";
  const notificationId = event.notification.data?.notificationId;

  if (notificationId) {
    fetch("http://192.168.1.6:4000/api/clicks/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId, url: rawUrl }),
    }).catch((err) => console.error("Failed to track click:", err));
  }

  // Always ensure the URL is absolute or root-relative
  const finalUrl =
    rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : rawUrl.startsWith("/")
      ? rawUrl
      : `https://${rawUrl}`;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      const matchingWin = wins.find((w) => w.url.includes(finalUrl));
      return matchingWin ? matchingWin.focus() : clients.openWindow(finalUrl);
    })
  );
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));
