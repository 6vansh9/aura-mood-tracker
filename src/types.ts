
export type MoodType = "joy" | "sadness" | "anger" | "fear" | "neutral";

export const MOOD_TYPES: Record<MoodType, string> = {
  joy: "Joy",
  sadness: "Sadness",
  anger: "Anger",
  fear: "Fear",
  neutral: "Neutral"
};

export interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: {
    type: MoodType;
    score: number;
  };
  tags: string[];
  aiAnalysis?: {
    sentimentScore: number;
    detectedMood: MoodType;
    topics: string[];
    keywords: string[];
  };
}

export interface MoodData {
  date: string;
  value: number;
  mood: MoodType;
}
