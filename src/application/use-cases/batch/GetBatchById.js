/**
 * Get Batch By ID Use Case
 */

const NotFoundException = require('../../../domain/exceptions/NotFoundException');

class GetBatchById {
  constructor(batchRepository) {
    this.batchRepository = batchRepository;
  }

  async execute(id) {
    const batch = await this.batchRepository.findById(id);

    if (!batch) {
      throw new NotFoundException(`Batch not found with id of ${id}`);
    }

    return batch;
  }
}

module.exports = GetBatchById;
