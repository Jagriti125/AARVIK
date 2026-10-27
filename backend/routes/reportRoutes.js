const express = require('express');
const router = express.Router();
const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
} = require('../controllers/reportController');
const { protect, optionalAuth, requireAdmin } = require('../middleware/authMiddleware');
const { reportLimiter, validateReportInput } = require('../middleware/validateRequest');

router
  .route('/')
  .post(reportLimiter, validateReportInput, createReport)
  .get(optionalAuth, getReports);

router
  .route('/:id')
  .get(optionalAuth, getReportById)
  .put(protect, requireAdmin, updateReport)
  .delete(protect, requireAdmin, deleteReport);

module.exports = router;
