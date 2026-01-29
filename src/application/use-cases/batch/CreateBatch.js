const ValidationException = require('../../../domain/exceptions/ValidationException');
const Batch = require('../../../domain/entities/Batch');
class CreateBatch {
  constructor(batchRepository) {
    this.batchRepository = batchRepository;
  }
  async execute(batchData) {
    const processedData = {
      ...batchData,
      startDate: batchData.startDate ? new Date(batchData.startDate) : undefined,
      endDate: batchData.endDate ? new Date(batchData.endDate) : undefined,
    };
    const batch = new Batch(processedData);
    const validation = batch.validate();
    if (!validation.isValid) {
      throw new ValidationException('Validation failed', validation.errors);
    }
    const createdBatch = await this.batchRepository.create(batch);
    return createdBatch;
  }
}
module.exports = CreateBatch;
