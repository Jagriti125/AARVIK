const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const fallbackStore = require('../config/fallbackStore');

const getAdminById = async (id) => {
  if (mongoose.connection.readyState === 1) {
    return await Admin.findById(id).select('-passwordHash');
  }
  const found = fallbackStore.admins.find((a) => a._id.toString() === id.toString());
  if (found) {
    const copy = { ...found };
    delete copy.passwordHash;
    return copy;
  }
  return null;
};

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'aarvik_dev_jwt_secret_key_terrain_monitor_2026'
      );

      const admin = await getAdminById(decoded.id);
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed: User no longer exists.',
        });
      }

      req.admin = admin;
      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please log in again.',
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization token.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: No authorization token provided.',
    });
  }
};

const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'aarvik_dev_jwt_secret_key_terrain_monitor_2026'
      );
      const admin = await getAdminById(decoded.id);
      if (admin) {
        req.admin = admin;
      }
    } catch {
      // Silently continue for optional auth
    }
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.admin && req.admin.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Forbidden: Administrator privileges required for this action.',
  });
};

module.exports = { protect, optionalAuth, requireAdmin };
