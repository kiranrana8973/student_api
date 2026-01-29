const dotenv = require('dotenv');
const mongoose = require('mongoose');
const colors = require('colors');
dotenv.config();
const CourseModel = require('../src/infrastructure/database/models/CourseModel');
const BatchModel = require('../src/infrastructure/database/models/BatchModel');
const StudentModel = require('../src/infrastructure/database/models/StudentModel');
const bcrypt = require('bcryptjs');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.LOCAL_DATABASE_URI);
    console.log('MongoDB Connected...'.cyan.bold);
  } catch (err) {
    console.error(`Error: ${err.message}`.red.bold);
    process.exit(1);
  }
};
const seedData = async () => {
  try {
    console.log('Starting data seeding...'.yellow);
    console.log('Clearing existing data...'.yellow);
    await CourseModel.deleteMany();
    await BatchModel.deleteMany();
    await StudentModel.deleteMany();
    console.log('Existing data cleared.'.green);
    console.log('\nCreating courses...'.yellow);
    const courses = await CourseModel.insertMany([
      {
        courseName: 'Web Development',
        description: 'Full stack web development with React and Node.js',
        duration: 6,
      },
      {
        courseName: 'Data Science',
        description: 'Machine learning and data analysis with Python',
        duration: 8,
      },
      {
        courseName: 'Mobile App Development',
        description: 'iOS and Android development with Flutter',
        duration: 5,
      },
    ]);
    console.log(`✓ Created ${courses.length} courses`.green);
    console.log('\nCreating batches...'.yellow);
    const batches = await BatchModel.insertMany([
      {
        batchName: 'Batch 2024-A',
        capacity: 30,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-15'),
      },
      {
        batchName: 'Batch 2024-B',
        capacity: 25,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-12-20'),
      },
      {
        batchName: 'Batch 2025-A',
        capacity: 35,
        startDate: new Date('2025-01-10'),
        endDate: new Date('2025-07-10'),
      },
    ]);
    console.log(`✓ Created ${batches.length} batches`.green);
    console.log('\nCreating students...'.yellow);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    const students = await StudentModel.insertMany([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: hashedPassword,
        batch: batches[0]._id,
        course: [courses[0]._id],
        authProvider: 'local',
      },
      {
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@university.edu',
        password: hashedPassword,
        phone: '5551112222',
        batch: batches[1]._id,
        course: [courses[1]._id],
        authProvider: 'local',
      },
      {
        firstName: 'Noah',
        lastName: 'Garcia',
        email: 'noah.garcia@university.edu',
        password: hashedPassword,
        phone: '5553334444',
        batch: batches[2]._id,
        course: [courses[2]._id],
        authProvider: 'local',
      },
    ]);
    console.log(`✓ Created ${students.length} students`.green);
    console.log('\n' + '='.repeat(50).cyan);
    console.log('Data Seeding Completed Successfully!'.green.bold);
    console.log('='.repeat(50).cyan);
    console.log('\n📊 Summary:'.cyan.bold);
    console.log(`   Courses: ${courses.length}`.white);
    console.log(`   Batches: ${batches.length}`.white);
    console.log(`   Students: ${students.length}`.white);
    console.log('\n📚 Courses Created:'.cyan.bold);
    courses.forEach((course, index) => {
      console.log(`   ${index + 1}. ${course.courseName}`.white);
      console.log(`      ID: ${course._id}`.gray);
      console.log(`      Duration: ${course.duration} months`.gray);
    });
    console.log('\n📦 Batches Created:'.cyan.bold);
    batches.forEach((batch, index) => {
      console.log(`   ${index + 1}. ${batch.batchName}`.white);
      console.log(`      ID: ${batch._id}`.gray);
      console.log(`      Capacity: ${batch.capacity}`.gray);
    });
    console.log('\n👥 Students Created:'.cyan.bold);
    students.forEach((student, index) => {
      console.log(`   ${index + 1}. ${student.firstName} ${student.lastName}`.white);
      console.log(`      Email: ${student.email}`.gray);
      console.log(`      Password: password123`.gray);
    });
    console.log('\n' + '='.repeat(50).cyan);
    console.log('ℹ️  All student passwords: password123'.yellow);
    console.log('='.repeat(50).cyan + '\n');
  } catch (err) {
    console.error(`Error during seeding: ${err.message}`.red.bold);
    process.exit(1);
  }
};
const deleteData = async () => {
  try {
    console.log('Deleting all data...'.red.bold);
    await CourseModel.deleteMany();
    await BatchModel.deleteMany();
    await StudentModel.deleteMany();
    console.log('✓ All data deleted successfully!'.green.bold);
  } catch (err) {
    console.error(`Error during deletion: ${err.message}`.red.bold);
    process.exit(1);
  }
};
const main = async () => {
  await connectDB();
  if (process.argv[2] === '-d' || process.argv[2] === '--delete') {
    await deleteData();
  } else {
    await seedData();
  }
  await mongoose.connection.close();
  console.log('Database connection closed.'.cyan);
  process.exit(0);
};
main();
