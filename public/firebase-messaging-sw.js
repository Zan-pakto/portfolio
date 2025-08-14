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

// 4️⃣ Handle background messages - Show ONLY custom notifications
onBackgroundMessage(messaging, async (payload) => {
  console.log("Background message received:", payload);
  console.log("Payload data:", payload.data);
  console.log("Payload webpush:", payload.webpush);

  // IMPORTANT: Return early to prevent FCM from showing default notification
  // This ensures only our custom notification shows

  // Extract URL from payload - prioritize data.url over webpush.fcmOptions.link
  let targetUrl = "/";

  if (payload.data?.url) {
    targetUrl = payload.data.url;
  } else if (payload.webpush?.fcmOptions?.link) {
    targetUrl = payload.webpush.fcmOptions.link;
  }

  console.log("Target URL extracted:", targetUrl);
  console.log("Image URL:", payload.data?.image);
  console.log("Icon URL:", payload.data?.icon);

  // Validate image URL
  let imageUrl = payload.data?.image;
  console.log("Raw image from payload:", imageUrl);

  if (imageUrl) {
    // Ensure image URL is absolute
    if (!imageUrl.startsWith("http://") && !imageUrl.startsWith("https://")) {
      imageUrl = new URL(imageUrl, self.location.origin).href;
    }
    console.log("Processed Image URL:", imageUrl);

    // Test if image is accessible
    try {
      const imgResponse = await fetch(imageUrl, { method: "HEAD" });
      console.log(
        "Image accessibility test:",
        imgResponse.ok ? "SUCCESS" : "FAILED",
        imgResponse.status
      );
    } catch (error) {
      console.log("Image accessibility test FAILED:", error.message);
    }
  }

  // Show custom notification
  const notificationOptions = {
    body: payload.data?.body || "",
    icon: payload.data?.icon || "/favicon.ico",
    image: payload.data?.image || null,
    badge: "/favicon.ico",
    tag: payload.data?.notificationId || "default", // Prevent duplicate notifications
    data: {
      url: targetUrl,
      notificationId: payload.data?.notificationId || null,
    },
  };

  // Only add image if we have a valid image URL
  if (imageUrl) {
    notificationOptions.image = imageUrl;
    console.log("Adding image to notification:", imageUrl);
  } else {
    console.log("No valid image URL found, skipping image");
  }

  // Add some additional notification options for better display
  notificationOptions.requireInteraction = false;
  notificationOptions.silent = false;
  notificationOptions.vibrate = [200, 100, 200];

  self.registration.showNotification(
    payload.data?.title || "Notification",
    notificationOptions
  );

  // Track "received"
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

  const rawUrl = event.notification.data?.url || "/";
  const notificationId = event.notification.data?.notificationId;

  console.log("Raw URL from notification:", rawUrl);

  // Track click
  if (notificationId) {
    fetch("http://192.168.1.6:4000/api/clicks/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId, url: rawUrl }),
    }).catch((err) => console.error("Failed to track click:", err));
  }

  // Normalize URL - Fix URL merging issue
  let finalUrl = rawUrl;

  // If it's already a complete URL with protocol, use as is
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    finalUrl = rawUrl;
  }
  // If it's a relative path (starts with /), keep as is
  else if (rawUrl.startsWith("/")) {
    finalUrl = rawUrl;
  }
  // If it's a domain without protocol, add https://
  else if (rawUrl.includes(".") && !rawUrl.startsWith("/")) {
    finalUrl = `https://${rawUrl}`;
  }
  // For any other case, treat as relative path
  else {
    finalUrl = `/${rawUrl}`;
  }

  console.log("Final normalized URL:", finalUrl);

  // Open or focus window
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((wins) => {
        const matchingWin = wins.find((w) => w.url.includes(finalUrl));
        return matchingWin ? matchingWin.focus() : clients.openWindow(finalUrl);
      })
  );
});

// 6️⃣ Skip waiting & claim clients
self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));
