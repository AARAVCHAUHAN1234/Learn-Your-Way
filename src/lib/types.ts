// Schema and Types for "Learn in Your Way" - VSARN

export type UserRole = 'student' | 'teacher' | 'judge';

export interface UserPreferences {
  preferredLanguage: 'en' | 'hi' | 'es' | 'fr' | 'ta';
  readAloud: boolean;
  simplifiedText: boolean;
  visualDescriptions: boolean;
  captionsAndTranscripts: boolean;
  additionalPractice: boolean;
  readingLevel: 'foundational' | 'intermediate' | 'advanced';
  speechRate: number; // 0.8 to 1.4
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DiagramDescription {
  id: string;
  title: string;
  imageUrl?: string;
  altText: string;
  detailedDescription: string;
  keyVisualElements: string[];
  scientificInterpretation: string;
}

export interface LessonVersion {
  formatType: 'original' | 'simplified' | 'translated' | 'audio' | 'visual_diagram' | 'quiz' | 'transcript';
  language: string;
  title: string;
  content: string; // text or JSON string for structured items
  metadata?: Record<string, unknown>;
  isReviewedByTeacher: boolean;
  generatedAt: string;
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  description: string;
  sourceFilename?: string;
  sourceText: string;
  processingStatus: 'draft' | 'processing' | 'ready' | 'error';
  isSample: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Transformed deliverables
  simplifiedText?: {
    foundational: string;
    intermediate: string;
  };
  translations?: Record<string, string>; // language code -> text
  diagrams?: DiagramDescription[];
  quiz?: QuizQuestion[];
  transcript?: {
    audioUrl?: string;
    captions: { start: number; end: number; text: string }[];
    fullText: string;
  };
}

export interface QuizAttempt {
  id: string;
  lessonId: string;
  learnerId: string;
  score: number;
  totalQuestions: number;
  answers: number[];
  completedAt: string;
}

export interface LearnerProgress {
  lessonId: string;
  completed: boolean;
  lastAccessed: string;
  formatsUsed: string[];
  highestQuizScore?: number;
}
