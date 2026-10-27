const express = require('express');
const router = express.Router();
const {
  createAlert,
  getAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
} = require('../controllers/alertController');
const { protect, optionalAuth, requireAdmin } = require('../middleware/authMiddleware');

router
  .route('/')
  .post(protect, requireAdmin, createAlert)
  .get(optionalAuth, getAlerts);

router
  .route('/:id')
  .get(getAlertById)
  .put(protect, requireAdmin, updateAlert)
  .delete(protect, requireAdmin, deleteAlert);

module.exports = router;
