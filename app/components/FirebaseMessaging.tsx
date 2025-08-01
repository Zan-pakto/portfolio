"use client";

import { useEffect, useState } from 'react';
import { firebaseMessagingService } from '../lib/firebase-messaging';

const FirebaseMessaging: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const initializeMessaging = async () => {
      try {
        const success = await firebaseMessagingService.initializeAndSubscribe();
        setIsInitialized(success);
        setPermission(Notification.permission);
      } catch (error) {
        console.error('Failed to initialize Firebase messaging:', error);
        setIsInitialized(false);
      }
    };

    initializeMessaging();
  }, []);

  // This component doesn't render anything visible
  // It just initializes Firebase messaging in the background
  return null;
};

export default FirebaseMessaging; 