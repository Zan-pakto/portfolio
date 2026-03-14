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
  "iconUrl": "",
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
  
  // Add custom branding\n  if (true) {\n    var brandingLink = document.createElement('a');\n    brandingLink.href = 'https://nexapush.com';\n    brandingLink.target = '_blank';\n    brandingLink.rel = 'noopener noreferrer';\n    brandingLink.style.position = 'absolute';\n    brandingLink.style.bottom = '4px';\n    brandingLink.style.left = '50%';\n    brandingLink.style.transform = 'translateX(-50%)';\n    brandingLink.style.fontSize = '10px';\n    brandingLink.style.color = theme.textColor;\n    brandingLink.style.opacity = '0.7';\n    brandingLink.style.fontFamily = 'inherit';\n    brandingLink.style.textAlign = 'center';\n    brandingLink.style.display = 'inline-flex';\n    brandingLink.style.alignItems = 'center';\n    brandingLink.style.gap = '4px';\n    brandingLink.style.textDecoration = 'none';\n    var logo = document.createElement('img');\n    logo.src = 'https://shorturl.at/rto74';\n    logo.alt = 'Nexapush logo';\n    logo.style.height = '12px';\n    logo.style.width = 'auto';\n    logo.style.display = 'inline-block';\n    var brandText = document.createElement('span');\n    brandText.innerHTML = 'Powered by <span style="text-decoration: underline;">Nexapush</span>';\n    brandingLink.appendChild(logo);\n    brandingLink.appendChild(brandText);\n    popup.appendChild(brandingLink);\n  }\n  
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
