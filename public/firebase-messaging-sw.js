// firebase-messaging-sw.js

// 1️⃣ Import the modular SDK directly
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getMessaging, onBackgroundMessage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-sw.js';

// 2️⃣ Your Firebase config
const firebaseConfig = {
  apiKey:            "AIzaSyAYLKwvkcorfHF6jfj9dQkHfsY-oSPY3rM",
  authDomain:        "basic-224c7.firebaseapp.com",
  projectId:         "basic-224c7",
  storageBucket:     "basic-224c7.firebasestorage.app",
  messagingSenderId: "241479667416",
  appId:             "1:241479667416:web:c182ccbadc9008bd0f91ad",
  measurementId:     "G-KN5K9X56BX"
};

// 3️⃣ Initialize the app & messaging
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 4️⃣ Handle background messages
onBackgroundMessage(messaging, payload => {
  const { title = 'Notification', body, icon, click_action } = payload.notification || {};
  const options = {
    body,
    icon: icon || '/favicon.ico',
    data: { 
      url: click_action || '/',
      notificationId: payload.data?.notificationId || null
    }
  };
  self.registration.showNotification(title, options);
});

// 5️⃣ Notification-click handler with tracking
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  const notificationId = event.notification.data?.notificationId;
  
  // Track the click if we have a notification ID
  if (notificationId) {
    fetch('https://api.eniacworld.com/api/clicks/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notificationId: notificationId,
        url: url
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Click tracking failed');
      }
      return response.json();
    })
    .then(data => {
      console.log('Click tracked successfully:', data);
    })
    .catch(error => {
      console.error('Failed to track click:', error);
      // Don't let click tracking failure prevent the URL from opening
    });
  }
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(wins => {
        const win = wins.find(w => w.url === url);
        return win ? win.focus() : clients.openWindow(url);
      })
  );
});

// 6️⃣ Skip waiting & claim clients
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));