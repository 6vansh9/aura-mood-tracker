import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Smile, Frown, Meh } from 'lucide-react';

// Mock data - replace with real data from API
const moodData = [
  { date: 'Mon', mood: 4 },
  { date: 'Tue', mood: 3 },
  { date: 'Wed', mood: 5 },
  { date: 'Thu', mood: 4 },
  { date: 'Fri', mood: 3 },
  { date: 'Sat', mood: 5 },
  { date: 'Sun', mood: 4 },
];

const recentEntries = [
  {
    id: 1,
    title: 'Morning Reflection',
    date: '2024-03-20',
    mood: 'positive',
    preview: 'Started the day with a peaceful meditation session...',
  },
  {
    id: 2,
    title: 'Work Progress',
    date: '2024-03-19',
    mood: 'neutral',
    preview: 'Made good progress on the project today...',
  },
  {
    id: 3,
    title: 'Evening Thoughts',
    date: '2024-03-18',
    mood: 'positive',
    preview: 'Reflecting on the day\'s accomplishments...',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Mood Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Mood</CardTitle>
            <Smile className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">+0.3 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entries This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Meh className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 days</div>
            <p className="text-xs text-muted-foreground">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Mood Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Mood Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="mood" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <h3 className="font-medium">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground">{entry.preview}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
                <div className="flex items-center">
                  {entry.mood === 'positive' ? (
                    <Smile className="h-5 w-5 text-green-500" />
                  ) : entry.mood === 'neutral' ? (
                    <Meh className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Frown className="h-5 w-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 