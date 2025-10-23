# Student API

A high-performance RESTful API for student management built with Node.js, Express, and MongoDB following Clean Architecture principles.

## 🚀 Features

- **Student Management** - Register, login, CRUD operations
- **Course Management** - Create and manage courses
- **Batch Management** - Organize students into batches
- **File Upload** - Student profile image uploads
- **Authentication** - JWT-based authentication
- **Clean Architecture** - Separation of concerns, maintainable code
- **High Performance** - 13,000+ req/sec throughput
- **Production Ready** - PM2 cluster mode, monitoring, logging

## 📊 Performance

- **Peak Performance:** 13,270 requests/second
- **Database Queries:** 4,435 requests/second
- **Average Latency:** 4-7ms
- **99th Percentile:** 5-10ms
- **Failure Rate:** 0%

See [PERFORMANCE_REPORT.md](PERFORMANCE_REPORT.md) for detailed benchmarks.

## 🏗️ Architecture

```
src/
├── application/
│   └── use-cases/          # Business logic
├── domain/
│   └── entities/           # Domain models
├── infrastructure/
│   ├── database/           # Database connection
│   ├── middlewares/        # Custom middlewares
│   └── services/           # External services
└── presentation/
    └── http/
        ├── controllers/    # HTTP controllers
        ├── routes/         # API routes
        └── middlewares/    # HTTP middlewares
```

## 🛠️ Tech Stack

- **Runtime:** Node.js v24+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **File Upload:** Multer
- **Security:** Helmet, XSS-Clean, Rate Limiting
- **Process Manager:** PM2 (production)

## 📦 Installation

### Development Setup

```bash
# Clone repository
git clone <repository-url>
cd student_api

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm start
```

### Production Setup

See [DEPLOYMENT_QUICK_START.md](DEPLOYMENT_QUICK_START.md) for quick production deployment.

For comprehensive production setup, see [PRODUCTION_GUIDE.md](PRODUCTION_GUIDE.md).

## 🔧 Configuration

All configuration is managed through environment variables in `.env`:

```env
NODE_ENV=development
PORT=3000
API_VERSION=v1
LOCAL_DATABASE_URI=mongodb://127.0.0.1:27017/student_batch
JWT_SECRET=your_secret_key
```

See [.env.example](.env.example) for all available options.

See [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md) for detailed configuration documentation.

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Quick Reference

See [API_ROUTES.md](API_ROUTES.md) for all endpoints.

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API documentation with examples.

### Available Endpoints

**Authentication & Students**
- `POST /api/v1/auth/register` - Register student
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/getAllStudents` - Get all students (protected)
- `GET /api/v1/auth/getMe` - Get current user (protected)

**Courses**
- `GET /api/v1/course/getAllCourses` - Get all courses
- `POST /api/v1/course/createCourse` - Create course
- `PUT /api/v1/course/:id` - Update course (protected)
- `DELETE /api/v1/course/:id` - Delete course (protected)

**Batches**
- `GET /api/v1/batch/getAllBatches` - Get all batches
- `POST /api/v1/batch/createBatch` - Create batch
- `PUT /api/v1/batch/:id` - Update batch (protected)
- `DELETE /api/v1/batch/:id` - Delete batch (protected)

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage
- **22+ tests** covering core functionality
- Unit tests for business logic
- Integration tests for API endpoints
- 80%+ code coverage goal

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed testing documentation.

### Load Testing
```bash
# Performance testing (requires Apache Bench)
ab -n 1000 -c 10 http://localhost:3000/api/v1/health
```

## 📝 Scripts

```bash
# Development
npm start              # Start with nodemon
npm run dev            # Same as start

# Production
npm run prod           # Single process
npm run pm2:start      # PM2 cluster (recommended)
npm run pm2:stop       # Stop PM2
npm run pm2:restart    # Restart PM2
npm run pm2:logs       # View logs
npm run pm2:monitor    # Monitor processes
```

## 🔐 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Rate limiting
- XSS protection
- NoSQL injection prevention
- Security headers (Helmet)
- CORS configuration
- Input sanitization

## 📈 Monitoring

```bash
# PM2 monitoring
npm run pm2:monitor

# View logs
npm run pm2:logs

# Process list
npm run pm2:list
```

## 🚢 Deployment

### Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start application
npm run pm2:start

# Enable auto-restart on system reboot
pm2 startup
pm2 save
```

### Using Docker (Optional)

```bash
# Build image
docker build -t student-api .

# Run container
docker run -p 3000:3000 --env-file .env student-api
```

## 📊 Capacity

**Current Capacity:**
- Handles 100k-1M users comfortably
- 574M requests/day at 50% capacity
- 24M requests/hour
- 400k requests/minute

**Scaling Options:**
- PM2 cluster mode (4-8x improvement)
- Redis caching (10-100x for cached data)
- Database indexing (2-3x improvement)
- Horizontal scaling with load balancer

## 📁 Project Structure

```
student_api/
├── src/
│   ├── application/         # Use cases
│   ├── domain/              # Domain models
│   ├── infrastructure/      # External concerns
│   └── presentation/        # HTTP layer
├── public/                  # Static files
├── logs/                    # Application logs
├── config/                  # Configuration files
├── .env                     # Environment variables
├── server.js                # Entry point
├── ecosystem.config.js      # PM2 configuration
└── package.json             # Dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Kiran Rana**

## 📞 Support

For issues and questions, please open an issue on GitHub.

## 📚 Additional Documentation

### Getting Started
- [Project Summary](PROJECT_SUMMARY.md) - Complete project overview
- [Quick Fixes](QUICK_FIXES.md) - Pre-production checklist (15 min)

### API Documentation
- [API Routes](API_ROUTES.md) - Quick API reference
- [API Documentation](API_DOCUMENTATION.md) - Detailed API docs with examples

### Testing
- [Testing Guide](TESTING_GUIDE.md) - Comprehensive testing documentation
- [Testing Summary](TESTING_SUMMARY.md) - Test suite overview

### Deployment
- [Production Guide](PRODUCTION_GUIDE.md) - Comprehensive production setup (70+ pages)
- [Deployment Quick Start](DEPLOYMENT_QUICK_START.md) - Quick deployment guide

### Configuration & Performance
- [Configuration Guide](CONFIGURATION_GUIDE.md) - All configuration options
- [Performance Report](PERFORMANCE_REPORT.md) - Load testing results
- [Package Updates](PACKAGE_UPDATE_SUMMARY.md) - Package management

### Audit & Review
- [Final Audit Report](FINAL_AUDIT_REPORT.md) - Complete project audit (Grade: A)

---

**Built with ❤️ using Clean Architecture principles**
