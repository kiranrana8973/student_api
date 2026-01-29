const dotenv = require('dotenv');
const mongoose = require('mongoose');
const colors = require('colors');
const bcrypt = require('bcryptjs');

dotenv.config();

const CourseModel = require('../src/infrastructure/database/models/CourseModel');
const BatchModel = require('../src/infrastructure/database/models/BatchModel');
const StudentModel = require('../src/infrastructure/database/models/StudentModel');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.LOCAL_DATABASE_URI);
    console.log('MongoDB Connected...'.cyan.bold);
  } catch (err) {
    console.error(`Error: ${err.message}`.red.bold);
    process.exit(1);
  }
};

const coursesData = [
  { courseName: 'Web Development', description: 'Full stack web development with React and Node.js', duration: 6 },
  { courseName: 'Data Science', description: 'Machine learning and data analysis with Python', duration: 8 },
  { courseName: 'Mobile App Development', description: 'iOS and Android development with Flutter', duration: 5 },
  { courseName: 'Cloud Computing', description: 'AWS, Azure and Google Cloud platforms', duration: 4 },
  { courseName: 'Cybersecurity', description: 'Network security and ethical hacking', duration: 6 },
  { courseName: 'DevOps Engineering', description: 'CI/CD, Docker, Kubernetes and automation', duration: 5 },
  { courseName: 'UI/UX Design', description: 'User interface and experience design principles', duration: 3 },
  { courseName: 'Artificial Intelligence', description: 'Deep learning and neural networks', duration: 10 },
  { courseName: 'Blockchain Development', description: 'Smart contracts and decentralized applications', duration: 4 },
  { courseName: 'Game Development', description: 'Unity and Unreal Engine game creation', duration: 7 },
];

const batchesData = [
  { batchName: 'Batch 2024-A', capacity: 30, startDate: new Date('2024-01-15'), endDate: new Date('2024-06-15') },
  { batchName: 'Batch 2024-B', capacity: 25, startDate: new Date('2024-03-01'), endDate: new Date('2024-08-01') },
  { batchName: 'Batch 2024-C', capacity: 35, startDate: new Date('2024-05-01'), endDate: new Date('2024-10-01') },
  { batchName: 'Batch 2024-D', capacity: 20, startDate: new Date('2024-07-01'), endDate: new Date('2024-12-01') },
  { batchName: 'Batch 2024-E', capacity: 40, startDate: new Date('2024-09-01'), endDate: new Date('2025-02-01') },
  { batchName: 'Batch 2025-A', capacity: 30, startDate: new Date('2025-01-10'), endDate: new Date('2025-06-10') },
  { batchName: 'Batch 2025-B', capacity: 25, startDate: new Date('2025-03-01'), endDate: new Date('2025-08-01') },
  { batchName: 'Batch 2025-C', capacity: 35, startDate: new Date('2025-05-01'), endDate: new Date('2025-10-01') },
  { batchName: 'Batch 2025-D', capacity: 28, startDate: new Date('2025-07-01'), endDate: new Date('2025-12-01') },
  { batchName: 'Batch 2025-E', capacity: 32, startDate: new Date('2025-09-01'), endDate: new Date('2026-02-01') },
];

const studentsData = [
  { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '9876543210' },
  { firstName: 'Emma', lastName: 'Wilson', email: 'emma.wilson@example.com', phone: '9876543211' },
  { firstName: 'Noah', lastName: 'Garcia', email: 'noah.garcia@example.com', phone: '9876543212' },
  { firstName: 'Olivia', lastName: 'Martinez', email: 'olivia.martinez@example.com', phone: '9876543213' },
  { firstName: 'Liam', lastName: 'Anderson', email: 'liam.anderson@example.com', phone: '9876543214' },
  { firstName: 'Sophia', lastName: 'Thomas', email: 'sophia.thomas@example.com', phone: '9876543215' },
  { firstName: 'William', lastName: 'Jackson', email: 'william.jackson@example.com', phone: '9876543216' },
  { firstName: 'Ava', lastName: 'White', email: 'ava.white@example.com', phone: '9876543217' },
  { firstName: 'James', lastName: 'Harris', email: 'james.harris@example.com', phone: '9876543218' },
  { firstName: 'Isabella', lastName: 'Clark', email: 'isabella.clark@example.com', phone: '9876543219' },
];

const seedData = async () => {
  try {
    console.log('Starting data seeding...'.yellow);
    console.log('Clearing existing data...'.yellow);

    await CourseModel.deleteMany();
    await BatchModel.deleteMany();
    await StudentModel.deleteMany();
    console.log('Existing data cleared.'.green);

    console.log('\nCreating courses...'.yellow);
    const courses = await CourseModel.insertMany(coursesData);
    console.log(`Created ${courses.length} courses`.green);

    console.log('\nCreating batches...'.yellow);
    const batches = await BatchModel.insertMany(batchesData);
    console.log(`Created ${batches.length} batches`.green);

    console.log('\nCreating students...'.yellow);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const studentsWithRefs = studentsData.map((student, index) => ({
      ...student,
      password: hashedPassword,
      batch: batches[index % batches.length]._id,
      course: [courses[index % courses.length]._id],
      authProvider: 'local',
    }));

    const students = await StudentModel.insertMany(studentsWithRefs);
    console.log(`Created ${students.length} students`.green);

    console.log('\n' + '='.repeat(50).cyan);
    console.log('SEED DATA COMPLETED'.green.bold);
    console.log('='.repeat(50).cyan);

    console.log('\nCourses:'.cyan.bold);
    courses.forEach((c, i) => console.log(`  ${i + 1}. ${c.courseName}`));

    console.log('\nBatches:'.cyan.bold);
    batches.forEach((b, i) => console.log(`  ${i + 1}. ${b.batchName}`));

    console.log('\nStudents:'.cyan.bold);
    students.forEach((s, i) => console.log(`  ${i + 1}. ${s.firstName} ${s.lastName} (${s.email})`));

    console.log('\nAll student passwords: password123'.yellow);
    console.log('='.repeat(50).cyan + '\n');

  } catch (err) {
    console.error(`Error: ${err.message}`.red.bold);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    console.log('Deleting all data...'.red.bold);
    await CourseModel.deleteMany();
    await BatchModel.deleteMany();
    await StudentModel.deleteMany();
    console.log('All data deleted!'.green.bold);
  } catch (err) {
    console.error(`Error: ${err.message}`.red.bold);
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
