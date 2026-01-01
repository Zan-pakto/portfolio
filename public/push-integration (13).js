// push-integration.js
(function () {
  const moduleScript = document.createElement("script");
  moduleScript.type = "module";
  moduleScript.textContent = `
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js';

// Configuration
const BACKEND_URL = 'https://demo.nexapush.com';
const firebaseConfig = {
  "apiKey": "AIzaSyBalk9xL597wAu7xy3IEaYyKtThGvKSIc8",
  "authDomain": "test1-68b65.firebaseapp.com",
  "projectId": "test1-68b65",
  "storageBucket": "test1-68b65.firebasestorage.app",
  "messagingSenderId": "1028270206064",
  "appId": "1:1028270206064:web:be2ecce242f6cac9bf18b5",
  "vapidKey": "BPo3xNnsQIjheyBkdpBKI_Ap6NBMSzEkoCycduL3PPuYtGx-ivyZrMLyfULE-J10QzDL4RNQ5ldh8r7buIrkfuM",
  "measurementId": "G-L725Q1GVZN"
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
    vapidKey: 'BPo3xNnsQIjheyBkdpBKI_Ap6NBMSzEkoCycduL3PPuYtGx-ivyZrMLyfULE-J10QzDL4RNQ5ldh8r7buIrkfuM',
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
  "template": "default",
  "title": "Stay Updated!",
  "message": "Get notified about our latest updates and offers. You can unsubscribe anytime.",
  "allowButtonText": "Allow Notifications",
  "denyButtonText": "Not Now",
  "primaryColor": "#3b82f6",
  "backgroundColor": "#ffffff",
  "textColor": "#1f2937",
  "borderRadius": "12",
  "animation": "slideIn",
  "position": "top",
  "showIcon": true,
  "iconUrl": "data:image/png;base64,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",
  "showCloseButton": true,
  "templateType": "default"
};

  var popup = document.createElement('div');
  popup.id = 'custom-permission-popup';
  
  // --- Begin: Template logic for popup positioning and styling ---
  // Both templates use top positioning with sliding animation
  popup.style.position = 'fixed';
  popup.style.top = '20px';
  popup.style.left = '50%';
  popup.style.transform = 'translateX(-50%)';
  popup.style.background = theme.backgroundColor;
  popup.style.color = theme.textColor;
  popup.style.zIndex = 99999;
  popup.style.padding = '20px';
  popup.style.display = 'flex';
  popup.style.alignItems = 'center';
  popup.style.justifyContent = 'flex-start';
  popup.style.fontFamily = 'inherit';
  popup.style.borderRadius = theme.borderRadius + 'px';
  popup.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  popup.style.border = '1px solid ' + theme.primaryColor + '20';
  popup.style.maxWidth = '400px';
  popup.style.width = '90%';
  popup.style.minHeight = '60px';
  popup.style.overflow = 'hidden';
  
  // Create content wrapper for layout
  var contentWrapper = document.createElement('div');
  contentWrapper.style.display = 'flex';
  contentWrapper.style.alignItems = 'center';
  contentWrapper.style.gap = '12px';
  contentWrapper.style.flex = '1';
  
  // --- End: Template logic for popup positioning and styling ---

  // --- Begin: Content creation based on template ---
  if (theme.template === 'only-allow') {
    // Only Allow Button template - vertical layout: icon+title row, message below, button below
    popup.style.flexDirection = 'column';
    popup.style.alignItems = 'flex-start';
    popup.style.textAlign = 'left';
    popup.style.justifyContent = 'flex-start';
    
    // Icon and title row
    var headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.alignItems = 'flex-start';
    headerRow.style.gap = '12px';
    headerRow.style.marginBottom = '8px';
    headerRow.style.width = '100%';
    
    if (theme.showIcon !== false) {
      var icon = document.createElement('div');
      icon.style.width = '32px';
      icon.style.height = '32px';
      icon.style.background = 'transparent';
      icon.style.borderRadius = '50%';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      icon.style.flexShrink = '0';
      if (theme.iconUrl && theme.iconUrl.trim() !== '') {
        icon.innerHTML = '<img src="' + theme.iconUrl + '" alt="icon" style="width:32px;height:32px;border-radius:50%" />';
      } else {
        icon.innerHTML = '<svg width="20" height="20" fill="' + theme.primaryColor + '" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7v3.586l-.707.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L19 12.586V9a7 7 0 0 0-7-7zm0 18a3 3 0 0 0 2.995-2.824L15 17h-6a3 3 0 0 0 2.824 2.995L12 20z"></path></svg>';
      }
      headerRow.appendChild(icon);
    }
    
    var title = document.createElement('div');
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1rem';
    title.style.lineHeight = '1.3';
    title.style.flex = '1';
    title.textContent = theme.title || 'Allow Notifications';
    headerRow.appendChild(title);
    
    popup.appendChild(headerRow);
    
    // Message below title
    if (theme.message && theme.message.trim() !== '') {
      var msg = document.createElement('div');
      msg.style.fontSize = '0.9rem';
      msg.style.marginBottom = '16px';
      msg.style.color = theme.textColor;
      msg.style.opacity = '0.8';
      msg.style.lineHeight = '1.4';
      msg.textContent = theme.message;
      popup.appendChild(msg);
    }
    
    // Allow button below message
    var allowBtn = document.createElement('button');
    allowBtn.textContent = theme.allowButtonText || 'Allow';
    allowBtn.style.background = theme.primaryColor;
    allowBtn.style.color = '#fff';
    allowBtn.style.border = 'none';
    allowBtn.style.borderRadius = '6px';
    allowBtn.style.padding = '10px 20px';
    allowBtn.style.cursor = 'pointer';
    allowBtn.style.fontSize = '0.9rem';
    allowBtn.style.fontWeight = '500';
    allowBtn.style.width = '100%';
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
    
    popup.appendChild(allowBtn);
    
  } else {
    // Default template - vertical layout: icon+title row, message below, buttons below
    popup.style.flexDirection = 'column';
    popup.style.alignItems = 'flex-start';
    popup.style.textAlign = 'left';
    popup.style.justifyContent = 'flex-start';
    
    // Icon and title row
    var headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.alignItems = 'flex-start';
    headerRow.style.gap = '12px';
    headerRow.style.marginBottom = '8px';
    headerRow.style.width = '100%';
    
    if (theme.showIcon !== false) {
      var icon = document.createElement('div');
      icon.style.width = '32px';
      icon.style.height = '32px';
      icon.style.background = 'transparent';
      icon.style.borderRadius = '50%';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      icon.style.flexShrink = '0';
      if (theme.iconUrl && theme.iconUrl.trim() !== '') {
        icon.innerHTML = '<img src="' + theme.iconUrl + '" alt="icon" style="width:32px;height:32px;border-radius:50%" />';
      } else {
        icon.innerHTML = '<svg width="20" height="20" fill="' + theme.primaryColor + '" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7v3.586l-.707.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L19 12.586V9a7 7 0 0 0-7-7zm0 18a3 3 0 0 0 2.995-2.824L15 17h-6a3 3 0 0 0 2.824 2.995L12 20z"></path></svg>';
      }
      headerRow.appendChild(icon);
    }
    
    var title = document.createElement('div');
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1rem';
    title.style.lineHeight = '1.3';
    title.style.flex = '1';
    title.textContent = theme.title || 'Allow Notifications';
    headerRow.appendChild(title);
    
    popup.appendChild(headerRow);
    
    // Message below title
    if (theme.message && theme.message.trim() !== '') {
      var msg = document.createElement('div');
      msg.style.fontSize = '0.9rem';
      msg.style.marginBottom = '16px';
      msg.style.color = theme.textColor;
      msg.style.opacity = '0.8';
      msg.style.lineHeight = '1.4';
      msg.textContent = theme.message;
      popup.appendChild(msg);
    }
    
    // Buttons below message
    var btnRow = document.createElement('div');
    btnRow.style.display = 'flex';
    btnRow.style.gap = '10px';
    btnRow.style.width = '100%';
    
    // Create deny button (only for default template)
    if (theme.denyButtonText && theme.denyButtonText.trim() !== '') {
      var denyBtn = document.createElement('button');
      denyBtn.textContent = theme.denyButtonText;
      denyBtn.style.background = 'transparent';
      denyBtn.style.color = theme.textColor;
      denyBtn.style.border = '1px solid ' + theme.textColor + '40';
      denyBtn.style.borderRadius = '6px';
      denyBtn.style.padding = '10px 20px';
      denyBtn.style.cursor = 'pointer';
      denyBtn.style.fontSize = '0.9rem';
      denyBtn.style.fontWeight = '500';
      denyBtn.onclick = function () { popup.remove(); };
      btnRow.appendChild(denyBtn);
    }
    
    // Create allow button
    var allowBtn = document.createElement('button');
    allowBtn.textContent = theme.allowButtonText || 'Allow';
    allowBtn.style.background = theme.primaryColor;
    allowBtn.style.color = '#fff';
    allowBtn.style.border = 'none';
    allowBtn.style.borderRadius = '6px';
    allowBtn.style.padding = '10px 20px';
    allowBtn.style.cursor = 'pointer';
    allowBtn.style.fontSize = '0.9rem';
    allowBtn.style.fontWeight = '500';
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
    
    btnRow.appendChild(allowBtn);
    popup.appendChild(btnRow);
  }
  
  // Add close button if enabled
  if (theme.showCloseButton) {
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '×';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '8px';
    closeBtn.style.right = '12px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1.3rem';
    closeBtn.style.color = theme.textColor;
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = function () { popup.remove(); };
    popup.appendChild(closeBtn);
  }
  
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
    
    if (theme.template === 'only-allow') {
      popup.style.animation = 'bannerSlideIn ' + animationDuration + ' ' + animationEasing;
    } else if (theme.template === 'overlay') {
      popup.style.animation = 'overlayFadeIn ' + animationDuration + ' ' + animationEasing;
    } else if (theme.template === 'modal') {
      if (theme.animation === 'slideIn') {
        popup.style.animation = 'slideInFromTop ' + animationDuration + ' ' + animationEasing;
      } else if (theme.animation === 'fadeIn') {
        popup.style.animation = 'fadeIn ' + animationDuration + ' ' + animationEasing;
      } else if (theme.animation === 'bounceIn') {
        popup.style.animation = 'bounceIn ' + animationDuration + ' ' + animationEasing;
      } else if (theme.animation === 'zoomIn') {
        popup.style.animation = 'zoomIn ' + animationDuration + ' ' + animationEasing;
      }
    } else {
      // Default templates (modern, gradient, dark, minimal, rounded, glassmorphism)
      if (theme.animation === 'slideIn') {
        if (theme.position === 'top') {
          popup.style.animation = 'slideInFromTop ' + animationDuration + ' ' + animationEasing;
        } else if (theme.position === 'bottom') {
          popup.style.animation = 'slideInFromBottom ' + animationDuration + ' ' + animationEasing;
        } else if (theme.position === 'topLeft') {
          popup.style.animation = 'slideInFromLeft ' + animationDuration + ' ' + animationEasing;
        } else if (theme.position === 'topRight') {
          popup.style.animation = 'slideInFromRight ' + animationDuration + ' ' + animationEasing;
        } else {
          // center, bottomLeft, bottomRight
          popup.style.animation = 'slideInFromTop ' + animationDuration + ' ' + animationEasing;
        }
      } else if (theme.animation === 'fadeIn') {
        popup.style.animation = 'fadeIn ' + animationDuration + ' ' + animationEasing;
      } else if (theme.animation === 'bounceIn') {
        popup.style.animation = 'bounceIn ' + animationDuration + ' ' + animationEasing;
      } else if (theme.animation === 'zoomIn') {
        popup.style.animation = 'zoomIn ' + animationDuration + ' ' + animationEasing;
      }
    }
  }
}`;
  document.head.appendChild(moduleScript);
})();
