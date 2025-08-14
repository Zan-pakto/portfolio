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

// 4️⃣ Handle background messages - Create notification with target URL
onBackgroundMessage(messaging, payload => {
  console.log('Background message received:', payload);
  
  const { title = 'Notification', body, icon } = payload.notification || {};
  const targetUrl = payload.webpush?.fcmOptions?.link || payload.data?.url || '/';
  
  const options = {
    body,
    icon: icon || '/favicon.ico',
    data: { 
      url: targetUrl,
      notificationId: payload.data?.notificationId || null
    }
  };
  
  self.registration.showNotification(title, options);
});

// 5️⃣ Notification-click handler with tracking
self.addEventListener('notificationclick', event => {
  event.notification.close();
  // Get URL from notification data - this will be the target URL from backend
  let url = event.notification.data?.url || '/';
  const notificationId = event.notification.data?.notificationId;
  
  // Normalize URL to ensure it has proper protocol
  const normalizeUrl = (url) => {
    if (!url || url === '/') return '/';
    
    // If it's already a full URL with protocol, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it starts with www. or contains a domain (has dots), add https://
    if (url.startsWith('www.') || (url.includes('.') && !url.startsWith('/'))) {
      return `https://${url}`;
    }
    
    // If it's a relative path (starts with /), return as is
    if (url.startsWith('/')) {
      return url;
    }
    
    // For any other case, treat as relative path
    return `/${url}`;
  };
  
  url = normalizeUrl(url);
  
  // Track the click if we have a notification ID
  if (notificationId) {
    fetch('http://192.168.1.6:4000/api/clicks/track', {
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