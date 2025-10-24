/**
 * Update Batch Use Case
 */

const NotFoundException = require('../../../domain/exceptions/NotFoundException');

class UpdateBatch {
  constructor(batchRepository) {
    this.batchRepository = batchRepository;
  }

  async execute(id, updateData) {
    // Convert date strings to Date objects if needed
    const processedData = {
      ...updateData,
    };

    if (updateData.startDate) {
      processedData.startDate = new Date(updateData.startDate);
    }

    if (updateData.endDate) {
      processedData.endDate = new Date(updateData.endDate);
    }

    const batch = await this.batchRepository.update(id, processedData);

    if (!batch) {
      throw new NotFoundException(`Batch not found with id of ${id}`);
    }

    return batch;
  }
}

module.exports = UpdateBatch;
