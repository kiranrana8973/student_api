const IBatchRepository = require('../../../domain/repositories/IBatchRepository');
const Batch = require('../../../domain/entities/Batch');
const BatchModel = require('../models/BatchModel');
class MongoBatchRepository extends IBatchRepository {
  _toDomainEntity(doc) {
    if (!doc) return null;
    return new Batch({
      id: doc._id.toString(),
      batchName: doc.batchName,
      capacity: doc.capacity,
      startDate: doc.startDate,
      endDate: doc.endDate,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
  async create(batch) {
    const doc = await BatchModel.create({
      batchName: batch.batchName,
      capacity: batch.capacity,
      startDate: batch.startDate,
      endDate: batch.endDate,
    });
    return this._toDomainEntity(doc);
  }
  async findById(id) {
    const doc = await BatchModel.findById(id);
    return this._toDomainEntity(doc);
  }
  async findByName(batchName) {
    const doc = await BatchModel.findOne({ batchName });
    return this._toDomainEntity(doc);
  }
  async findAll() {
    const docs = await BatchModel.find().lean();
    return docs.map((doc) => this._toDomainEntity(doc));
  }
  async update(id, data) {
    const doc = await BatchModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return this._toDomainEntity(doc);
  }
  async delete(id) {
    const doc = await BatchModel.findById(id);
    if (!doc) return null;
    await doc.deleteOne();
    return this._toDomainEntity(doc);
  }
  async exists(id) {
    const count = await BatchModel.countDocuments({ _id: id });
    return count > 0;
  }
}
module.exports = MongoBatchRepository;
