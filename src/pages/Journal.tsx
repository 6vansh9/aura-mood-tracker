import React, { useState, useCallback, useEffect } from 'react';
import { useJournal } from '@/contexts/JournalContext';
import { useMoodAnalysis } from '@/hooks/useMoodAnalysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { format, parseISO } from 'date-fns';
import { PenLine, Smile, Frown, Meh, Loader2, Calendar, Image as ImageIcon, Bold, Italic, List, X } from 'lucide-react';
import { MoodType } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useEditor } from '@/hooks/useEditor';
import { JournalEntry } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

const moods = [
  { value: 'positive', label: 'Positive', icon: Smile },
  { value: 'neutral', label: 'Neutral', icon: Meh },
  { value: 'negative', label: 'Negative', icon: Frown },
];

const Journal = () => {
  const { addEntry } = useJournal();
  const { analyzeText, isAnalyzing, result, resetAnalysis } = useMoodAnalysis();
  const [title, setTitle] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodType>('neutral');
  const [moodScore, setMoodScore] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isFavorite, setIsFavorite] = useState(false);
  const [category, setCategory] = useState<string>('personal');
  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const {
    content,
    selection,
    handleChange,
    handleSelectionChange,
    insertText,
    formatText,
    addLink,
    addImage,
    getContent,
    setContent,
    toggleBlockType,
    toggleInlineStyle,
    handleKeyCommand
  } = useEditor();

  useEffect(() => {
    if (!title) {
      setTitle(format(selectedDate, 'MMMM d, yyyy'));
    }
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    // Ensure we have analysis results
    if (!result) {
      await analyzeText(content);
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title,
      content,
      mood: selectedMood || (result?.mood || 'neutral'),
      moodScore: moodScore || (result?.score || 0),
      tags,
      createdAt: selectedDate.toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite,
      category,
      images
    };

    addEntry(newEntry);
    resetForm();
  };

  const handleAnalyze = async () => {
    if (content) {
      await analyzeText(content);
      if (result) {
        setSelectedMood(result.mood as MoodType);
        setMoodScore(result.score);
      }
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          setImages(prev => [...prev, imageUrl]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    if (selectedImage === images[index]) {
      setSelectedImage(null);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSelectedMood('neutral');
    setMoodScore(null);
    setTags([]);
    setTagInput('');
    setSelectedDate(new Date());
    setIsFavorite(false);
    setCategory('personal');
    setImages([]);
    setSelectedImage(null);
    resetAnalysis();
  };

  const handleFormatClick = (e: React.MouseEvent, format: 'bold' | 'italic' | 'list') => {
    e.preventDefault();
    e.stopPropagation();
    
    switch (format) {
      case 'bold':
        formatText('bold');
        break;
      case 'italic':
        formatText('italic');
        break;
      case 'list':
        toggleBlockType('unordered-list-item');
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">New Journal Entry</h1>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="rounded-md border border-input bg-background px-3 py-2"
          />
          <Button
            variant={isFavorite ? "default" : "outline"}
            size="icon"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Entry Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="health">Health</option>
              <option value="relationships">Relationships</option>
              <option value="other">Other</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 border-b pb-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add Image</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <div className="relative">
              <textarea
                className="min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2"
                value={content}
                onChange={(e) => handleChange(e.target.value)}
                onSelect={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  handleSelectionChange(target.selectionStart, target.selectionEnd);
                }}
                onKeyDown={handleKeyCommand}
                placeholder="Write your thoughts here..."
              />
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Dialog>
                        <DialogTrigger asChild>
                          <div 
                            className="cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                          >
                            <img
                              src={image}
                              alt={`Uploaded ${index + 1}`}
                              className="w-full h-32 object-cover rounded-md hover:opacity-90 transition-opacity"
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <div className="relative">
                            <img
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-auto rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood & Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant={selectedMood === 'positive' ? 'default' : 'outline'}
                    onClick={() => setSelectedMood('positive')}
                  >
                    <Smile className="h-4 w-4 mr-2" />
                    Positive
                  </Button>
                  <Button
                    type="button"
                    variant={selectedMood === 'neutral' ? 'default' : 'outline'}
                    onClick={() => setSelectedMood('neutral')}
                  >
                    <Meh className="h-4 w-4 mr-2" />
                    Neutral
                  </Button>
                  <Button
                    type="button"
                    variant={selectedMood === 'negative' ? 'default' : 'outline'}
                    onClick={() => setSelectedMood('negative')}
                  >
                    <Frown className="h-4 w-4 mr-2" />
                    Negative
                  </Button>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Mood'}
              </Button>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Add tags (press Enter)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <Button type="submit">Save Entry</Button>
        </div>
      </form>
    </div>
  );
};

export default Journal;
