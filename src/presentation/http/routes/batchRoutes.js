const express = require('express');
const createBatchRoutes = (batchController, authMiddleware) => {
  const router = express.Router();
  router.get(
    '/getAllBatches',
    batchController.getBatches.bind(batchController)
  );
  router.get('/:id', batchController.getBatch.bind(batchController));
  router.post('/createBatch', batchController.create.bind(batchController));
  router.put(
    '/:id',
    authMiddleware.protect(),
    batchController.update.bind(batchController)
  );
  router.delete(
    '/:id',
    authMiddleware.protect(),
    batchController.delete.bind(batchController)
  );
  return router;
};
module.exports = createBatchRoutes;
