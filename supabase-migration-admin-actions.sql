-- Migration: admin action audit log
-- Run this in Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- Safe to run on an existing database — additive only, no data loss.

CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE SET NULL,
  chapter_id INTEGER,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

-- Only the service-role key (used server-side by /api/admin/* routes) can
-- read or write this table — no student-facing client ever touches it.
CREATE POLICY "Service role full access on admin_actions"
  ON admin_actions FOR ALL
  USING (auth.role() = 'service_role');
