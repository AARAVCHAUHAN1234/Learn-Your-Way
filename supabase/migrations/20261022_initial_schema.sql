-- Database Schema for Learn in Your Way (Team VSARN)
-- Target: Supabase / PostgreSQL 15+

-- 1. Profiles & Learner Preferences
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'teacher', 'admin')) DEFAULT 'student',
  display_name TEXT NOT NULL,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  preferences JSONB NOT NULL DEFAULT '{
    "readAloud": false,
    "simplifiedText": false,
    "visualDescriptions": false,
    "captionsAndTranscripts": false,
    "additionalPractice": false,
    "readingLevel": "foundational",
    "speechRate": 1.0
  }'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Curriculum Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT,
  grade_level TEXT,
  description TEXT,
  source_filename TEXT,
  source_text TEXT NOT NULL,
  processing_status TEXT NOT NULL CHECK (processing_status IN ('draft', 'processing', 'ready', 'error')) DEFAULT 'draft',
  is_sample BOOLEAN NOT NULL DEFAULT FALSE,
  simplified_foundational TEXT,
  simplified_intermediate TEXT,
  translations JSONB DEFAULT '{}'::jsonb,
  diagrams JSONB DEFAULT '[]'::jsonb,
  quiz JSONB DEFAULT '[]'::jsonb,
  transcript JSONB,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Quiz Attempts
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id TEXT PRIMARY KEY,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  learner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Learner Progress
CREATE TABLE IF NOT EXISTS learner_progress (
  learner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  formats_used TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  last_accessed TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (learner_id, lesson_id)
);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Lessons: Everyone can view approved lessons and sample lessons
CREATE POLICY "Anyone can view ready or sample lessons" ON lessons
  FOR SELECT USING (processing_status = 'ready' OR is_sample = true);

-- Teachers can insert and edit their own lessons
CREATE POLICY "Teachers can insert lessons" ON lessons
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Teachers can update their own lessons" ON lessons
  FOR UPDATE USING (auth.uid() = owner_id);

-- Quiz Attempts: Learners can view and insert their own attempts
CREATE POLICY "Learners can view own quiz attempts" ON quiz_attempts
  FOR SELECT USING (auth.uid() = learner_id);

CREATE POLICY "Learners can insert own quiz attempts" ON quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = learner_id);

-- Teachers can view aggregate quiz attempts for lessons they own
CREATE POLICY "Teachers can view quiz attempts for their lessons" ON quiz_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lessons
      WHERE lessons.id = quiz_attempts.lesson_id AND lessons.owner_id = auth.uid()
    )
  );
