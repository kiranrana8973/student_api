# Student API

A RESTful API built with Node.js, Express, and MongoDB following Clean Architecture principles.

## Features

- Student authentication (Email, Google OAuth, Apple Sign-In)
- Course management
- Batch management
- JWT-based authorization
- File uploads

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- BCrypt password hashing

## Project Structure

```
src/
├── domain/           # Business entities and interfaces
├── application/      # Use cases (business logic)
├── infrastructure/   # Database, external services
└── presentation/     # HTTP controllers and routes
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Start MongoDB locally

4. Seed the database:
```bash
node scripts/seedData.js
```

5. Run the server:
```bash
npm run dev
```

## API Endpoints

### Auth (`/api/v1/auth`)
- `POST /register` - Register student
- `POST /login` - Login student
- `POST /google` - Google OAuth login
- `POST /apple` - Apple Sign-In
- `GET /me` - Get current student

### Courses (`/api/v1/course`)
- `GET /` - Get all courses
- `GET /:id` - Get course by ID
- `POST /` - Create course
- `PUT /:id` - Update course
- `DELETE /:id` - Delete course

### Batches (`/api/v1/batch`)
- `GET /` - Get all batches
- `GET /:id` - Get batch by ID
- `POST /` - Create batch
- `PUT /:id` - Update batch
- `DELETE /:id` - Delete batch

## Environment Variables

```
PORT=3000
LOCAL_DATABASE_URI=mongodb://127.0.0.1:27017/student_batch
JWT_SECRET=your_secret
JWT_EXPIRE=30d
```

## Author

Kiran Rana
