
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { useJournal } from '@/contexts/JournalContext';
import { MoodType, JournalEntry, MOOD_TYPES } from '@/types';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const moodEmojis = {
  joy: "😊",
  sadness: "😢",
  anger: "😠",
  fear: "😨",
  neutral: "😐"
};

// A function to color code the calendar based on mood
const getDayClass = (mood: MoodType): string => {
  switch (mood) {
    case 'joy':
      return 'bg-mood-joy/60 text-black hover:bg-mood-joy';
    case 'sadness':
      return 'bg-mood-sadness/60 text-white hover:bg-mood-sadness';
    case 'anger':
      return 'bg-mood-anger/60 text-white hover:bg-mood-anger';
    case 'fear':
      return 'bg-mood-fear/60 text-white hover:bg-mood-fear';
    default:
      return 'bg-mood-neutral/60 text-black hover:bg-mood-neutral';
  }
};

const Calendar = () => {
  const { entries } = useJournal();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Map entries by date for the calendar rendering
  const entriesByDate = entries.reduce<Record<string, JournalEntry[]>>((acc, entry) => {
    const date = entry.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {});
  
  // Selected date entries
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const selectedDateEntries = entriesByDate[selectedDateStr] || [];
  
  // Get the mood class for the selected date in the calendar
  const modifiers = {
    ...Object.keys(entriesByDate).reduce<Record<string, (date: Date) => boolean>>((acc, dateStr) => {
      const mood = entriesByDate[dateStr][0]?.mood.type || 'neutral';
      const dateKey = `has-entry-${mood}`;
      if (!acc[dateKey]) {
        acc[dateKey] = (date) => format(date, 'yyyy-MM-dd') === dateStr;
      }
      return acc;
    }, {}),
  };
  
  const modifiersStyles = {
    ...Object.values(MOOD_TYPES).reduce<Record<string, React.CSSProperties>>((acc, _, index) => {
      const mood = Object.keys(MOOD_TYPES)[index] as MoodType;
      acc[`has-entry-${mood}`] = {
        backgroundColor: mood === 'joy' ? '#FFD700' : 
                        mood === 'sadness' ? '#6495ED' : 
                        mood === 'anger' ? '#FF6347' : 
                        mood === 'fear' ? '#9370DB' : '#B0C4DE',
        fontWeight: 'bold',
        color: mood === 'joy' || mood === 'neutral' ? 'black' : 'white',
      };
      return acc;
    }, {}),
  };

  return (
    <div className="container max-w-4xl py-6 px-4 md:px-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Journal Calendar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardContent className="p-6">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
            />
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
          </h2>
          
          {selectedDateEntries.length === 0 ? (
            <Card className="shadow-md">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No entries for this date</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {selectedDateEntries.map((entry) => (
                <Card key={entry.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{entry.title}</h3>
                      <span className="text-2xl" title={entry.mood.type}>
                        {moodEmojis[entry.mood.type]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {entry.content}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        {entry.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="text-xs bg-secondary px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link to={`/entry/${entry.id}`}>
                        <Button variant="ghost" size="sm">
                          View <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
