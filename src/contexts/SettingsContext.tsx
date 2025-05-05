import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserPreferences } from '@/types';

interface SettingsContextType {
  user: User | null;
  preferences: UserPreferences;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateUser: (user: Partial<User>) => void;
  exportData: () => void;
  deleteAccount: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  notifications: {
    dailyReminder: true,
    moodCheckIn: true,
    reminderTime: 'evening',
  },
  privacy: {
    dataCollection: true,
  },
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const savedPreferences = localStorage.getItem('user_preferences');
    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('user_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      ...newPreferences,
      notifications: {
        ...prev.notifications,
        ...(newPreferences.notifications || {}),
      },
      privacy: {
        ...prev.privacy,
        ...(newPreferences.privacy || {}),
      },
    }));
  };

  const updateUser = (newUser: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...newUser } : null));
  };

  const exportData = () => {
    // TODO: Implement data export functionality
    console.log('Exporting data...');
  };

  const deleteAccount = () => {
    // TODO: Implement account deletion functionality
    setUser(null);
    setPreferences(defaultPreferences);
    localStorage.removeItem('user');
    localStorage.removeItem('user_preferences');
  };

  return (
    <SettingsContext.Provider
      value={{
        user,
        preferences,
        updatePreferences,
        updateUser,
        exportData,
        deleteAccount,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 