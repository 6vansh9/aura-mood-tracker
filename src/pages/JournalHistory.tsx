import React, { useState, useMemo } from 'react';
import { useJournal } from '@/contexts/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Search, Calendar, Tag, Smile, Meh, Frown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { JournalEntry } from '@/types';

const JournalHistory = () => {
  const { entries } = useJournal();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  // Get all unique tags from entries
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    entries.forEach(entry => {
      entry.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [entries]);

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    return entries
      .filter(entry => {
        const matchesSearch = 
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesMood = selectedMood === 'all' || entry.mood === selectedMood;
        
        const matchesTag = selectedTag === 'all' || entry.tags.includes(selectedTag);

        return matchesSearch && matchesMood && matchesTag;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [entries, searchQuery, selectedMood, selectedTag, sortBy]);

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'positive':
        return <Smile className="h-4 w-4 text-green-500" />;
      case 'neutral':
        return <Meh className="h-4 w-4 text-yellow-500" />;
      case 'negative':
        return <Frown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Journal History</h1>
      </div>

      <div className="grid gap-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search entries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
              <Select value={selectedMood} onValueChange={setSelectedMood}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Moods</SelectItem>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(value: 'newest' | 'oldest') => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Entries List */}
        <div className="space-y-4">
          {filteredEntries.map((entry: JournalEntry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{entry.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(entry.createdAt), 'MMMM d, yyyy')}
                    </span>
                    {getMoodIcon(entry.mood)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{entry.content}</p>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map(tag => (
                    <Badge key={tag} variant="secondary">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No journal entries found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalHistory; 