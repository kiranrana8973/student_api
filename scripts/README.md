# Database Seeding Scripts

This directory contains scripts for populating the database with test/dummy data.

## Seed Data Script

### Overview
The `seedData.js` script populates the database with sample courses, batches, and students for development and testing purposes.

### Usage

#### Seed the database with dummy data:
```bash
npm run seed
```

#### Delete all data from the database:
```bash
npm run seed:delete
```

Or run directly with Node:
```bash
# Seed data
node scripts/seedData.js

# Delete all data
node scripts/seedData.js --delete
# or
node scripts/seedData.js -d
```

### What Gets Created

#### 📚 3 Courses:
1. **Web Development**
   - Description: Full stack web development with React and Node.js
   - Duration: 6 months

2. **Data Science**
   - Description: Machine learning and data analysis with Python
   - Duration: 8 months

3. **Mobile App Development**
   - Description: iOS and Android development with Flutter
   - Duration: 5 months

#### 📦 3 Batches:
1. **Batch 2024-A**
   - Capacity: 30 students
   - Duration: January 15, 2024 - June 15, 2024

2. **Batch 2024-B**
   - Capacity: 25 students
   - Duration: July 1, 2024 - December 20, 2024

3. **Batch 2025-A**
   - Capacity: 35 students
   - Duration: January 10, 2025 - July 10, 2025

#### 👥 3 Students:
1. **John Doe**
   - Email: john.doe@example.com
   - Password: password123
   - Course: Web Development
   - Batch: Batch 2024-A

2. **Emma Wilson**
   - Email: emma.wilson@university.edu
   - Password: password123
   - Phone: 5551112222
   - Course: Data Science
   - Batch: Batch 2024-B

3. **Noah Garcia**
   - Email: noah.garcia@university.edu
   - Password: password123
   - Phone: 5553334444
   - Course: Mobile App Development
   - Batch: Batch 2025-A

### Important Notes

⚠️ **Warning:** The seed script will **DELETE ALL EXISTING DATA** before inserting new data. Use with caution in production environments!

🔐 **Default Password:** All seeded students have the password: `password123`

### Environment Variables

Make sure your `.env` file has the correct database configuration:
```env
LOCAL_DATABASE_URI=mongodb://127.0.0.1:27017/student_batch
```

### Example Output

```
MongoDB Connected...
Starting data seeding...
Clearing existing data...
Existing data cleared.

Creating courses...
✓ Created 3 courses

Creating batches...
✓ Created 3 batches

Creating students...
✓ Created 3 students

==================================================
Data Seeding Completed Successfully!
==================================================

📊 Summary:
   Courses: 3
   Batches: 3
   Students: 3

📚 Courses Created:
   1. Web Development
      ID: 507f1f77bcf86cd799439011
      Duration: 6 months
   ...

👥 Students Created:
   1. John Doe
      Email: john.doe@example.com
      Password: password123
   ...

==================================================
ℹ️  All student passwords: password123
==================================================

Database connection closed.
```

### Testing the Seeded Data

After seeding, you can test the API with the following credentials:

```bash
# Login as John Doe
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john.doe@example.com", "password": "password123"}'
```

### Troubleshooting

**Issue:** Script fails with connection error
- **Solution:** Ensure MongoDB is running and the `LOCAL_DATABASE_URI` in `.env` is correct

**Issue:** Duplicate key error
- **Solution:** Run `npm run seed:delete` first to clear existing data, then run `npm run seed`

**Issue:** Permission denied
- **Solution:** Make sure the script has execute permissions: `chmod +x scripts/seedData.js`
