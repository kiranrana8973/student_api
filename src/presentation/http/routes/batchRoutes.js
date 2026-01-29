const express = require('express');

const createBatchRoutes = (batchController, authMiddleware) => {
  const router = express.Router();

  router.get('/', batchController.getBatches.bind(batchController));
  router.get('/:id', batchController.getBatch.bind(batchController));
  router.post('/', batchController.create.bind(batchController));
  router.put('/:id', authMiddleware.protect(), batchController.update.bind(batchController));
  router.delete('/:id', authMiddleware.protect(), batchController.delete.bind(batchController));

  return router;
};

module.exports = createBatchRoutes;
