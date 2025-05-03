
import React, { useMemo } from 'react';
import { useJournal } from '@/contexts/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays, differenceInDays, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MoodType, MoodData } from '@/types';

const moodEmojis = {
  joy: "😊",
  sadness: "😢",
  anger: "😠",
  fear: "😨",
  neutral: "😐"
};

const moodColors = {
  joy: "#FFD700",
  sadness: "#6495ED",
  anger: "#FF6347",
  fear: "#9370DB",
  neutral: "#B0C4DE"
};

const Analytics = () => {
  const { entries } = useJournal();
  
  // Get entries from the last 30 days
  const today = new Date();
  const startDate = subDays(today, 30);
  
  // Filter entries from the last 30 days
  const recentEntries = useMemo(() => {
    return entries.filter(entry => {
      const entryDate = parseISO(entry.date);
      return entryDate >= startDate && entryDate <= today;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries, startDate, today]);

  // Prepare data for the mood chart
  const chartData: MoodData[] = useMemo(() => {
    // Create a complete data set for the last 30 days
    const data: MoodData[] = [];
    for (let i = 0; i <= 30; i++) {
      const date = format(subDays(today, 30 - i), 'yyyy-MM-dd');
      const entriesForDate = entries.filter(entry => entry.date === date);
      
      if (entriesForDate.length > 0) {
        // If there are entries for this date, add their mood data
        entriesForDate.forEach(entry => {
          data.push({
            date,
            value: entry.mood.score,
            mood: entry.mood.type,
          });
        });
      } else {
        // If no entries, add a placeholder
        data.push({
          date,
          value: 0, // No data for this date
          mood: 'neutral',
        });
      }
    }
    
    return data;
  }, [entries, today]);
  
  // Count mood frequencies
  const moodCounts = useMemo(() => {
    const counts: Record<MoodType, number> = {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      neutral: 0,
    };
    
    recentEntries.forEach(entry => {
      counts[entry.mood.type]++;
    });
    
    return counts;
  }, [recentEntries]);
  
  // Determine the dominant mood
  const dominantMood = useMemo(() => {
    return Object.entries(moodCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0] as MoodType;
  }, [moodCounts]);

  // Calculate streaks
  const journalStreak = useMemo(() => {
    let streak = 0;
    let currentDate = today;
    
    while (true) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const hasEntryForDate = entries.some(entry => entry.date === dateStr);
      
      if (!hasEntryForDate) {
        break;
      }
      
      streak++;
      currentDate = subDays(currentDate, 1);
    }
    
    return streak;
  }, [entries, today]);

  return (
    <div className="container max-w-4xl py-6 px-4 md:px-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Mood Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Journal Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-24">
              <p className="text-4xl font-bold">{journalStreak}</p>
              <p className="text-sm text-muted-foreground">days in a row</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Entries This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-24">
              <p className="text-4xl font-bold">{recentEntries.length}</p>
              <p className="text-sm text-muted-foreground">in the last 30 days</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dominant Mood</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-24">
              <div className="text-4xl mb-1">{moodEmojis[dominantMood]}</div>
              <p className="text-lg font-bold capitalize">{dominantMood}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Mood Trends (30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                  tick={{ fontSize: 12 }}
                  interval={5}
                />
                <YAxis domain={[0, 1]} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name, props) => [
                    `Intensity: ${Math.round(Number(value) * 100)}%`,
                    `Mood: ${props.payload.mood}`
                  ]}
                  labelFormatter={(label) => format(parseISO(label), 'MMMM d, yyyy')}
                />
                <Line 
                  type="monotone" 
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={(props) => {
                    const { cx, cy, payload } = props;
                    return payload.value > 0 ? (
                      <circle 
                        cx={cx} 
                        cy={cy} 
                        r={5} 
                        fill={moodColors[payload.mood]} 
                        stroke="none" 
                      />
                    ) : null;
                  }}
                  activeDot={{ r: 8, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Mood Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(moodCounts).map(([mood, count]) => (
              <div key={mood} className="flex flex-col items-center">
                <div className="text-2xl mb-2">{moodEmojis[mood as MoodType]}</div>
                <div className="h-24 w-full bg-muted rounded-md relative">
                  <div 
                    className="absolute bottom-0 w-full rounded-md"
                    style={{ 
                      height: `${(count / recentEntries.length) * 100}%`,
                      backgroundColor: moodColors[mood as MoodType],
                      minHeight: '1px'
                    }}
                  ></div>
                </div>
                <p className="mt-2 font-medium">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">{mood}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
