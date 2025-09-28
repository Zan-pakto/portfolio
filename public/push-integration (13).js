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
        showCustomPermissionPopup();
        monitorNativePermission(); // auto-send if system prompt used
      })
      .catch(err => console.error('❌ SW registration failed:', err));
  } else {
    console.log('⚠️ Service Worker already registered.');
    swRegistration = registrations.find(r => r.active && r.active.scriptURL.includes('firebase-messaging-sw.js'));
    showCustomPermissionPopup();
    monitorNativePermission(); // auto-send if system prompt used
  }
});

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
    vapidKey: 'BIRubV6XANL26x6VLCwafEd_8U_HbV53dbjywbFxS13JKgnXWg6bsw-RkssnUwbwJ01DYKeayN44pUCNPq3XuIQ',
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

  // --- Begin: Content creation based on template ---
  
    
    var textContent = document.createElement('div');
    textContent.style.flex = '1';
    textContent.style.minWidth = '0';
    
    var title = document.createElement('div');
    title.style.fontWeight = 'bold';
    title.style.fontSize = '0.9rem';
    title.style.marginBottom = '2px';
    title.style.whiteSpace = 'nowrap';
    title.style.overflow = 'hidden';
    title.style.textOverflow = 'ellipsis';
    title.textContent = theme.title;
    textContent.appendChild(title);
    
    var msg = document.createElement('div');
    msg.style.fontSize = '0.8rem';
    msg.style.opacity = '0.8';
    msg.style.whiteSpace = 'nowrap';
    msg.style.overflow = 'hidden';
    msg.style.textOverflow = 'ellipsis';
    msg.textContent = theme.message;
    textContent.appendChild(msg);
    
    contentWrapper.appendChild(textContent);
    popup.appendChild(contentWrapper);
    
    var btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '6px';
    btnRow.style.alignItems = 'center';
    btnRow.style.flexShrink = '0';
    
  }
    
 

  
    
    var btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '10px';
    btnRow.style.marginBottom = '8px';
  }
  
  // Create buttons
  var allowBtn = document.createElement('button');
  allowBtn.textContent = theme.allowButtonText;
  allowBtn.style.background = theme.primaryColor;
  allowBtn.style.color = '#fff';
  allowBtn.style.border = 'none';
  allowBtn.style.borderRadius = '6px';
  allowBtn.style.padding = theme.template === 'banner' ? '6px 12px' : '8px 16px';
  allowBtn.style.cursor = 'pointer';
  allowBtn.style.fontSize = theme.template === 'banner' ? '0.875rem' : '1rem';
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
  denyBtn.style.padding = theme.template === 'banner' ? '6px 12px' : '8px 16px';
  denyBtn.style.cursor = 'pointer';
  denyBtn.style.fontSize = theme.template === 'banner' ? '0.875rem' : '1rem';
  denyBtn.onclick = function () { popup.remove(); };
  
  btnRow.appendChild(allowBtn);
  btnRow.appendChild(denyBtn);
  
  if (theme.template === 'overlay') {
    contentContainer.appendChild(btnRow);
    popup.appendChild(contentContainer);
  } else {
    popup.appendChild(btnRow);
  }
  
  // Add close button if enabled
  if (theme.showCloseButton) {
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = theme.template === 'banner' ? '50%' : '8px';
    closeBtn.style.right = '12px';
    closeBtn.style.transform = theme.template === 'banner' ? 'translateY(-50%)' : 'none';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1.3rem';
    closeBtn.style.color = theme.textColor;
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = function () { popup.remove(); };
    popup.appendChild(closeBtn);
  }
  
  // --- End: Content creation based on template ---
  
  document.body.appendChild(popup);
  
  // Apply animation based on theme
  if (theme.animation && theme.animation !== 'none') {
    // Add CSS animations
    var style = document.createElement('style');
    style.textContent = \`      @keyframes slideInFromTop {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes slideInFromBottom {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes slideInFromLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideInFromRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes bounceIn {
        0% { transform: scale(0.3); opacity: 0; }
        50% { transform: scale(1.05); opacity: 1; }
        70% { transform: scale(0.9); }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes zoomIn {
        from { transform: scale(0); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      @keyframes bannerSlideIn {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes overlayFadeIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
    \`;
    document.head.appendChild(style);
    
    // Apply animation based on template and animation type
    var animationDuration = '0.5s';
    var animationEasing = 'ease-out';
    
     
    }
  }
}`;
  document.head.appendChild(moduleScript);
})();
