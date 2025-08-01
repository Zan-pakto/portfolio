// firebase-messaging.ts
// Firebase Cloud Messaging integration for Next.js

export class FirebaseMessagingService {
  private static instance: FirebaseMessagingService;
  private messaging: any = null;
  private registration: ServiceWorkerRegistration | null = null;

  private constructor() {}

  public static getInstance(): FirebaseMessagingService {
    if (!FirebaseMessagingService.instance) {
      FirebaseMessagingService.instance = new FirebaseMessagingService();
    }
    return FirebaseMessagingService.instance;
  }

  async initialize(): Promise<boolean> {
    if (typeof window === 'undefined') {
      console.log('Firebase messaging not available on server side');
      return false;
    }

    try {
      // Dynamically import Firebase modules
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
      const { getMessaging, getToken, onMessage } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js');

      // Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyAYLKwvkcorfHF6jfj9dQkHfsY-oSPY3rM",
        authDomain: "basic-224c7.firebaseapp.com",
        projectId: "basic-224c7",
        storageBucket: "basic-224c7.firebasestorage.app",
        messagingSenderId: "241479667416",
        appId: "1:241479667416:web:c182ccbadc9008bd0f91ad",
        measurementId: "G-KN5K9X56BX"
      };

      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      this.messaging = getMessaging(app);

      // Register service worker
      this.registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { type: 'module' });
      console.log('Firebase Service Worker registered:', this.registration);

      return true;
    } catch (error) {
      console.error('Firebase messaging initialization failed:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async getToken(): Promise<string | null> {
    if (!this.messaging || !this.registration) {
      console.error('Firebase messaging not initialized');
      return null;
    }

    try {
      const { getToken } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js');
      
      const token = await getToken(this.messaging, {
        vapidKey: 'BIRubV6XANL26x6VLCwafEd_8U_HbV53dbjywbFxS13JKgnXWg6bsw-RkssnUwbwJ01DYKeayN44pUCNPq3XuIQ',
        serviceWorkerRegistration: this.registration
      });

      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  async sendTokenToBackend(token: string): Promise<boolean> {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/client-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firebaseMessagingToken: token, 
          firebaseAuthToken: 'dummy-auth-token', // Required by backend
          domain: 'https://portfolio-one-sand-51.vercel.app' 
        })
      });

      if (response.ok) {
        console.log('Token saved successfully');
        return true;
      } else {
        console.error('Failed to save token:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error saving token:', error);
      return false;
    }
  }

  async setupForegroundHandler(): Promise<void> {
    if (!this.messaging) {
      console.error('Firebase messaging not initialized');
      return;
    }

    try {
      const { onMessage } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging.js');
      
      onMessage(this.messaging, (payload: any) => {
        console.log('Foreground message received:', payload);
        // Handle foreground messages here (e.g., show toast notification)
        // You can customize this based on your UI needs
      });
    } catch (error) {
      console.error('Failed to setup foreground handler:', error);
    }
  }

  async initializeAndSubscribe(): Promise<boolean> {
    const initialized = await this.initialize();
    if (!initialized) return false;

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission not granted');
      return false;
    }

    const token = await this.getToken();
    if (!token) return false;

    const saved = await this.sendTokenToBackend(token);
    if (saved) {
      await this.setupForegroundHandler();
    }

    return saved;
  }
}

// Export singleton instance
export const firebaseMessagingService = FirebaseMessagingService.getInstance();

// Auto-initialize when imported (for client-side only)
if (typeof window !== 'undefined') {
  firebaseMessagingService.initializeAndSubscribe()
    .then(success => {
      if (success) {
        console.log('Firebase messaging initialized successfully');
      } else {
        console.log('Firebase messaging initialization failed');
      }
    })
    .catch(error => {
      console.error('Firebase messaging error:', error);
    });
} 