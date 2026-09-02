-- =====================================================================
-- LABTRACK DB Migration: Student Progress + Comments tables
-- Run this SQL against your PostgreSQL / Supabase database
-- =====================================================================

-- ─── 1. Project Evaluations ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_evaluations (
  eval_id        BIGSERIAL PRIMARY KEY,
  team_id        BIGINT NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
  eval_name      VARCHAR(100) NOT NULL,
  eval_order     INT NOT NULL DEFAULT 0,
  eval_date      DATE,
  completed      BOOLEAN NOT NULL DEFAULT false,
  marks_obtained NUMERIC(6,2) DEFAULT 0,
  max_marks      NUMERIC(6,2) DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (team_id, eval_order)
);

-- ─── 2. Faculty Team Remarks ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faculty_team_remarks (
  remark_id   BIGSERIAL PRIMARY KEY,
  team_id     BIGINT NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
  faculty_id  BIGINT NOT NULL REFERENCES faculty(faculty_id) ON DELETE CASCADE,
  remark_text TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 3. Project Details (domain, tech stack, repo, dates) ────────────
CREATE TABLE IF NOT EXISTS project_details (
  detail_id   BIGSERIAL PRIMARY KEY,
  team_id     BIGINT NOT NULL UNIQUE REFERENCES teams(team_id) ON DELETE CASCADE,
  domain      VARCHAR(100),
  tech_stack  VARCHAR(255),
  repository  TEXT,
  start_date  DATE,
  end_date    DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 4. Comments (generic — works for any entity) ────────────────────
CREATE TABLE IF NOT EXISTS comments (
  comment_id   BIGSERIAL PRIMARY KEY,
  entity_type  VARCHAR(50) NOT NULL,
  entity_id    BIGINT NOT NULL,
  user_id      BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookup by entity
CREATE INDEX IF NOT EXISTS idx_comments_entity
  ON comments (entity_type, entity_id);

-- ─── 5. Seed default evaluations for existing teams ──────────────────
-- This creates 5 default evaluations for every existing team
-- that doesn't already have evaluations configured.
INSERT INTO project_evaluations (team_id, eval_name, eval_order, completed, max_marks)
SELECT
  t.team_id,
  evals.eval_name,
  evals.eval_order,
  false,
  evals.max_marks
FROM teams t
CROSS JOIN (
  VALUES
    ('Proposal',         1, 10),
    ('Evaluation 1',     2, 20),
    ('Evaluation 2',     3, 20),
    ('Evaluation 3',     4, 20),
    ('Final Evaluation', 5, 50)
) AS evals(eval_name, eval_order, max_marks)
WHERE NOT EXISTS (
  SELECT 1 FROM project_evaluations pe
  WHERE pe.team_id = t.team_id
);
