/**
 * MongoDB Student Repository Implementation
 */

const IStudentRepository = require("../../../domain/repositories/IStudentRepository");
const Student = require("../../../domain/entities/Student");
const StudentModel = require("../models/StudentModel");

class MongoStudentRepository extends IStudentRepository {
  /**
   * Map Mongoose document to domain entity
   */
  _toDomainEntity(doc) {
    if (!doc) return null;

    return new Student({
      id: doc._id.toString(),
      firstName: doc.firstName,
      lastName: doc.lastName,
      phone: doc.phone,
      image: doc.image,
      email: doc.email,
      password: doc.password,
      batch: doc.batch,
      course: doc.course,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async create(student) {
    const doc = await StudentModel.create({
      firstName: student.firstName,
      lastName: student.lastName,
      phone: student.phone,
      image: student.image,
      email: student.email,
      password: student.password,
      batch: student.batch,
      course: student.course,
    });

    return this._toDomainEntity(doc);
  }

  async findById(id) {
    const doc = await StudentModel.findById(id)
      .select("-password")
      .populate("batch", "batchName")
      .populate("course", "courseName");

    return this._toDomainEntity(doc);
  }

  async findByEmail(email) {
    const doc = await StudentModel.findOne({ email })
      .populate("batch", "name course")
      .populate("course", "name");

    return doc ? this._mapToEntity(doc) : null;
  }

  async findByEmailWithPassword(email) {
    const doc = await StudentModel.findOne({ email }).select("+password");

    return this._toDomainEntity(doc);
  }

  async findAll(skip = 0, limit = 25) {
    const docs = await StudentModel.find()
      .select("-password")
      .populate("batch", "batchName")
      .populate("course", "courseName")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await StudentModel.countDocuments();

    return {
      students: docs.map((doc) => this._toDomainEntity(doc)),
      total,
    };
  }

  async findByBatch(batchId) {
    const docs = await StudentModel.find({ batch: batchId })
      .select("-password -__v")
      .populate("batch", "-__v")
      .populate("course", "-__v")
      .lean();

    return docs.map((doc) => this._toDomainEntity(doc));
  }

  async findByCourse(courseId) {
    const docs = await StudentModel.find({ course: courseId })
      .select("-password -__v")
      .populate("batch", "-__v")
      .populate("course", "-__v")
      .lean();

    return docs.map((doc) => this._toDomainEntity(doc));
  }

  async update(id, data) {
    const doc = await StudentModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select("-password");

    return this._toDomainEntity(doc);
  }

  async delete(id) {
    const doc = await StudentModel.findById(id);
    if (!doc) return null;

    await doc.deleteOne();
    return this._toDomainEntity(doc);
  }

  async existsByEmail(email) {
    const count = await StudentModel.countDocuments({ email });
    return count > 0;
  }

  async findOne(query) {
    const doc = await StudentModel.findOne(query)
      .populate("batch", "name course")
      .populate("course", "name");

    return doc ? this._mapToEntity(doc) : null;
  }
}

module.exports = MongoStudentRepository;
