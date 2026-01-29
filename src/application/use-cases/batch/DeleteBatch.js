const NotFoundException = require('../../../domain/exceptions/NotFoundException');
class DeleteBatch {
  constructor(batchRepository) {
    this.batchRepository = batchRepository;
  }
  async execute(id) {
    const batch = await this.batchRepository.findById(id);
    if (!batch) {
      throw new NotFoundException(`Batch not found with id of ${id}`);
    }
    await this.batchRepository.delete(id);
    return batch;
  }
}
module.exports = DeleteBatch;
