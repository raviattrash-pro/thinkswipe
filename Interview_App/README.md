# Interview Simulator Feed App

Production-ready MVP for a TikTok-style interview practice feed with:

- `backend`: Spring Boot 3 + Java 17 + Spring Data JPA + MySQL
- `frontend`: React + Vite + Axios

## Folder structure

```text
D:\Interview_APP\Interview_App/
+-- backend/
|   +-- pom.xml
|   `-- src/main/
|       +-- java/com/interviewsim/app/
|       |   +-- config/
|       |   +-- controller/
|       |   +-- dto/
|       |   +-- model/
|       |   +-- repository/
|       |   +-- service/
|       |   `-- InterviewSimulatorApplication.java
|       `-- resources/application.properties
`-- frontend/
    +-- package.json
    +-- vite.config.js
    +-- index.html
    `-- src/
        +-- api.js
        +-- App.jsx
        +-- main.jsx
        `-- styles.css
```

## Features

- Instant single-screen interview question feed
- Question categories: `DSA`, `System Design`, `HR`
- Answer evaluation with score `1-10` and short two-line feedback
- Model solution is revealed after the user submits an answer
- Infinite feed loop on the frontend
- Attempts stored in MySQL
- Keyboard shortcut: `Enter` to submit, `Shift + Enter` for newline

## Run backend

1. Make sure Java 17+, Maven, and MySQL are installed.
2. Create or start a MySQL database server.
3. Optionally override the default database connection using environment variables:

```bash
DB_URL=jdbc:mysql://localhost:3306/interview_simulator?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=root
DB_PASSWORD=ravi@123
```

4. From `D:\Interview_APP\Interview_App\backend`, run:

```bash
mvn spring-boot:run
```

Backend URL: `http://localhost:8080`

## Run frontend

1. Make sure Node.js 18+ is installed.
2. From `D:\Interview_APP\Interview_App\frontend`, install dependencies:

```bash
npm install
```

3. Start the app:

```bash
npm run dev
```

Frontend URL: `http://localhost:5173`

Optional environment variable:

- `VITE_API_BASE_URL` to point the frontend at a different backend host

## API summary

- `GET /questions/feed`
- `POST /answer`

Example request body:

```json
{
  "questionId": 1,
  "userAnswer": "I would start by clarifying requirements, then explain my approach with tradeoffs and one example."
}
```

## Notes

- The backend seeds interview questions automatically at startup.
- Feed looping is handled client-side so the experience never reaches a hard end.
- Tables are created automatically on startup if they do not already exist.
