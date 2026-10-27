const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const aabhasService = require('../services/aabhasService');

router.get('/stats', getDashboardStats);

router.get('/aabhas-status', async (req, res, next) => {
  try {
    const status = await aabhasService.checkConnectionStatus();
    res.status(200).json({
      success: true,
      data: status,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
