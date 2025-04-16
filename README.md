
# EbbinTasks: Intelligent Spaced Repetition Task Scheduler

**EbbinTasks** is a smart productivity app that helps users break large goals into smaller, reviewable tasks—and schedules them intelligently based on the Ebbinghaus forgetting curve.

It combines human input (task priority, mastery level, desired intensity) with algorithmic planning (spaced repetition, adaptive scheduling) to ensure meaningful progress with minimal burnout.

---

## 🔧 Key Features

- **Task Chunking**: Break any large goal (e.g. "Leetcode Practice") into smaller chunks (e.g. "Backtracking Basics")
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

- `user_importance`: (0.0–1.0), set by user
- `decay_rate`: affected by mastery level and task difficulty

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

## 🗃️ Suggested PostgreSQL Schema

### `tasks`
```sql
id SERIAL PRIMARY KEY,
parent_task TEXT,
title TEXT,
created_at TIMESTAMP,
importance FLOAT,         -- user-assigned
order_within_task INTEGER,
is_mastered BOOLEAN DEFAULT FALSE
```

### `reviews`
```sql
id SERIAL PRIMARY KEY,
task_id INTEGER REFERENCES tasks(id),
reviewed_at TIMESTAMP,
review_count INTEGER,
last_retention_score FLOAT
```

### `scheduler_queue`
```sql
task_id INTEGER REFERENCES tasks(id),
scheduled_for DATE,
priority FLOAT,
is_review BOOLEAN,
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

## 👋 Built With Love by Cathy Fu & Little Bot

