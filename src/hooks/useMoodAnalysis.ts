import { useState, useCallback } from 'react';
import { MoodType } from '@/types';

interface AnalysisResult {
  mood: MoodType;
  score: number;
  keywords: string[];
  topics: string[];
}

export function useMoodAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeText = useCallback(async (text: string) => {
    setIsAnalyzing(true);
    try {
      // TODO: Replace with actual API call to sentiment analysis service
      // This is a mock implementation
      const words = text.toLowerCase().split(/\s+/);
      const positiveWords = ['happy', 'joy', 'excited', 'great', 'wonderful', 'love'];
      const negativeWords = ['sad', 'angry', 'upset', 'terrible', 'hate', 'awful'];

      const positiveCount = words.filter((word) => positiveWords.includes(word)).length;
      const negativeCount = words.filter((word) => negativeWords.includes(word)).length;
      const totalCount = positiveCount + negativeCount;

      let mood: MoodType = 'neutral';
      let score = 0.5;

      if (totalCount > 0) {
        score = positiveCount / totalCount;
        if (score > 0.6) {
          mood = 'positive';
        } else if (score < 0.4) {
          mood = 'negative';
        }
      }

      // Extract keywords (most frequent words)
      const wordFrequency: Record<string, number> = {};
      words.forEach((word) => {
        if (word.length > 3) {
          wordFrequency[word] = (wordFrequency[word] || 0) + 1;
        }
      });

      const keywords = Object.entries(wordFrequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word);

      // Mock topics based on keywords
      const topics = keywords.slice(0, 3);

      const analysisResult: AnalysisResult = {
        mood,
        score,
        keywords,
        topics,
      };

      setResult(analysisResult);
      return analysisResult;
    } catch (error) {
      console.error('Error analyzing text:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setResult(null);
  }, []);

  return {
    isAnalyzing,
    result,
    analyzeText,
    resetAnalysis,
  };
} 