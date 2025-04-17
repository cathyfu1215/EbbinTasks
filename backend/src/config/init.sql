-- Database schema for EbbinTasks

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table to store tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table to store task chunks
CREATE TABLE IF NOT EXISTS task_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_task UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_reviewed TIMESTAMP,
  review_count INTEGER DEFAULT 0,
  retention_score FLOAT DEFAULT 1.0,
  user_importance FLOAT CHECK (user_importance BETWEEN 0 AND 1),
  priority FLOAT GENERATED ALWAYS AS (retention_score * user_importance) STORED,
  order_within_task INTEGER,
  is_review BOOLEAN DEFAULT TRUE,
  is_mastered BOOLEAN DEFAULT FALSE
);

-- Table to store daily scheduled chunks
CREATE TABLE IF NOT EXISTS daily_schedule (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_chunk_id UUID REFERENCES task_chunks(id) ON DELETE CASCADE,
  scheduled_for DATE NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP
);

-- Index for faster retrieval
CREATE INDEX IF NOT EXISTS idx_task_chunks_parent ON task_chunks(parent_task);
CREATE INDEX IF NOT EXISTS idx_daily_schedule_date ON daily_schedule(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_task_chunks_priority ON task_chunks(priority);

-- Sample data for testing
INSERT INTO tasks (id, title) VALUES 
  (uuid_generate_v4(), 'Leetcode Problems'),
  (uuid_generate_v4(), 'System Design Interview')
ON CONFLICT DO NOTHING; 