import { useState } from 'react';
import { useJournal } from '@/contexts/JournalContext';
import { JournalEntry, MoodType } from '@/types';

interface UseJournalEntryProps {
  initialEntry?: Partial<JournalEntry>;
}

export function useJournalEntry({ initialEntry }: UseJournalEntryProps = {}) {
  const { addEntry, updateEntry } = useJournal();
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [content, setContent] = useState(initialEntry?.content || '');
  const [mood, setMood] = useState<MoodType>(initialEntry?.mood || 'neutral');
  const [moodScore, setMoodScore] = useState(initialEntry?.moodScore || 0.5);
  const [tags, setTags] = useState<string[]>(initialEntry?.tags || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!title || !content) {
      return;
    }

    setIsSubmitting(true);

    try {
      const entryData = {
        title,
        content,
        mood,
        moodScore,
        tags,
      };

      if (initialEntry?.id) {
        await updateEntry(initialEntry.id, entryData);
      } else {
        await addEntry(entryData);
      }

      // Reset form if it's a new entry
      if (!initialEntry?.id) {
        setTitle('');
        setContent('');
        setMood('neutral');
        setMoodScore(0.5);
        setTags([]);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    mood,
    setMood,
    moodScore,
    setMoodScore,
    tags,
    setTags,
    isSubmitting,
    handleSubmit,
    handleAddTag,
    handleRemoveTag,
  };
} 