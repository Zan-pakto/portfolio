(function() {
  const moduleScript = document.createElement('script');
  moduleScript.type = 'module';
  moduleScript.textContent = `
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getMessaging, getToken } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js';

// Configuration
const firebaseConfig = {"apiKey":"AIzaSyBalk9xL597wAu7xy3IEaYyKtThGvKSIc8","authDomain":"test1-68b65.firebaseapp.com","projectId":"test1-68b65","storageBucket":"test1-68b65.firebasestorage.app","messagingSenderId":"1028270206064","appId":"1:1028270206064:web:be2ecce242f6cac9bf18b5","vapidKey":"BPo3xNnsQIjheyBkdpBKI_Ap6NBMSzEkoCycduL3PPuYtGx-ivyZrMLyfULE-J10QzDL4RNQ5ldh8r7buIrkfuM","measurementId":"G-L725Q1GVZN"};
const vapidKey = 'BPo3xNnsQIjheyBkdpBKI_Ap6NBMSzEkoCycduL3PPuYtGx-ivyZrMLyfULE-J10QzDL4RNQ5ldh8r7buIrkfuM';
const backendUrl = 'https://demo.nexapush.com';

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Managed by Nexapush Label
const managedBy = document.createElement('a');
managedBy.href = 'https://nexapush.com';
managedBy.target = '_blank';
managedBy.textContent = 'Managed by Nexapush';
managedBy.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999999;background:rgba(0,0,0,0.8);color:#fff;padding:8px 12px;border-radius:6px;font-size:12px;font-family:sans-serif;text-decoration:none;transition:opacity 0.5s;';
document.body.appendChild(managedBy);
setTimeout(() => { managedBy.style.opacity = '0'; setTimeout(() => managedBy.remove(), 500); }, 10000);

// Popup Logic
function showPopup() {
  if (Notification.permission !== 'default') return;
  const theme = {"template":"default","title":"Stay Updated!","message":"Get notified about our latest updates and offers. You can unsubscribe anytime.","allowButtonText":"Allow Notifications","denyButtonText":"Not Now","primaryColor":"#3b82f6","backgroundColor":"#ffffff","textColor":"#1f2937","borderRadius":"12","animation":"slideIn","position":"top","showIcon":true,"iconUrl":"","showCloseButton":true,"templateType":"default"};
  const popup = document.createElement('div');
  popup.id = 'nexapush-popup';
  
  // Base Styling
  let style = 'position:fixed;z-index:99999;background:' + theme.backgroundColor + ';color:' + theme.textColor + ';padding:20px;font-family:sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;flex-direction:column;gap:12px;';
  
  if (theme.template === 'banner') {
    style += 'top:0;left:0;right:0;flex-direction:row;align-items:center;justify-content:center;';
  } else {
    style += 'top:20px;left:50%;transform:translateX(-50%);border-radius:' + (theme.borderRadius || 12) + 'px;width:90%;max-width:400px;';
  }
  popup.style.cssText = style;

  // Header (Icon + Title)
  const header = document.createElement('div');
  header.style.cssText = 'display:flex;align-items:center;gap:12px;width:100%;';
  if (theme.showIcon !== false) {
    const icon = document.createElement('div');
    icon.style.cssText = 'width:32px;height:32px;flex-shrink:0;';
    icon.innerHTML = theme.iconUrl ? '<img src="' + theme.iconUrl + '" style="width:100%;height:100%;border-radius:50%;"/>' : '<svg width="32" height="32" fill="' + (theme.primaryColor || '#3b82f6') + '"><path d="M12 2a7 7 0 0 0-7 7v3.586l-.707.707A1 1 0 0 0 5 16h14a1 1 0 0 0 .707-1.707L19 12.586V9a7 7 0 0 0-7-7zm0 18a3 3 0 0 0 2.995-2.824L15 17h-6a3 3 0 0 0 2.824 2.995L12 20z"></path></svg>';
    header.appendChild(icon);
  }
  const title = document.createElement('b');
  title.textContent = theme.title || 'Stay Updated!';
  header.appendChild(title);
  popup.appendChild(header);

  // Message
  if (theme.message) {
    const msg = document.createElement('div');
    msg.style.cssText = 'font-size:14px;opacity:0.9;';
    msg.textContent = theme.message;
    popup.appendChild(msg);
  }

  // Buttons
  const btns = document.createElement('div');
  btns.style.cssText = 'display:flex;gap:10px;width:100%;';
  
  const allow = document.createElement('button');
  allow.textContent = theme.allowButtonText || 'Allow';
  allow.style.cssText = 'background:' + (theme.primaryColor || '#3b82f6') + ';color:#fff;border:none;padding:10px;border-radius:6px;cursor:pointer;flex:1;font-weight:bold;';
  allow.onclick = () => {
    popup.remove();
    Notification.requestPermission().then(p => {
      if (p === 'granted') {
        getToken(messaging, { vapidKey, serviceWorkerRegistration: swReg }).then(token => {
          fetch(backendUrl + '/api/client-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firebaseMessagingToken: token, domain: window.location.origin })
          });
        });
      }
    });
  };
  btns.appendChild(allow);

  if (theme.template !== 'only-allow' && theme.denyButtonText) {
    const deny = document.createElement('button');
    deny.textContent = theme.denyButtonText;
    deny.style.cssText = 'background:transparent;color:inherit;border:1px solid rgba(0,0,0,0.1);padding:10px;border-radius:6px;cursor:pointer;flex:1;';
    deny.onclick = () => popup.remove();
    btns.appendChild(deny);
  }
  popup.appendChild(btns);

  // Powered By Branding
  if (true) {
    const power = document.createElement('a');
    power.href = 'https://nexapush.com';
    power.target = '_blank';
    power.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:4px;font-size:10px;text-decoration:none;color:inherit;opacity:0.6;margin-top:4px;';
    const logoSrc = "https://shorturl.at/rto74".startsWith('http') ? "https://shorturl.at/rto74" : backendUrl + "https://shorturl.at/rto74";
    power.innerHTML = '<img src="' + logoSrc + '" style="width:18px;height:18px;object-fit:contain;margin-right:2px;"/>Powered by Nexapush';
    popup.appendChild(power);
  }

  document.body.appendChild(popup);
}

let swReg = null;
navigator.serviceWorker.register('/firebase-messaging-sw.js', { type: 'module' }).then(reg => {
  swReg = reg;
  showPopup();
});
`;
  document.head.appendChild(moduleScript);
})();
