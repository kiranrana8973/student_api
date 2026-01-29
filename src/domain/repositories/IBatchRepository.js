class IBatchRepository {
  async create(batch) {
    throw new Error('Method create() must be implemented');
  }
  async findById(id) {
    throw new Error('Method findById() must be implemented');
  }
  async findByName(batchName) {
    throw new Error('Method findByName() must be implemented');
  }
  async findAll() {
    throw new Error('Method findAll() must be implemented');
  }
  async update(id, data) {
    throw new Error('Method update() must be implemented');
  }
  async delete(id) {
    throw new Error('Method delete() must be implemented');
  }
  async exists(id) {
    throw new Error('Method exists() must be implemented');
  }
}
module.exports = IBatchRepository;
