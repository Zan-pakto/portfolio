// push-integration.js
(function () {
  const moduleScript = document.createElement("script");
  moduleScript.type = "module";
  moduleScript.textContent = `
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js';

// Configuration
const BACKEND_URL = 'http://localhost:4000';
const firebaseConfig = {
  "apiKey": "AIzaSyAYLKwvkcorfHF6jfj9dQkHfsY-oSPY3rM",
  "authDomain": "basic-224c7.firebaseapp.com",
  "projectId": "basic-224c7",
  "storageBucket": "basic-224c7.firebasestorage.app",
  "messagingSenderId": "241479667416",
  "appId": "1:241479667416:web:c182ccbadc9008bd0f91ad",
  "vapidKey": "BIRubV6XANL26x6VLCwafEd_8U_HbV53dbjywbFxS13JKgnXWg6bsw-RkssnUwbwJ01DYKeayN44pUCNPq3XuIQ",
  "measurementId": "G-KN5K9X56BX"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
let swRegistration = null;

// Guard flag to avoid multiple popups
window._customPopupFlowStarted = window._customPopupFlowStarted || false;

// 🔍 Detect any page reload trigger
window.addEventListener("beforeunload", () => {
  console.trace("🔄 Page is reloading");
});

// Register Service Worker only once
navigator.serviceWorker.getRegistrations().then(registrations => {
  const alreadyRegistered = registrations.some(r => r.active && r.active.scriptURL.includes('firebase-messaging-sw.js'));
  if (!alreadyRegistered) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js', { type: 'module' })
      .then(reg => {
        console.log('✅ Service Worker registered:', reg);
        swRegistration = reg;
        initPopupFlow();
      })
      .catch(err => console.error('❌ SW registration failed:', err));
  } else {
    console.log('⚠️ Service Worker already registered.');
    swRegistration = registrations.find(r => r.active && r.active.scriptURL.includes('firebase-messaging-sw.js'));
    initPopupFlow();
  }
});

// Start popup + monitor only once
function initPopupFlow() {
  if (window._customPopupFlowStarted) return;
  window._customPopupFlowStarted = true;

  showCustomPermissionPopup();
  monitorNativePermission(); // auto-send if system prompt used
}

// Auto-send token if user accepts browser prompt
function monitorNativePermission() {
  if (window.Notification && Notification.permission === 'default') {
    navigator.permissions.query({ name: 'notifications' }).then(status => {
      status.onchange = function () {
        if (status.state === 'granted') {
          console.log('✅ Permission granted via system prompt');
          sendTokenToBackend();
        }
      };
    });
  }
}

// Get token and send to backend
function sendTokenToBackend() {
  getToken(messaging, {
    vapidKey: firebaseConfig.vapidKey,
    serviceWorkerRegistration: swRegistration
  }).then(token => {
    console.log('📲 Token:', token);
    fetch(\`\${BACKEND_URL}/api/client-info\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firebaseMessagingToken: token,
        firebaseAuthToken: 'dummy-auth-token',
        domain: window.location.origin
      })
    }).then(res => {
      if (res.ok) {
        console.log('✅ Token sent to backend');
      } else {
        console.error('❌ Backend rejected token:', res.status);
      }
    }).catch(err => console.error('❌ Failed to send token:', err));
  }).catch(err => console.error('❌ Failed to get token:', err));
}

// Custom Permission Popup
function showCustomPermissionPopup() {
  if (window.Notification && Notification.permission !== 'default') return;
  if (document.getElementById('custom-permission-popup')) return;

  var theme = {
    "enabled": true,
    "title": "hello",
    "message": "asdf",
    "iconUrl": "https://www.pngmart.com/files/9/YouTube-Bell-Icon-PNG-Free-Download.png",
    "allowButtonText": "allow",
    "denyButtonText": "deny",
    "primaryColor": "#3b82f6",
    "backgroundColor": "#ffffff",
    "textColor": "#1f2937",
    "borderRadius": "12"
  };

  var popup = document.createElement('div');
  popup.id = 'custom-permission-popup';
  popup.style.position = 'fixed';
  popup.style.bottom = '20px';
  popup.style.right = '20px';
  popup.style.background = theme.backgroundColor;
  popup.style.color = theme.textColor;
  popup.style.borderRadius = theme.borderRadius + 'px';
  popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  popup.style.padding = '12px 16px';
  popup.style.zIndex = '9999';
  popup.style.maxWidth = '280px';
  popup.style.fontFamily = 'sans-serif';

  var title = document.createElement('div');
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '4px';
  title.textContent = theme.title;
  popup.appendChild(title);

  var msg = document.createElement('div');
  msg.style.fontSize = '0.9rem';
  msg.style.marginBottom = '10px';
  msg.textContent = theme.message;
  popup.appendChild(msg);

  var btnRow = document.createElement('div');
  btnRow.style.display = 'flex';
  btnRow.style.gap = '8px';

  var allowBtn = document.createElement('button');
  allowBtn.textContent = theme.allowButtonText;
  allowBtn.style.background = theme.primaryColor;
  allowBtn.style.color = '#fff';
  allowBtn.style.border = 'none';
  allowBtn.style.borderRadius = '6px';
  allowBtn.style.padding = '6px 12px';
  allowBtn.style.cursor = 'pointer';
  allowBtn.onclick = function () {
    popup.remove();
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
          sendTokenToBackend();
        }
      });
    }
  };

  var denyBtn = document.createElement('button');
  denyBtn.textContent = theme.denyButtonText;
  denyBtn.style.background = '#e5e7eb';
  denyBtn.style.color = theme.textColor;
  denyBtn.style.border = 'none';
  denyBtn.style.borderRadius = '6px';
  denyBtn.style.padding = '6px 12px';
  denyBtn.style.cursor = 'pointer';
  denyBtn.onclick = function () { popup.remove(); };

  btnRow.appendChild(allowBtn);
  btnRow.appendChild(denyBtn);
  popup.appendChild(btnRow);

  document.body.appendChild(popup);
}
`;
  document.head.appendChild(moduleScript);
})();
