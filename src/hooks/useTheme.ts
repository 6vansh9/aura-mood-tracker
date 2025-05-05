import { useTheme as useNextTheme } from 'next-themes';
import { useSettings } from '@/contexts/SettingsContext';

export function useTheme() {
  const { theme, setTheme } = useNextTheme();
  const { preferences, updatePreferences } = useSettings();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    updatePreferences({ theme: newTheme });
  };

  return {
    theme,
    setTheme: handleThemeChange,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    isSystem: theme === 'system',
  };
} 