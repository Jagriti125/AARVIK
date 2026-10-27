const express = require('express');
const router = express.Router();
const {
  createRiskRecord,
  getRiskRecords,
  getRiskRecordById,
  updateRiskRecord,
  deleteRiskRecord,
} = require('../controllers/riskController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

router
  .route('/')
  .post(protect, requireAdmin, createRiskRecord)
  .get(getRiskRecords);

router
  .route('/:id')
  .get(getRiskRecordById)
  .put(protect, requireAdmin, updateRiskRecord)
  .delete(protect, requireAdmin, deleteRiskRecord);

module.exports = router;
