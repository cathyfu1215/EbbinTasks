# EbbinTasks: Intelligent Spaced Repetition Task Scheduler

**EbbinTasks** is a smart productivity app that helps users break large goals into smaller, reviewable tasks—and schedules them intelligently based on the Ebbinghaus forgetting curve.

It combines human input (task priority, mastery level, desired intensity) with algorithmic planning (spaced repetition, adaptive scheduling) to ensure meaningful progress with minimal burnout.

---

## 🔧 Key Features

- **Task Chunking**: Break any large goal (e.g. "Leetcode Practice") into smaller chunks (e.g. "Backtracking Basics")
- **Multiple Task Streams**: Each user can maintain multiple parent tasks (e.g. Leetcode, Projects, Interviews)
- **Adaptive Scheduling**: Uses the Ebbinghaus forgetting curve to schedule when to review each chunk
- **Dynamic Priority System**: Recalculates urgency based on importance × forgetting decay
- **User Flexibility**:
  - Mark tasks as "Mastered"
  - Adjust importance
  - Add/snooze/reorder chunks
  - Choose intensity mode (e.g. cram to finish quickly vs spaced mastery)
- **Daily Review Queue**: Each day presents a mix of new tasks and reviews
- **Retention Graph**: Visualizes memory retention and shows when tasks are at risk of being forgotten

---

## 🧠 Core Logic & Data Structures

### 1. **Priority Score**
Each task chunk is assigned a dynamic `priority_score`, calculated as:

```python
priority = user_importance × e^(-decay_rate × days_since_last_review)
```

Or tracked explicitly as:

```json
{
  "priority": retention_score × user_importance
}
```

- `user_importance`: (0.0–1.0), set by user
- `retention_score`: decays over time based on Ebbinghaus curve
- `review_count`: helps calibrate forgetting curve

### 2. **Global Task Heap**
We use a heap-like priority queue to:
- Continuously maintain urgency-ranked chunks
- Pop the top N tasks into the daily review plan

Priority is recalculated whenever:
- A task is completed
- A new chunk is added
- Importance is updated
- Mastery is achieved (may be removed from heap)

### 3. **Adaptability Modes**
- **Spaced Repetition Mode**: Optimal memory retention with progressive review spacing
- **Cram Mode**: Compresses future reviews and prioritizes new content
- **Backlog Handling**: Delayed tasks are rescheduled based on current urgency

---

## 🗃️ Updated PostgreSQL Schema

### `tasks`
```sql
id UUID PRIMARY KEY,
user_id UUID,
title TEXT NOT NULL,
created_at TIMESTAMP DEFAULT NOW()
```

### `task_chunks`
```sql
id UUID PRIMARY KEY,
parent_task UUID REFERENCES tasks(id),
title TEXT,
created_at TIMESTAMP,
last_reviewed TIMESTAMP,
review_count INTEGER DEFAULT 0,
retention_score FLOAT DEFAULT 1.0,
user_importance FLOAT CHECK (user_importance BETWEEN 0 AND 1),
priority FLOAT GENERATED ALWAYS AS (retention_score * user_importance) STORED,
order_within_task INTEGER,
is_review BOOLEAN DEFAULT TRUE,
is_mastered BOOLEAN DEFAULT FALSE
```

### `daily_schedule`
```sql
task_id UUID REFERENCES task_chunks(id),
scheduled_for DATE,
is_completed BOOLEAN DEFAULT FALSE
```

---

## 💡 Example Use Case

User Cathy wants to master algorithm topics:
1. Creates parent task: "Leetcode Mastery"
2. Adds chunks: "Binary Search", "Backtracking Basics", "Sliding Window"
3. Sets importance:
   - Backtracking: 0.9
   - Binary Search: 0.6
4. App calculates review times and daily plans
5. Cathy reviews daily and marks progress
6. A week later, she adds: "Arrays Practice"
7. The system rebalances the upcoming schedule and adapts priority queue
8. Cathy also has other tasks like "Build Side Projects" and "Mock Interviews" under her profile

---

## 📈 Bonus Features (Future Ideas)
- Custom decay tuning per user
- Drag-and-drop task reorder UI
- API for integrating with Notion, Google Calendar, etc.
- AI assistant for auto-chunking and summarizing tasks

---

## 🧪 MVP Development Stack
- Frontend: Next.js / React
- Backend: Supabase (PostgreSQL)
- Scheduling Logic: Python or Node.js
- Optional AI: OpenAI or Gemini for chunking and summarizing

---

## 👋 Built With Love by Cathy Fu & Little Bot since April 16,2025

