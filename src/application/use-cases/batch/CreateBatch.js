/**
 * Create Batch Use Case
 */

const ValidationException = require('../../../domain/exceptions/ValidationException');
const Batch = require('../../../domain/entities/Batch');

class CreateBatch {
  constructor(batchRepository) {
    this.batchRepository = batchRepository;
  }

  async execute(batchData) {
    // Convert date strings to Date objects if needed
    const processedData = {
      ...batchData,
      startDate: batchData.startDate ? new Date(batchData.startDate) : undefined,
      endDate: batchData.endDate ? new Date(batchData.endDate) : undefined,
    };

    // Create batch entity
    const batch = new Batch(processedData);

    // Validate batch data
    const validation = batch.validate();
    if (!validation.isValid) {
      throw new ValidationException('Validation failed', validation.errors);
    }

    // Create batch
    const createdBatch = await this.batchRepository.create(batch);

    return createdBatch;
  }
}

module.exports = CreateBatch;
