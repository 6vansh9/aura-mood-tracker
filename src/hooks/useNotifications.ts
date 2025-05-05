import { useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

export function useNotifications() {
  const { preferences } = useSettings();

  useEffect(() => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    };

    requestPermission();
  }, []);

  const scheduleReminder = (time: string) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );

    if (scheduledTime < now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      new Notification('Time to Journal', {
        body: 'Take a moment to reflect on your day and record your thoughts.',
        icon: '/icon.png',
      });
    }, timeUntilNotification);
  };

  const scheduleMoodCheckIn = () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const now = new Date();
    const scheduledTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      20, // 8 PM
      0
    );

    if (scheduledTime < now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilNotification = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      new Notification('Mood Check-in', {
        body: 'How are you feeling today? Take a moment to record your mood.',
        icon: '/icon.png',
      });
    }, timeUntilNotification);
  };

  useEffect(() => {
    if (preferences.notifications.dailyReminder) {
      const reminderTime = {
        morning: '08:00',
        afternoon: '14:00',
        evening: '20:00',
      }[preferences.notifications.reminderTime];

      scheduleReminder(reminderTime);
    }

    if (preferences.notifications.moodCheckIn) {
      scheduleMoodCheckIn();
    }
  }, [preferences.notifications]);

  return {
    scheduleReminder,
    scheduleMoodCheckIn,
  };
} 