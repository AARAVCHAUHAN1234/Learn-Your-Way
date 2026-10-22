import { Lesson, QuizAttempt, LearnerProgress, UserPreferences } from './types';
import { SAMPLE_PHOTOSYNTHESIS_LESSON } from './sampleLesson';

const STORAGE_KEYS = {
  LESSONS: 'liyw_lessons_store_v1',
  PREFERENCES: 'liyw_user_preferences_v1',
  QUIZ_ATTEMPTS: 'liyw_quiz_attempts_v1',
  PROGRESS: 'liyw_learner_progress_v1'
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  preferredLanguage: 'en',
  readAloud: false,
  simplifiedText: false,
  visualDescriptions: false,
  captionsAndTranscripts: false,
  additionalPractice: false,
  readingLevel: 'foundational',
  speechRate: 1.0,
  highContrast: false,
  fontSize: 'normal'
};

// Initial in-memory cache for server-side & client-side hydration
let memoryLessons: Lesson[] = [SAMPLE_PHOTOSYNTHESIS_LESSON];
let memoryQuizAttempts: QuizAttempt[] = [
  {
    id: 'att-sample-1',
    lessonId: SAMPLE_PHOTOSYNTHESIS_LESSON.id,
    learnerId: 'demo-learner-1',
    score: 5,
    totalQuestions: 5,
    answers: [1, 1, 1, 0, 1],
    completedAt: '2026-10-22T11:15:00Z'
  },
  {
    id: 'att-sample-2',
    lessonId: SAMPLE_PHOTOSYNTHESIS_LESSON.id,
    learnerId: 'demo-learner-2',
    score: 4,
    totalQuestions: 5,
    answers: [1, 1, 0, 0, 1],
    completedAt: '2026-10-22T14:20:00Z'
  }
];

export const StorageService = {
  getLessons(): Lesson[] {
    if (typeof window === 'undefined') {
      return memoryLessons;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LESSONS);
      if (!stored) {
        localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify([SAMPLE_PHOTOSYNTHESIS_LESSON]));
        return [SAMPLE_PHOTOSYNTHESIS_LESSON];
      }
      const parsed: Lesson[] = JSON.parse(stored);
      // Ensure sample lesson always exists
      if (!parsed.some(l => l.id === SAMPLE_PHOTOSYNTHESIS_LESSON.id)) {
        parsed.unshift(SAMPLE_PHOTOSYNTHESIS_LESSON);
      }
      return parsed;
    } catch {
      return memoryLessons;
    }
  },

  getLessonById(id: string): Lesson | undefined {
    const lessons = this.getLessons();
    return lessons.find(l => l.id === id);
  },

  saveLesson(lesson: Lesson): void {
    if (typeof window === 'undefined') {
      const idx = memoryLessons.findIndex(l => l.id === lesson.id);
      if (idx >= 0) memoryLessons[idx] = lesson;
      else memoryLessons.unshift(lesson);
      return;
    }
    const current = this.getLessons();
    const idx = current.findIndex(l => l.id === lesson.id);
    if (idx >= 0) {
      current[idx] = lesson;
    } else {
      current.unshift(lesson);
    }
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(current));
  },

  deleteLesson(id: string): void {
    if (id === SAMPLE_PHOTOSYNTHESIS_LESSON.id) {
      // Protect default sample lesson from permanent deletion or recreate
      return;
    }
    if (typeof window === 'undefined') {
      memoryLessons = memoryLessons.filter(l => l.id !== id);
      return;
    }
    const current = this.getLessons().filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(current));
  },

  getPreferences(): UserPreferences {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs: UserPreferences): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  },

  getQuizAttempts(): QuizAttempt[] {
    if (typeof window === 'undefined') return memoryQuizAttempts;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
      return stored ? JSON.parse(stored) : memoryQuizAttempts;
    } catch {
      return memoryQuizAttempts;
    }
  },

  saveQuizAttempt(attempt: QuizAttempt): void {
    if (typeof window === 'undefined') {
      memoryQuizAttempts.push(attempt);
      return;
    }
    const current = this.getQuizAttempts();
    current.push(attempt);
    localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(current));
  },

  recordFormatAccessed(lessonId: string, format: string): void {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      const progressMap: Record<string, LearnerProgress> = raw ? JSON.parse(raw) : {};
      const current = progressMap[lessonId] || {
        lessonId,
        completed: false,
        lastAccessed: new Date().toISOString(),
        formatsUsed: []
      };
      if (!current.formatsUsed.includes(format)) {
        current.formatsUsed.push(format);
      }
      current.lastAccessed = new Date().toISOString();
      progressMap[lessonId] = current;
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressMap));
    } catch (e) {
      console.warn('Failed to update progress', e);
    }
  },

  getProgress(): Record<string, LearnerProgress> {
    if (typeof window === 'undefined') return {};
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }
};
