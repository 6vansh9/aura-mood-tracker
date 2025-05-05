import React, { useMemo } from 'react';
import { useJournal } from '@/contexts/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subDays, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Smile, Meh, Frown, TrendingUp, Calendar, Tag } from 'lucide-react';
import { MoodType } from '@/types';

const COLORS = ['#22c55e', '#eab308', '#ef4444'];

const Analytics = () => {
  const { entries, getMoodStats } = useJournal();
  const today = new Date();

  // Filter entries from the last 30 days
  const recentEntries = useMemo(() => {
    const thirtyDaysAgo = subDays(today, 30);
    return entries
      .filter(entry => parseISO(entry.createdAt) >= thirtyDaysAgo)
      .sort((a, b) => parseISO(a.createdAt).getTime() - parseISO(b.createdAt).getTime());
  }, [entries, today]);

  // Prepare data for mood trend chart
  const moodTrendData = useMemo(() => {
    const dateMap = new Map();
    recentEntries.forEach(entry => {
      dateMap.set(format(parseISO(entry.createdAt), 'yyyy-MM-dd'), entry);
    });

    return Array.from({ length: 30 }, (_, i) => {
      const date = subDays(today, 29 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const entry = dateMap.get(dateStr);

      return {
        date: dateStr,
        moodScore: entry?.moodScore || null,
        title: entry?.title || null,
        mood: entry?.mood || null,
      };
    });
  }, [recentEntries, today]);

  // Prepare data for mood distribution chart
  const moodDistributionData = useMemo(() => {
    const { moodDistribution } = getMoodStats();
    return Object.entries(moodDistribution)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
  }, [getMoodStats]);

  // Calculate insights
  const insights = useMemo(() => {
    const { moodDistribution, averageMood } = getMoodStats();
    const totalEntries = Object.values(moodDistribution).reduce((a, b) => a + b, 0);
    
    const moodTrend = recentEntries.length >= 2
      ? recentEntries[recentEntries.length - 1].moodScore - recentEntries[0].moodScore
      : 0;

    const streak = recentEntries.reduce((acc, entry, index) => {
      if (index === 0) return 1;
      const prevDate = parseISO(recentEntries[index - 1].createdAt);
      const currDate = parseISO(entry.createdAt);
      const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      return dayDiff === 1 ? acc + 1 : acc;
    }, 0);

    return [
      {
        title: 'Mood Distribution',
        description: `Your entries are ${Math.round((moodDistribution.positive / totalEntries) * 100)}% positive, ${Math.round((moodDistribution.neutral / totalEntries) * 100)}% neutral, and ${Math.round((moodDistribution.negative / totalEntries) * 100)}% negative.`,
        icon: <Smile className="h-4 w-4" />,
      },
      {
        title: 'Average Mood',
        description: `Your average mood score is ${averageMood.toFixed(1)} out of 1.0.`,
        icon: <TrendingUp className="h-4 w-4" />,
      },
      {
        title: 'Mood Trend',
        description: moodTrend > 0
          ? 'Your mood has been improving over the last 30 days.'
          : moodTrend < 0
          ? 'Your mood has been declining over the last 30 days.'
          : 'Your mood has been stable over the last 30 days.',
        icon: <TrendingUp className="h-4 w-4" />,
      },
      {
        title: 'Journaling Streak',
        description: `You've journaled for ${streak} consecutive days.`,
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        title: 'Most Common Tags',
        description: `Your most used tags are: ${Array.from(new Set(recentEntries.flatMap(entry => entry.tags)))
          .slice(0, 3)
          .join(', ')}`,
        icon: <Tag className="h-4 w-4" />,
      },
    ];
  }, [recentEntries, getMoodStats]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Analytics</h1>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Mood Trends</TabsTrigger>
          <TabsTrigger value="distribution">Mood Distribution</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Mood Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => format(parseISO(date), 'MMM d')}
                    />
                    <YAxis domain={[0, 1]} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-lg">
                              <p className="font-medium">{format(parseISO(data.date), 'MMMM d, yyyy')}</p>
                              {data.title && <p className="text-sm text-muted-foreground">{data.title}</p>}
                              <p className="text-sm">
                                Mood Score: {data.moodScore?.toFixed(2) || 'No entry'}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="moodScore"
                      stroke="#8884d8"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={moodDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {moodDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {insight.icon}
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
