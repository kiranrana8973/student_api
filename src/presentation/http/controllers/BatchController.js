class BatchController {
  constructor(useCases) {
    this.createBatch = useCases.createBatch;
    this.getAllBatches = useCases.getAllBatches;
    this.getBatchById = useCases.getBatchById;
    this.updateBatch = useCases.updateBatch;
    this.deleteBatch = useCases.deleteBatch;
  }
  async getBatches(req, res, next) {
    try {
      const batches = await this.getAllBatches.execute();
      res.status(200).json({
        success: true,
        count: batches.length,
        data: batches,
      });
    } catch (error) {
      next(error);
    }
  }
  async getBatch(req, res, next) {
    try {
      const batch = await this.getBatchById.execute(req.params.id);
      res.status(200).json({
        success: true,
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  }
  async create(req, res, next) {
    try {
      const batch = await this.createBatch.execute(req.body);
      res.status(201).json({
        success: true,
        message: 'Batch created successfully',
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  }
  async update(req, res, next) {
    try {
      const batch = await this.updateBatch.execute(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Batch updated successfully',
        data: batch,
      });
    } catch (error) {
      next(error);
    }
  }
  async delete(req, res, next) {
    try {
      await this.deleteBatch.execute(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Batch deleted successfully',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = BatchController;
