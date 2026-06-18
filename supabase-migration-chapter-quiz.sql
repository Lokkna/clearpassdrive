-- Migration: chapter knowledge check attempt tracking
-- Run this in Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- Safe to run on an existing database — additive only, no data loss.

ALTER TABLE enrollments
  ADD COLUMN IF NOT EXISTS chapter_quiz_attempts JSONB DEFAULT '{}';

-- chapter_quiz_attempts stores, per enrollment, a per-chapter record of
-- knowledge check attempts, e.g.:
--   {"1": {"attempts": 2, "lastScore": 80, "passed": true, "lastAttemptAt": "2026-06-17T10:02:00Z"}}
--
-- Written directly by the student's authenticated browser client (same
-- trust model as exam_score/exam_attempts on the final exam) — this is
-- analytics/admin visibility, not a security boundary. The actual
-- completion gate remains /api/chapter-complete's server-enforced dwell
-- timer; passing a knowledge check is what unlocks the call to that
-- endpoint client-side, but the endpoint itself does not re-verify the
-- quiz result.
