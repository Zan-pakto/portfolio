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

// 4️⃣ Handle background messages - Let FCM handle notification display automatically
onBackgroundMessage(messaging, (payload) => {
  console.log("Background message received:", payload);
  console.log(
    "Background message - webpush.fcmOptions:",
    payload.webpush?.fcmOptions
  );
  console.log("Background message - data:", payload.data);

  // Only track the notification if needed - don't create duplicate notifications
  if (payload.data?.notificationId) {
    // Track notification received (optional)
    fetch("http://192.168.1.6:4000/api/notifications/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId: payload.data.notificationId,
        status: "received",
      }),
    }).catch((error) => {
      console.error("Failed to track notification:", error);
    });
  }
});

// 5️⃣ Notification-click handler with tracking
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Debug: Log all notification data
  console.log("Notification clicked - All data:", event.notification.data);
  console.log("Notification clicked - All notification:", event.notification);

  // Get URL from FCM notification data - ONLY use webpush.fcmOptions.link if present
  // If not present, fall back to '/'
  let url =
    event.notification.data?.webpush?.fcmOptions?.link ||
    event.notification.data?.url ||
    event.notification.data?.click_action ||
    "/";

  console.log("Selected URL:", url);
  const notificationId = event.notification.data?.notificationId;

  // Normalize URL to ensure it has proper protocol
  const normalizeUrl = (url) => {
    if (!url || url === "/") return "/";

    // If it's already a full URL with protocol, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    // If it starts with www. or contains a domain (has dots), add https://
    if (url.startsWith("www.") || (url.includes(".") && !url.startsWith("/"))) {
      return `https://${url}`;
    }

    // If it's a relative path (starts with /), return as is
    if (url.startsWith("/")) {
      return url;
    }

    // For any other case, treat as relative path
    return `/${url}`;
  };

  url = normalizeUrl(url);

  // Track the click if we have a notification ID
  if (notificationId) {
    fetch("http://192.168.1.6:4000/api/clicks/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId: notificationId,
        url: url,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Click tracking failed");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Click tracked successfully:", data);
      })
      .catch((error) => {
        console.error("Failed to track click:", error);
        // Don't let click tracking failure prevent the URL from opening
      });
  }

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
