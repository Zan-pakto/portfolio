// push-integration.js
// Dynamically injects a module script to integrate Firebase v10.12 push notifications
(function() {
  const moduleScript = document.createElement('script');
  moduleScript.type = 'module';
  moduleScript.textContent = `
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js';

// Configuration - Update these values for your setup
const API_ENDPOINT = 'https://demo.nexapush.com/api/client-info';

// 1️⃣ Initialize Firebase in the page context
const firebaseConfig = {
  apiKey: "AIzaSyBalk9xL597wAu7xy3IEaYyKtThGvKSIc8",
  authDomain: "test1-68b65.firebaseapp.com",
  projectId: "test1-68b65",
  storageBucket: "test1-68b65.firebasestorage.app",
  messagingSenderId: "1028270206064",
  appId: "1:1028270206064:web:be2ecce242f6cac9bf18b5",
  measurementId: "G-L725Q1GVZN"
};
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// 2️⃣ Register the Service Worker as a module
navigator.serviceWorker.register('/firebase-messaging-sw.js', { type: 'module' })
  .then(registration => {
    console.log('Service Worker registered as module:', registration);

    // 3️⃣ Request Notification permission
    return Notification.requestPermission()
      .then(permission => {
        if (permission !== 'granted') {
          throw new Error('Notification permission not granted');
        }
        // 4️⃣ Get FCM token using our SW registration
                 return getToken(messaging, {
           vapidKey: 'BPo3xNnsQIjheyBkdpBKI_Ap6NBMSzEkoCycduL3PPuYtGx-ivyZrMLyfULE-J10QzDL4RNQ5ldh8r7buIrkfuM',
           serviceWorkerRegistration: registration
         });
      });
  })
  .then(token => {
    console.log('FCM Token:', token);
    // Send token to backend
    fetch('https://demo.nexapush.com/api/client-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        firebaseMessagingToken: token, 
        firebaseAuthToken: 'dummy-auth-token', // Required by backend
        domain: 'portfolio-one-sand-51.vercel.app' 
      })
    })
    .then(response => {
      if (response.ok) {
        console.log('Token saved successfully');
      } else {
        console.error('Failed to save token:', response.status);
      }
    })
    .catch(error => {
      console.error('Error saving token:', error);
    });
  })
  .catch(err => console.error('FCM initialization error:', err));

// 5️⃣ Handle in-page foreground messages (optional)
// Commented out to prevent duplicate notifications
// onMessage(messaging, payload => {
//   console.log('Foreground message received:', payload);
//   // e.g., show a toast or custom UI
// });

// Managed by NexaPush - top right label (disappears after 5s)
var brandingConfig = {"_id":"1","id":"global","brandName":"Nexapush","brandUrl":"https://nexapush.com","logoUrl":"https://shorturl.at/rto74","youtubeVideoUrl":"https://youtu.be/bIdqbu2SL08","showBranding":true,"createdAt":"2026-01-27T03:23:52.720Z","updatedAt":"2026-04-28T04:36:37.376Z"};
if (brandingConfig.showBranding) {
  (function() {
    function __showManagedBy() {
      try {
        var mb = document.createElement('a');
        mb.href = brandingConfig.brandUrl || 'https://nexapush.com';
        mb.target = '_blank';
        mb.rel = 'noopener noreferrer';
        mb.textContent = 'Managed by ' + (brandingConfig.brandName || 'NexaPush');
        mb.style.cssText = 'position:fixed;top:16px;right:16px;z-index:2147483647;background:transparent;color:rgba(0,0,0,0.6);font-size:11px;font-family:sans-serif;text-decoration:none;opacity:1;transition:opacity 0.5s;pointer-events:auto;white-space:nowrap;';
        document.body && document.body.appendChild(mb);
        setTimeout(function() {
          mb.style.opacity = '0';
          setTimeout(function() { mb.parentNode && mb.parentNode.removeChild(mb); }, 500);
        }, 5000);
      } catch(e) {}
    }
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', __showManagedBy);
    } else {
      __showManagedBy();
    }
  })();
}

`;

  document.head.appendChild(moduleScript);
})();
