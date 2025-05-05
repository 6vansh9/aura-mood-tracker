import { useMemo } from 'react';
import { useJournal } from '@/contexts/JournalContext';
import { MoodData, MoodDistribution, Insight } from '@/types';

export function useAnalytics() {
  const { entries, getMoodStats } = useJournal();

  const moodTrends = useMemo(() => {
    const last30Days = entries
      .slice(-30)
      .map((entry) => ({
        date: new Date(entry.createdAt).toLocaleDateString(),
        mood: entry.moodScore,
      }))
      .reverse();

    return last30Days;
  }, [entries]);

  const moodDistribution = useMemo(() => {
    const { moodDistribution: distribution } = getMoodStats();
    return Object.entries(distribution).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [getMoodStats]);

  const insights = useMemo(() => {
    const insights: Insight[] = [];

    // Most common mood
    const { moodDistribution } = getMoodStats();
    const dominantMood = Object.entries(moodDistribution).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];
    insights.push({
      title: 'Dominant Mood',
      description: `Your most frequent mood is ${dominantMood}.`,
    });

    // Journaling streak
    const { streak } = getMoodStats();
    if (streak > 0) {
      insights.push({
        title: 'Journaling Streak',
        description: `You've been journaling for ${streak} days in a row!`,
      });
    }

    // Mood improvement
    if (entries.length >= 2) {
      const recentMoods = entries.slice(-7).map((e) => e.moodScore);
      const averageMood = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
      const previousMoods = entries.slice(-14, -7).map((e) => e.moodScore);
      const previousAverage = previousMoods.reduce((a, b) => a + b, 0) / previousMoods.length;

      if (averageMood > previousAverage) {
        insights.push({
          title: 'Mood Improvement',
          description: 'Your mood has been improving over the last week!',
        });
      }
    }

    return insights;
  }, [entries, getMoodStats]);

  return {
    moodTrends,
    moodDistribution,
    insights,
  };
} 