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
    // Create batch entity
    const batch = new Batch(batchData);

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
