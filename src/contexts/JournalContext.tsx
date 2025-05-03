
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
  analyzeText: (text: string) => Promise<{ 
    mood: MoodType; 
    score: number; 
    sentimentScore: number;
    topics: string[];
    keywords: string[];
  }>;
};

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};

// Enhanced sentiment analysis function
const analyzeSentiment = async (text: string): Promise<{ 
  mood: MoodType; 
  score: number;
  sentimentScore: number;
  topics: string[];
  keywords: string[];
}> => {
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
    return { 
      mood: 'neutral' as MoodType, 
      score: 0.5,
      sentimentScore: 0.5,
      topics: ['general'],
      keywords: extractKeywords(text)
    };
  }
  
  // Normalize the score to be between 0 and 1
  const normalizedScore = Math.min(highestScore.score / 3, 1);
  
  // Calculate overall sentiment score (simplified)
  const sentimentScore = normalizedScore;
  
  // Extract topics and keywords from text
  const topics = extractTopics(text);
  const keywords = extractKeywords(text);
  
  return { 
    mood: highestScore.mood, 
    score: normalizedScore,
    sentimentScore,
    topics,
    keywords 
  };
};

// Simple topic extraction function
const extractTopics = (text: string): string[] => {
  // This is a simplified implementation
  const topicKeywords: Record<string, string[]> = {
    'work': ['job', 'office', 'work', 'career', 'meeting', 'project'],
    'health': ['exercise', 'workout', 'health', 'run', 'gym', 'fitness'],
    'relationships': ['friend', 'family', 'partner', 'date', 'conversation'],
    'personal growth': ['learn', 'goal', 'improve', 'progress', 'habit'],
    'relaxation': ['rest', 'sleep', 'relax', 'break', 'vacation', 'weekend']
  };
  
  const textLower = text.toLowerCase();
  const foundTopics: string[] = [];
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      foundTopics.push(topic);
    }
  });
  
  return foundTopics.length > 0 ? foundTopics : ['general'];
};

// Extract keywords from text
const extractKeywords = (text: string): string[] => {
  // This is a simplified implementation
  const words = text.toLowerCase().split(/\W+/);
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'as', 'i', 'my', 'me', 'mine', 'you', 'your', 'yours', 'we', 'our', 'us', 'they', 'their', 'them', 'it', 'its', 'this', 'that', 'these', 'those', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could'];
  
  // Filter out common words and short words
  const significantWords = words.filter(word => 
    !commonWords.includes(word) && word.length > 3
  );
  
  // Count word occurrences
  const wordCount: Record<string, number> = {};
  significantWords.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Sort by frequency and take top 5
  return Object.entries(wordCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
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

  const analyzeText = async (text: string): Promise<{ 
    mood: MoodType; 
    score: number;
    sentimentScore: number;
    topics: string[];
    keywords: string[];
  }> => {
    try {
      return await analyzeSentiment(text);
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Analysis Error",
        description: "Could not analyze your text. Using neutral sentiment instead.",
        variant: "destructive",
      });
      return { 
        mood: 'neutral' as MoodType, 
        score: 0.5,
        sentimentScore: 0.5,
        topics: ['general'],
        keywords: []
      };
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
