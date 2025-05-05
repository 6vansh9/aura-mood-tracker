export type MoodType = 'positive' | 'neutral' | 'negative';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: MoodType;
  moodScore: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    dailyReminder: boolean;
    moodCheckIn: boolean;
    reminderTime: 'morning' | 'afternoon' | 'evening';
  };
  privacy: {
    dataCollection: boolean;
  };
}

export interface MoodData {
  date: string;
  mood: number;
}

export interface MoodDistribution {
  name: string;
  value: number;
}

export interface Insight {
  title: string;
  description: string;
}

export interface AnalyticsData {
  moodTrends: MoodData[];
  moodDistribution: MoodDistribution[];
  insights: Insight[];
}
