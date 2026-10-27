const mongoose = require('mongoose');
const Alert = require('../models/Alert');
const fallbackStore = require('../config/fallbackStore');

// @desc    Create a new alert
// @route   POST /api/alerts
// @access  Private (Admin)
const createAlert = async (req, res, next) => {
  try {
    const {
      title,
      description,
      state,
      district,
      location,
      riskLevel,
      recommendedPrecautions,
      status,
      expiresAt,
    } = req.body;

    if (!title || !description || !state || !district || !location || !riskLevel) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, state, district, location, and risk level are required.',
      });
    }

    const alertStatus = status || 'Draft';
    const publishedAt = alertStatus === 'Active' ? new Date() : null;

    let precautionsList = [];
    if (Array.isArray(recommendedPrecautions)) {
      precautionsList = recommendedPrecautions.filter(Boolean);
    } else if (typeof recommendedPrecautions === 'string') {
      precautionsList = recommendedPrecautions
        .split('\n')
        .map((p) => p.trim())
        .filter(Boolean);
    }

    const alertData = {
      title: title.trim(),
      description: description.trim(),
      state: state.trim(),
      district: district.trim(),
      location: location.trim(),
      riskLevel,
      recommendedPrecautions: precautionsList,
      status: alertStatus,
      issuedBy: req.admin ? req.admin.name : 'Authorized Admin',
      publishedAt,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    };

    let newAlert;

    if (mongoose.connection.readyState === 1) {
      newAlert = await Alert.create(alertData);
    } else {
      newAlert = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...alertData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      fallbackStore.alerts.unshift(newAlert);
    }

    res.status(201).json({
      success: true,
      message: `Alert created successfully with status "${newAlert.status}".`,
      data: newAlert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get alerts (supports search & filter)
// @route   GET /api/alerts
// @access  Public
const getAlerts = async (req, res, next) => {
  try {
    const {
      search,
      riskLevel,
      status,
      district,
      state,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const isAdmin = Boolean(req.admin);

    if (mongoose.connection.readyState === 1) {
      const query = {};

      if (status && status !== 'All') {
        query.status = status;
      } else if (!isAdmin && (!status || status === 'All')) {
        query.status = { $in: ['Active', 'Resolved'] };
      }

      if (riskLevel && riskLevel !== 'All') query.riskLevel = riskLevel;
      if (district && district !== 'All') query.district = new RegExp(`^${district}$`, 'i');
      if (state && state !== 'All') query.state = new RegExp(`^${state}$`, 'i');

      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: searchRegex },
          { location: searchRegex },
          { district: searchRegex },
          { description: searchRegex },
        ];
      }

      const skip = (pageNum - 1) * limitNum;
      const sortOrder = order === 'asc' ? 1 : -1;

      const total = await Alert.countDocuments(query);
      const alerts = await Alert.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limitNum);

      return res.status(200).json({
        success: true,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
        count: alerts.length,
        data: alerts,
      });
    }

    // Fallback in-memory alerts
    let filtered = [...fallbackStore.alerts];

    if (status && status !== 'All') {
      filtered = filtered.filter((a) => a.status === status);
    } else if (!isAdmin && (!status || status === 'All')) {
      filtered = filtered.filter((a) => a.status === 'Active' || a.status === 'Resolved');
    }

    if (riskLevel && riskLevel !== 'All') {
      filtered = filtered.filter((a) => a.riskLevel === riskLevel);
    }
    if (district && district !== 'All') {
      filtered = filtered.filter(
        (a) => a.district.toLowerCase() === district.toLowerCase()
      );
    }
    if (state && state !== 'All') {
      filtered = filtered.filter(
        (a) => a.state.toLowerCase() === state.toLowerCase()
      );
    }
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q) ||
          a.district.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    filtered.sort((a, b) => {
      const valA = new Date(a[sortBy] || a.createdAt).getTime();
      const valB = new Date(b[sortBy] || b.createdAt).getTime();
      return order === 'asc' ? valA - valB : valB - valA;
    });

    const total = filtered.length;
    const skip = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(skip, skip + limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
      count: paginated.length,
      data: paginated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single alert
// @route   GET /api/alerts/:id
// @access  Public
const getAlertById = async (req, res, next) => {
  try {
    let alert = null;

    if (mongoose.connection.readyState === 1) {
      alert = await Alert.findById(req.params.id);
    } else {
      alert = fallbackStore.alerts.find(
        (a) => a._id.toString() === req.params.id.toString()
      );
    }

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update alert
// @route   PUT /api/alerts/:id
// @access  Private (Admin)
const updateAlert = async (req, res, next) => {
  try {
    const fieldsToUpdate = [
      'title',
      'description',
      'state',
      'district',
      'location',
      'riskLevel',
      'expiresAt',
    ];

    if (mongoose.connection.readyState === 1) {
      const alert = await Alert.findById(req.params.id);
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found.',
        });
      }

      fieldsToUpdate.forEach((field) => {
        if (req.body[field] !== undefined) {
          alert[field] = req.body[field];
        }
      });

      if (req.body.recommendedPrecautions !== undefined) {
        if (Array.isArray(req.body.recommendedPrecautions)) {
          alert.recommendedPrecautions = req.body.recommendedPrecautions.filter(Boolean);
        } else if (typeof req.body.recommendedPrecautions === 'string') {
          alert.recommendedPrecautions = req.body.recommendedPrecautions
            .split('\n')
            .map((p) => p.trim())
            .filter(Boolean);
        }
      }

      if (req.body.status !== undefined) {
        alert.status = req.body.status;
        if (req.body.status === 'Active' && !alert.publishedAt) {
          alert.publishedAt = new Date();
        }
      }

      const updated = await alert.save();

      return res.status(200).json({
        success: true,
        message: 'Alert updated successfully.',
        data: updated,
      });
    }

    // Fallback store update
    const idx = fallbackStore.alerts.findIndex(
      (a) => a._id.toString() === req.params.id.toString()
    );
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found.',
      });
    }

    const alert = fallbackStore.alerts[idx];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        alert[field] = req.body[field];
      }
    });

    if (req.body.recommendedPrecautions !== undefined) {
      if (Array.isArray(req.body.recommendedPrecautions)) {
        alert.recommendedPrecautions = req.body.recommendedPrecautions.filter(Boolean);
      } else if (typeof req.body.recommendedPrecautions === 'string') {
        alert.recommendedPrecautions = req.body.recommendedPrecautions
          .split('\n')
          .map((p) => p.trim())
          .filter(Boolean);
      }
    }

    if (req.body.status !== undefined) {
      alert.status = req.body.status;
      if (req.body.status === 'Active' && !alert.publishedAt) {
        alert.publishedAt = new Date();
      }
    }
    alert.updatedAt = new Date();
    fallbackStore.alerts[idx] = alert;

    res.status(200).json({
      success: true,
      message: 'Alert updated successfully.',
      data: alert,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete alert
// @route   DELETE /api/alerts/:id
// @access  Private (Admin)
const deleteAlert = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const alert = await Alert.findById(req.params.id);
      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'Alert not found.',
        });
      }

      await Alert.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Alert deleted successfully.',
      });
    }

    const idx = fallbackStore.alerts.findIndex(
      (a) => a._id.toString() === req.params.id.toString()
    );
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found.',
      });
    }

    fallbackStore.alerts.splice(idx, 1);

    res.status(200).json({
      success: true,
      message: 'Alert deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAlert,
  getAlerts,
  getAlertById,
  updateAlert,
  deleteAlert,
};
