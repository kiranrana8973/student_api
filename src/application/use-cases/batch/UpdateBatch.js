/**
 * Update Batch Use Case
 */

const NotFoundException = require('../../../domain/exceptions/NotFoundException');

class UpdateBatch {
  constructor(batchRepository) {
    this.batchRepository = batchRepository;
  }

  async execute(id, updateData) {
    const batch = await this.batchRepository.update(id, updateData);

    if (!batch) {
      throw new NotFoundException(`Batch not found with id of ${id}`);
    }

    return batch;
  }
}

module.exports = UpdateBatch;
