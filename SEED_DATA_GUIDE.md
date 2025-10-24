# Database Seeding Guide

Quick guide for populating your database with test data.

## Quick Start

### Seed Database
```bash
npm run seed
```

### Delete All Data
```bash
npm run seed:delete
```

## What Gets Created

| Type | Count | Details |
|------|-------|---------|
| 📚 Courses | 3 | Web Development, Data Science, Mobile App Development |
| 📦 Batches | 3 | Batch 2024-A, 2024-B, 2025-A |
| 👥 Students | 3 | John Doe, Emma Wilson, Noah Garcia |

## Test Credentials

All students have the same password: **`password123`**

| Name | Email | Course | Batch |
|------|-------|--------|-------|
| John Doe | john.doe@example.com | Web Development | Batch 2024-A |
| Emma Wilson | emma.wilson@university.edu | Data Science | Batch 2024-B |
| Noah Garcia | noah.garcia@university.edu | Mobile App Development | Batch 2025-A |

## Quick Test

```bash
# Login as John Doe
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.com", "password": "password123"}'
```

## ⚠️ Warning

The seed script **DELETES ALL EXISTING DATA** before inserting new records. Do not use in production!

## More Information

See [scripts/README.md](scripts/README.md) for detailed documentation.
