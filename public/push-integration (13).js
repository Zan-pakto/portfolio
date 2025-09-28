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
  "title": "asdfasdf",
  "message": "asdfasdfasdfasfasdfasdfasdfaf",
  "iconUrl": "https://www.pngmart.com/files/9/YouTube-Bell-Icon-PNG-Free-Download.png",
  "allowButtonText": "adfa",
  "denyButtonText": "asdf",
  "template": "default",
  "primaryColor": "#3b82f6",
  "backgroundColor": "#ffffff",
  "textColor": "#1f2937",
  "borderRadius": "12",
  "showIcon": true,
  "showCloseButton": true
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
  
  // Create content wrapper for layout
  var contentWrapper = document.createElement('div');
  contentWrapper.style.display = 'flex';
  contentWrapper.style.alignItems = 'center';
  contentWrapper.style.gap = '12px';
  contentWrapper.style.flex = '1';
  
  // --- End: Template logic for popup positioning and styling ---

  // --- Begin: Content creation based on template ---
  if (theme.template === 'only-allow') {
    // Banner layout: icon + text + buttons horizontally
    if (theme.showIcon) {
      var icon = document.createElement('div');
      icon.style.width = '28px';
      icon.style.height = '28px';
      icon.style.background = theme.primaryColor;
      icon.style.borderRadius = '50%';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      icon.style.flexShrink = '0';
      if (theme.iconUrl && theme.iconUrl.trim() !== '') {
        icon.innerHTML = '<img src="' + theme.iconUrl + '" alt="icon" style="width:16px;height:16px;border-radius:50%" />';
      } else {
        icon.innerHTML = '<svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7v3.586l-.707.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L19 12.586V9a7 7 0 0 0-7-7zm0 18a3 3 0 0 0 2.995-2.824L15 17h-6a3 3 0 0 0 2.824 2.995L12 20z"></path></svg>';
      }
      contentWrapper.appendChild(icon);
    }
    
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
    
  } else {
    // Default vertical layout for other templates
    if (theme.showIcon) {
      var icon = document.createElement('div');
      icon.style.width = '40px';
      icon.style.height = '40px';
      icon.style.background = theme.primaryColor;
      icon.style.borderRadius = '50%';
      icon.style.display = 'flex';
      icon.style.alignItems = 'center';
      icon.style.justifyContent = 'center';
      icon.style.marginBottom = '12px';
      if (theme.iconUrl && theme.iconUrl.trim() !== '') {
        icon.innerHTML = '<img src="' + theme.iconUrl + '" alt="icon" style="width:22px;height:22px;border-radius:50%" />';
      } else {
        icon.innerHTML = '<svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-7 7v3.586l-.707.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L19 12.586V9a7 7 0 0 0-7-7zm0 18a3 3 0 0 0 2.995-2.824L15 17h-6a3 3 0 0 0 2.824 2.995L12 20z"></path></svg>';
      }
      popup.appendChild(icon);
    }
    
    var title = document.createElement('div');
    title.style.fontWeight = 'bold';
    title.style.fontSize = '1.1rem';
    title.style.marginBottom = '8px';
    title.textContent = theme.title;
    popup.appendChild(title);
    
    var msg = document.createElement('div');
    msg.style.fontSize = '0.97rem';
    msg.style.marginBottom = '18px';
    msg.style.textAlign = 'center';
    msg.textContent = theme.message;
    popup.appendChild(msg);
    
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
  allowBtn.style.padding = theme.template === 'only-allow' ? '6px 12px' : '8px 16px';
  allowBtn.style.cursor = 'pointer';
  allowBtn.style.fontSize = theme.template === 'only-allow' ? '0.875rem' : '1rem';
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
  denyBtn.style.padding = theme.template === 'only-allow' ? '6px 12px' : '8px 16px';
  denyBtn.style.cursor = 'pointer';
  denyBtn.style.fontSize = theme.template === 'only-allow' ? '0.875rem' : '1rem';
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
    closeBtn.style.top = theme.template === 'only-allow' ? '50%' : '8px';
    closeBtn.style.right = '12px';
    closeBtn.style.transform = theme.template === 'only-allow' ? 'translateY(-50%)' : 'none';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.fontSize = '1.3rem';
    closeBtn.style.color = theme.textColor;
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = function () { popup.remove(); };
    popup.appendChild(closeBtn);
  }
  
  // --- End: Content creation based on template ---
  
  // Add Powered by PushRocket branding
  var branding = document.createElement('div');
  branding.style.position = 'absolute';
  branding.style.bottom = '4px';
  branding.style.right = '8px';
  branding.style.fontSize = '10px';
  branding.style.color = theme.textColor;
  branding.style.opacity = '0.6';
  branding.style.fontFamily = 'inherit';
  branding.textContent = 'Powered by PushRocket';
  popup.appendChild(branding);
  
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
