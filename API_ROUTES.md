# API Routes

Base URL: `http://localhost:3000`

## Authentication & Student Routes

```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/uploadImage
GET    /api/v1/auth/getAllStudents (Protected)
GET    /api/v1/auth/getMe (Protected)
GET    /api/v1/auth/getStudentsByBatch/:batchId (Protected)
GET    /api/v1/auth/getStudentsByCourse/:courseId (Protected)
PUT    /api/v1/auth/updateStudent/:id (Protected)
DELETE /api/v1/auth/deleteStudent/:id (Protected)
```

## Course Routes

```
GET    /api/v1/course/getAllCourses
GET    /api/v1/course/:id
POST   /api/v1/course/createCourse
PUT    /api/v1/course/:id (Protected)
DELETE /api/v1/course/:id (Protected)
```

## Batch Routes

```
GET    /api/v1/batch/getAllBatches
GET    /api/v1/batch/:id
POST   /api/v1/batch/createBatch
PUT    /api/v1/batch/:id (Protected)
DELETE /api/v1/batch/:id (Protected)
```

## Health Check

```
GET    /api/v1/health
```

---

**Note:** Protected routes require `Authorization: Bearer <token>` header
