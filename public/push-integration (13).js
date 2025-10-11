// push-integration.js
// Dynamically injects a module script to integrate Firebase v10.12 push notifications
(function() {
  const moduleScript = document.createElement('script');
  moduleScript.type = 'module';
  moduleScript.textContent = `
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js';

// Configuration - Update these values for your setup

const API_ENDPOINT = 'https://ompush.edugic.com/api/client-info';

// 1️⃣ Initialize Firebase in the page context
const firebaseConfig = {
  apiKey: "AIzaSyAtAgWFRzYpYIlvQVTKjBz2hY_Ht2y72_k",
  authDomain: "push-3deeb.firebaseapp.com",
  projectId: "push-3deeb",
  storageBucket: "push-3deeb.firebasestorage.app",
  messagingSenderId: "649140429314",
  appId: "1:649140429314:web:d179bc6a800c49227a7d1b",
  measurementId: "G-NFY1902FKY"
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
          vapidKey: 'BNPwKnDA1qPvIIVqIaV7OjU-NRDE_FI3r_RqXDTB8AMmuXrD2t4yhhn-tKNQzIbTJsd6Z9SHcf1sX---ipCxrsE',
          serviceWorkerRegistration: registration
        });
      });
  })
  .then(token => {
    console.log('FCM Token:', token);
    // Send token to backend
    fetch('https://ompush.edugic.com/api/client-info', {
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
`;

  document.head.appendChild(moduleScript);
})();
