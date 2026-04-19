# Interview Simulator Feed App

A full-stack TikTok-style swipe feed for interview preparation.

## Tech Stack
- **Backend**: Spring Boot 3, Java 17, JPA, MySQL.
- **Frontend**: React (Vite), Axios, Vanilla CSS.

## Getting Started

### Prerequisites
- Java 17+
- Node.js & npm
- MySQL Server (running on port 3306)

### 1. Backend Setup
1. Open `backend/src/main/resources/application.properties` and update your MySQL credentials.
2. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080` and seed 10 initial questions.

### 2. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL (usually `http://localhost:5173`) in your browser.

## Features
- **Swipe Feed**: Full-screen immersion with one question at a time.
- **Instant Feedback**: Basic heuristic evaluation with random score variations for engagement.
- **Infinite Loop**: The feed never ends, looping back to the first question.
- **Keyboard Shortcut**: Press `Enter` to submit an answer and `Enter` again to swipe to the next question.
