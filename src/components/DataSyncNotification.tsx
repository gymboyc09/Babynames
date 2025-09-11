import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function DataSyncNotification() {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Listen for storage events to detect when data is saved
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'baby-names-storage') {
        if (e.newValue) {
          setNotificationType('success');
          setMessage('Data saved successfully');
          setShowNotification(true);
          setTimeout(() => setShowNotification(false), 3000);
        }
      }
    };

    // Listen for custom events from the store
    const handleDataSaved = () => {
      setNotificationType('success');
      setMessage('Data saved to local storage');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    };

    const handleDataError = () => {
      setNotificationType('error');
      setMessage('Failed to save data');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('data-saved', handleDataSaved);
    window.addEventListener('data-error', handleDataError);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('data-saved', handleDataSaved);
      window.removeEventListener('data-error', handleDataError);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
        notificationType === 'success' 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {notificationType === 'success' ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
}
