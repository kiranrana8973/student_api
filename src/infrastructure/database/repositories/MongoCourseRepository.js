const ICourseRepository = require('../../../domain/repositories/ICourseRepository');
const Course = require('../../../domain/entities/Course');
const CourseModel = require('../models/CourseModel');
class MongoCourseRepository extends ICourseRepository {
  _toDomainEntity(doc) {
    if (!doc) return null;
    return new Course({
      id: doc._id.toString(),
      courseName: doc.courseName,
      description: doc.description,
      duration: doc.duration,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
  async create(course) {
    const doc = await CourseModel.create({
      courseName: course.courseName,
      description: course.description,
      duration: course.duration,
    });
    return this._toDomainEntity(doc);
  }
  async findById(id) {
    const doc = await CourseModel.findById(id);
    return this._toDomainEntity(doc);
  }
  async findByName(courseName) {
    const doc = await CourseModel.findOne({ courseName });
    return this._toDomainEntity(doc);
  }
  async findAll() {
    const docs = await CourseModel.find().lean();
    return docs.map((doc) => this._toDomainEntity(doc));
  }
  async update(id, data) {
    const doc = await CourseModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return this._toDomainEntity(doc);
  }
  async delete(id) {
    const doc = await CourseModel.findById(id);
    if (!doc) return null;
    await doc.deleteOne();
    return this._toDomainEntity(doc);
  }
  async exists(id) {
    const count = await CourseModel.countDocuments({ _id: id });
    return count > 0;
  }
}
module.exports = MongoCourseRepository;
