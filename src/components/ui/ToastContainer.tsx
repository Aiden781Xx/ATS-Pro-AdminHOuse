import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { ToastNotification } from './ToastNotification';

export const ToastContainer: React.FC = () => {
  const { notifications, clearNotification } = useNotifications();

  // Only show toast notifications for recent notifications (last 10 seconds)
  const recentNotifications = notifications.filter(notification => {
    const timeDiff = Date.now() - notification.timestamp.getTime();
    return timeDiff < 10000; // 10 seconds
  }).slice(0, 5); // Limit to 5 simultaneous toasts

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {recentNotifications.map((notification) => (
        <ToastNotification
          key={notification.id}
          id={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={clearNotification}
        />
      ))}
    </div>
  );
};