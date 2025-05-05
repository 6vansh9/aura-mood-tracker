export type MoodType = 'positive' | 'neutral' | 'negative';

// Add Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
  interpretation: any;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionError) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  mood: MoodType;
  moodScore: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  category: 'personal' | 'work' | 'health' | 'relationships' | 'other';
  images: string[];
};

export interface EditorState {
  content: string;
  selection: {
    start: number;
    end: number;
  };
  handleChange: (newContent: string) => void;
  handleSelectionChange: (start: number, end: number) => void;
  insertText: (text: string) => void;
  formatText: (format: 'bold' | 'italic' | 'underline') => void;
  addLink: (url: string) => void;
  addImage: (url: string) => void;
  getContent: () => string;
  setContent: (content: string) => void;
  toggleBlockType: (type: string) => void;
  toggleInlineStyle: (style: string) => void;
  handleKeyCommand: (e: React.KeyboardEvent) => void;
}

export type User = {
  id: string;
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
};

export type Settings = {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  timezone: string;
};

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface MoodStats {
  averageMood: number;
  moodDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  streak: number;
  lastEntryDate: string | null;
}

export interface JournalContextType {
  entries: JournalEntry[];
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, entry: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => JournalEntry | undefined;
  getMoodStats: () => MoodStats;
  getRecentEntries: (days?: number) => JournalEntry[];
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
} 