-- Migration: minimum chapter dwell-time tracking
-- Run this in Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- Safe to run on an existing database — additive only, no data loss.

ALTER TABLE enrollments
  ADD COLUMN IF NOT EXISTS chapter_started_at JSONB DEFAULT '{}';

-- chapter_started_at stores, per enrollment, the server timestamp at which
-- the student first opened each chapter, e.g. {"1": "2026-06-15T10:02:00Z"}.
-- It is written and read only by the /api/chapter-start and
-- /api/chapter-complete routes using the service-role key, so a student
-- cannot forge an earlier start time from the browser to skip the wait.
