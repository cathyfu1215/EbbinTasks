# EbbinTasks

EbbinTasks is a spaced repetition task management system that helps you retain knowledge more effectively using the Ebbinghaus forgetting curve principles.

## Features

- Create tasks and break them down into smaller, manageable chunks
- Set importance for each task chunk to prioritize your learning
- Automatically schedule task chunks for review based on priority
- Track your progress with a daily review schedule
- Mark items as mastered when you've fully learned them

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL database
- RESTful API architecture

### Frontend
- React
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- PostgreSQL (v12 or later)

### Database Setup

1. Create a PostgreSQL database:

```bash
createdb ebbintasks
```

2. Run the database initialization script:

```bash
psql -d ebbintasks -f backend/src/config/init.sql
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on the `.env.example` file and update the database connection string.

4. Start the backend server:

```bash
npm run dev
```

The server will start on http://localhost:5000.

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend development server:

```bash
npm start
```

The React app will start on http://localhost:3000.

## Usage

1. Create tasks that you want to learn (e.g., "Leetcode Problems", "Spanish Vocabulary")
2. Break tasks down into smaller chunks
3. Set importance for each chunk (how important it is for you to learn)
4. Generate your daily schedule
5. Review chunks according to the schedule
6. Mark chunks as complete when reviewed or mastered when fully learned

## Project Structure

```
ebbintasks/
├── backend/              # Node.js/Express backend
│   ├── src/
│   │   ├── config/       # Configuration files and DB setup
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   └── server.js     # Main server file
│   └── package.json
│
├── frontend/             # React frontend
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── App.js        # Main App component
│   └── package.json
│
└── README.md
```

## How It Works

EbbinTasks uses the principles of spaced repetition based on the Ebbinghaus forgetting curve to help you retain information more effectively:

1. Each task chunk has a retention score that decreases over time
2. User-defined importance determines how critical a chunk is to learn
3. Priority is calculated by multiplying retention score by importance
4. The system schedules reviews based on priority, ensuring you focus on what's most important
5. As you review chunks, their retention score adjusts, spacing out reviews over time

## License

This project is licensed under the MIT License - see the LICENSE file for details.

