
import React, { createContext, useContext, useState, useEffect } from 'react';
import { JournalEntry, MoodType } from '@/types';
import { toast } from '@/components/ui/use-toast';

type JournalContextType = {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntryById: (id: string) => JournalEntry | undefined;
  getEntriesByDate: (date: string) => JournalEntry[];
  analyzeText: (text: string) => Promise<{ mood: MoodType; score: number }>;
};

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

// Simple sentiment analysis function (mock for now)
const analyzeSentiment = async (text: string): Promise<{ mood: MoodType; score: number }> => {
  // This would be replaced with actual sentiment analysis using a library or API
  const text_lower = text.toLowerCase();
  
  // Very basic keyword detection
  const joyWords = ['happy', 'joy', 'exciting', 'wonderful', 'love', 'great'];
  const sadWords = ['sad', 'unhappy', 'miserable', 'depressed', 'disappointed'];
  const angerWords = ['angry', 'furious', 'annoyed', 'frustrated', 'hate'];
  const fearWords = ['afraid', 'scared', 'anxious', 'worried', 'nervous'];
  
  let joyScore = 0, sadScore = 0, angerScore = 0, fearScore = 0;
  
  joyWords.forEach(word => {
    if (text_lower.includes(word)) joyScore += 1;
  });
  
  sadWords.forEach(word => {
    if (text_lower.includes(word)) sadScore += 1;
  });
  
  angerWords.forEach(word => {
    if (text_lower.includes(word)) angerScore += 1;
  });
  
  fearWords.forEach(word => {
    if (text_lower.includes(word)) fearScore += 1;
  });
  
  const scores = [
    { mood: 'joy' as MoodType, score: joyScore },
    { mood: 'sadness' as MoodType, score: sadScore },
    { mood: 'anger' as MoodType, score: angerScore },
    { mood: 'fear' as MoodType, score: fearScore },
    { mood: 'neutral' as MoodType, score: 0.2 }, // Default small score for neutral
  ];
  
  // Find the mood with the highest score
  const highestScore = scores.reduce((prev, current) => {
    return (prev.score > current.score) ? prev : current;
  });
  
  // If all scores are low, return neutral
  if (highestScore.score <= 0.2) {
    return { mood: 'neutral' as MoodType, score: 0.5 };
  }
  
  // Normalize the score to be between 0 and 1
  const normalizedScore = Math.min(highestScore.score / 3, 1);
  
  return { mood: highestScore.mood, score: normalizedScore };
};

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const savedEntries = localStorage.getItem('journal_entries');
    return savedEntries ? JSON.parse(savedEntries) : [];
  });

  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const id = Date.now().toString();
    setEntries(prev => [{ ...entry, id }, ...prev]);
    toast({
      title: "Journal Entry Saved",
      description: "Your thoughts have been captured successfully.",
    });
  };

  const updateEntry = (id: string, entryUpdate: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...entryUpdate } : entry
    ));
    toast({
      title: "Journal Entry Updated",
      description: "Your changes have been saved.",
    });
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Journal Entry Deleted",
      description: "The entry has been removed from your journal.",
    });
  };

  const getEntryById = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  const getEntriesByDate = (date: string) => {
    return entries.filter(entry => entry.date.startsWith(date));
  };

  const analyzeText = async (text: string): Promise<{ mood: MoodType; score: number }> => {
    try {
      return await analyzeSentiment(text);
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Analysis Error",
        description: "Could not analyze your text. Using neutral sentiment instead.",
        variant: "destructive",
      });
      return { mood: 'neutral' as MoodType, score: 0.5 };
    }
  };

  const value: JournalContextType = {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntryById,
    getEntriesByDate,
    analyzeText,
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
};
