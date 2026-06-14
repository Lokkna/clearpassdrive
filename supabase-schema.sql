-- Run this in your Supabase project SQL editor
-- Go to: Supabase Dashboard → SQL Editor → New Query → Paste → Run

-- Enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMPTZ,
  stripe_session_id TEXT,
  amount_paid INTEGER DEFAULT 0,
  progress JSONB DEFAULT '{}',
  current_chapter INTEGER DEFAULT 1,
  exam_passed BOOLEAN DEFAULT FALSE,
  exam_score INTEGER,
  exam_attempts INTEGER DEFAULT 0,
  exam_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own enrollment
CREATE POLICY "Users can view own enrollment"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollment"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrollment"
  ON enrollments FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can do everything (for API routes using SUPABASE_SECRET_KEY)
CREATE POLICY "Service role full access"
  ON enrollments FOR ALL
  USING (auth.role() = 'service_role');
