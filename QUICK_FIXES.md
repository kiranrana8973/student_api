# Quick Fixes - Apply Before Production

These are the recommended fixes to apply before deploying to production.

## 1. Add Database Indexes (5 minutes)

Add these indexes to your models for better performance:

### src/infrastructure/database/models/Student.js
```javascript
// Add after schema definition, before module.exports
StudentSchema.index({ email: 1 }, { unique: true });
StudentSchema.index({ batch: 1 });
StudentSchema.index({ createdAt: -1 });
```

### src/infrastructure/database/models/Course.js
```javascript
CourseSchema.index({ courseName: 1 });
CourseSchema.index({ createdAt: -1 });
```

### src/infrastructure/database/models/Batch.js
```javascript
BatchSchema.index({ batchName: 1 });
BatchSchema.index({ course: 1 });
BatchSchema.index({ createdAt: -1 });
```

---

## 2. Enable Rate Limiting (3 minutes)

### Create the middleware file

**File:** `src/infrastructure/middlewares/RateLimitMiddleware.js`

```javascript
const rateLimit = require('express-rate-limit');

class RateLimitMiddleware {
  static general() {
    return rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      message: {
        success: false,
        error: 'Too many requests, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
  }

  static auth() {
    return rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 5,
      message: {
        success: false,
        error: 'Too many login attempts, please try again later.',
      },
      skipSuccessfulRequests: true,
    });
  }
}

module.exports = RateLimitMiddleware;
```

### Install dependency
```bash
npm install express-rate-limit
```

### Apply in server.js

Add after CORS configuration:

```javascript
const RateLimitMiddleware = require('./src/infrastructure/middlewares/RateLimitMiddleware');

// Apply general rate limiting
app.use(RateLimitMiddleware.general());
```

Add to login route in `src/presentation/http/routes/studentRoutes.js`:

```javascript
const RateLimitMiddleware = require('../../../infrastructure/middlewares/RateLimitMiddleware');

router.post(
  '/login',
  RateLimitMiddleware.auth(),
  studentController.login.bind(studentController)
);
```

---

## 3. Generate Strong JWT Secret (1 minute)

Run this command:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and update `.env.production`:

```env
JWT_SECRET=<paste_generated_secret_here>
```

---

## 4. Set Production CORS Origin (1 minute)

Update `.env.production`:

```env
CORS_ORIGIN=https://yourdomain.com
```

Replace `yourdomain.com` with your actual frontend domain.

---

## 5. Remove Comments from container.js (Optional - 2 minutes)

If you want absolutely no comments, edit `src/container.js` and remove these lines:

- Line 11: `// Student Use Cases`
- Line 23: `// Course Use Cases`
- Line 30: `// Batch Use Cases`
- Line 37: `// Controllers`
- Line 42: `// Middlewares`
- Line 72: `// Student use cases`
- Line 101: `// Course use cases`
- Line 108: `// Batch use cases`
- Line 154: `// Getters for controllers`

**Note:** These comments are helpful for code organization. Recommendation: Keep them.

---

## 6. Add Graceful Shutdown (Optional - 2 minutes)

Add to `server.js` at the end:

```javascript
// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await dbConnection.disconnect();
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    await dbConnection.disconnect();
    console.log('HTTP server closed');
    process.exit(0);
  });
});
```

---

## Checklist

Before deploying:

- [ ] Database indexes added to all models
- [ ] Rate limiting middleware installed and enabled
- [ ] Strong JWT secret generated for production
- [ ] Production CORS origin configured
- [ ] `.env.production` file created with production values
- [ ] Run `npm test` to ensure everything works
- [ ] Run `npm audit` to check for vulnerabilities

---

## Time Required

**Total:** ~15 minutes

- Indexes: 5 min
- Rate limiting: 3 min
- JWT secret: 1 min
- CORS: 1 min
- Graceful shutdown: 2 min
- Verification: 3 min

---

## Verification

After applying fixes:

```bash
# Run tests
npm test

# Check for vulnerabilities
npm audit

# Start in production mode
npm run prod

# Test an endpoint
curl http://localhost:3000/api/v1/health
```

All should pass! ✅
