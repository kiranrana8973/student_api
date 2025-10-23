/**
 * Get All Batches Use Case
 */

class GetAllBatches {
  constructor(batchRepository) {
    this.batchRepository = batchRepository;
  }

  async execute() {
    const batches = await this.batchRepository.findAll();
    return batches;
  }
}

module.exports = GetAllBatches;
