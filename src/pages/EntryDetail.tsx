
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJournal } from '@/contexts/JournalContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format, parseISO } from 'date-fns';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MoodType } from '@/types';

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

const EntryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getEntryById, deleteEntry } = useJournal();
  const navigate = useNavigate();
  
  const entry = getEntryById(id || '');
  
  if (!entry) {
    return (
      <div className="container max-w-4xl py-6 px-4 md:px-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Entry Not Found</h1>
          <p className="text-muted-foreground mb-6">The journal entry you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Return to Journal</Button>
        </div>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteEntry(entry.id);
    navigate('/calendar');
  };
  
  return (
    <div className="container max-w-4xl py-6 px-4 md:px-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your journal entry.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground">{format(parseISO(entry.date), 'EEEE, MMMM d, yyyy')}</p>
              <CardTitle className="mt-1">{entry.title}</CardTitle>
            </div>
            
            <div className={`text-3xl p-2 rounded-full ${entry.mood.type !== 'neutral' ? moodColors[entry.mood.type] : ''}`}>
              {moodEmojis[entry.mood.type]}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="whitespace-pre-line">{entry.content}</div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-2">Mood Analysis</h3>
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm mb-1">
                  <span className="capitalize font-medium">{entry.mood.type}</span>
                  <span className="text-muted-foreground"> with {Math.round(entry.mood.score * 100)}% intensity</span>
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${entry.mood.score * 100}%`,
                      backgroundColor: entry.mood.type === 'joy' ? moodColors.joy.split(' ')[0] : 
                                      entry.mood.type === 'sadness' ? moodColors.sadness.split(' ')[0] : 
                                      entry.mood.type === 'anger' ? moodColors.anger.split(' ')[0] : 
                                      entry.mood.type === 'fear' ? moodColors.fear.split(' ')[0] : 
                                      moodColors.neutral.split(' ')[0]
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {entry.tags.length > 0 && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </>
          )}
          
          {entry.aiAnalysis && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">AI Insights</h3>
                <div className="bg-accent/50 p-4 rounded-md">
                  <p className="text-sm mb-2"><span className="font-medium">Detected Topics:</span> {entry.aiAnalysis.topics.join(', ')}</p>
                  <p className="text-sm"><span className="font-medium">Keywords:</span> {entry.aiAnalysis.keywords.join(', ')}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EntryDetail;
