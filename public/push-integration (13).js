// push-integration.js
// Dynamically injects a module script to integrate Firebase v10.12 push notifications
(function() {
  const moduleScript = document.createElement('script');
  moduleScript.type = 'module';
  moduleScript.textContent = `
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js';

// Configuration - Update these values for your setup
const API_ENDPOINT = 'https://api.eniacworld.com/api/client-info';

// 1️⃣ Initialize Firebase in the page context
const firebaseConfig = {
  apiKey: "AIzaSyAYLKwvkcorfHF6jfj9dQkHfsY-oSPY3rM",
  authDomain: "basic-224c7.firebaseapp.com",
  projectId: "basic-224c7",
  storageBucket: "basic-224c7.firebasestorage.app",
  messagingSenderId: "241479667416",
  appId: "1:241479667416:web:c182ccbadc9008bd0f91ad",
  measurementId: "G-KN5K9X56BX"
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
           vapidKey: 'BIRubV6XANL26x6VLCwafEd_8U_HbV53dbjywbFxS13JKgnXWg6bsw-RkssnUwbwJ01DYKeayN44pUCNPq3XuIQ',
           serviceWorkerRegistration: registration
         });
      });
  })
  .then(token => {
    console.log('FCM Token:', token);
    // Send token to backend
    fetch('https://api.eniacworld.com/api/client-info', {
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

// Branding footer (logo + clickable link) after DOM is ready
function __prAddBranding() {
  try {
    var pr = document.createElement('a');
    pr.href = 'https://pushrocket.app';
    pr.target = '_blank';
    pr.rel = 'noopener noreferrer';
    pr.style.position = 'fixed';
    pr.style.bottom = '6px';
    pr.style.left = '50%';
    pr.style.transform = 'translateX(-50%)';
    pr.style.fontSize = '10px';
    pr.style.opacity = '0.7';
    pr.style.color = '#1f2937';
    pr.style.fontFamily = 'inherit';
    pr.style.display = 'inline-flex';
    pr.style.alignItems = 'center';
    pr.style.gap = '4px';
    pr.style.textDecoration = 'none';
    pr.style.zIndex = '2147483647';
    var prImg = document.createElement('img');
    prImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%233b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7l-4-4L5 13z"/><path d="M2 22l4-1 1-4-4 1-1 4z"/></svg>';
    prImg.alt = 'PushRocket logo';
    prImg.style.height = '12px';
    prImg.style.width = '12px';
    var prText = document.createElement('span');
    prText.innerHTML = 'Powered by <span style="text-decoration: underline;">PushRocket</span>';
    pr.appendChild(prImg);
    pr.appendChild(prText);
    document.body && document.body.appendChild(pr);
  } catch (e) {}
}
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', __prAddBranding);
} else {
  __prAddBranding();
}

`;

  document.head.appendChild(moduleScript);
})();
