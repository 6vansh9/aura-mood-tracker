
import React, { useState, useEffect } from 'react';
import { useJournal } from '@/contexts/JournalContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { PenLine, Smile, Frown, Angry, Loader2 } from 'lucide-react';
import { MoodType } from '@/types';
import { Badge } from '@/components/ui/badge';

const moodEmojis = {
  joy: "😊",
  sadness: "😢",
  anger: "😠",
  fear: "😨",
  neutral: "😐"
};

const moodColors = {
  joy: "bg-mood-joy text-black",
  sadness: "bg-mood-sadness text-white",
  anger: "bg-mood-anger text-white",
  fear: "bg-mood-fear text-white",
  neutral: "bg-mood-neutral text-black"
};

const Journal = () => {
  const { addEntry, analyzeText } = useJournal();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType>('neutral');
  const [selectedMoodScore, setSelectedMoodScore] = useState(0.5);
  const [analyzing, setAnalyzing] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const currentDate = format(new Date(), 'yyyy-MM-dd');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    
    addEntry({
      date: currentDate,
      title,
      content,
      mood: {
        type: selectedMood,
        score: selectedMoodScore,
      },
      tags,
    });
    
    // Reset form
    setTitle('');
    setContent('');
    setSelectedMood('neutral');
    setSelectedMoodScore(0.5);
    setTags([]);
    setTagInput('');
  };
  
  const handleAnalyze = async () => {
    if (!content) return;
    
    setAnalyzing(true);
    try {
      const analysis = await analyzeText(content);
      setSelectedMood(analysis.mood);
      setSelectedMoodScore(analysis.score);
    } finally {
      setAnalyzing(false);
    }
  };
  
  const handleAddTag = () => {
    if (!tagInput.trim() || tags.includes(tagInput.trim())) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput('');
  };
  
  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  useEffect(() => {
    // Set a default title based on the current date if no title yet
    if (!title) {
      setTitle(`Journal Entry - ${format(new Date(), 'MMMM d, yyyy')}`);
    }
  }, [title]);
  
  return (
    <div className="container max-w-4xl py-6 px-4 md:px-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
          <p className="text-muted-foreground">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <Button onClick={handleSubmit} disabled={!title || !content} className="bg-primary hover:bg-primary/90">
          <PenLine className="mr-2 h-4 w-4" /> Save Entry
        </Button>
      </div>
      
      <Card className="shadow-md">
        <CardContent className="p-6">
          <form className="space-y-4">
            <div>
              <Input 
                placeholder="Title of your entry" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium"
              />
            </div>
            
            <Textarea
              placeholder="Write about your day, thoughts, or feelings..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="journal-editor min-h-[250px]"
            />
            
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} &times;
                </Badge>
              ))}
              
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="w-32"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddTag}
                  className="shrink-0"
                >
                  Add
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <Tabs defaultValue="ai" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="ai" className="text-sm">AI Detection</TabsTrigger>
                  <TabsTrigger value="manual" className="text-sm">Manual Selection</TabsTrigger>
                </TabsList>
                <TabsContent value="ai" className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">AI Mood Analysis</h3>
                      <p className="text-sm text-muted-foreground">Based on your journal content</p>
                    </div>
                    <Button 
                      onClick={handleAnalyze} 
                      variant="secondary" 
                      disabled={!content || analyzing}
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing
                        </>
                      ) : (
                        "Analyze Text"
                      )}
                    </Button>
                  </div>
                  
                  {selectedMood && !analyzing && (
                    <div className="flex items-center mt-4 ml-2">
                      <div className={`text-4xl p-2 rounded-full ${selectedMood !== 'neutral' ? moodColors[selectedMood] : ''}`}>
                        {moodEmojis[selectedMood]}
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold capitalize">{selectedMood}</h4>
                        <p className="text-sm text-muted-foreground">
                          Intensity: {Math.round(selectedMoodScore * 100)}%
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="manual" className="space-y-4 pt-4">
                  <div>
                    <h3 className="font-medium">How are you feeling?</h3>
                    <p className="text-sm text-muted-foreground">Select your mood</p>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-3">
                    {Object.entries(moodEmojis).map(([mood, emoji]) => (
                      <Button
                        key={mood}
                        type="button"
                        variant="outline"
                        className={`flex flex-col items-center h-16 ${selectedMood === mood ? 'border-primary border-2' : ''}`}
                        onClick={() => setSelectedMood(mood as MoodType)}
                      >
                        <span className="text-2xl">{emoji}</span>
                        <span className="text-xs mt-1 capitalize">{mood}</span>
                      </Button>
                    ))}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Intensity: {Math.round(selectedMoodScore * 100)}%</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={selectedMoodScore}
                      onChange={(e) => setSelectedMoodScore(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Journal;
