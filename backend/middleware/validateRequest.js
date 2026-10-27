const rateLimit = require('express-rate-limit');

// Rate limiter for report submissions (max 10 submissions per 15 minutes per IP)
const reportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many reports submitted from this IP. Please wait 15 minutes before submitting again.',
  },
});

// Rate limiter for authentication attempts (max 10 attempts per 15 minutes per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. For security reasons, please try again in 15 minutes.',
  },
});

// Helper validation middleware for Hazard Report creation
const validateReportInput = (req, res, next) => {
  const {
    title,
    reporterName,
    reporterEmail,
    state,
    district,
    location,
    hazardType,
    description,
    observedConditions,
  } = req.body;

  const errors = [];

  if (!title || title.trim().length < 5 || title.trim().length > 120) {
    errors.push('Title must be between 5 and 120 characters.');
  }

  if (!reporterName || reporterName.trim().length < 2) {
    errors.push('Reporter name must be at least 2 characters.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!reporterEmail || !emailRegex.test(reporterEmail.trim())) {
    errors.push('A valid reporter email address is required.');
  }

  if (!state || state.trim().length === 0) errors.push('State is required.');
  if (!district || district.trim().length === 0) errors.push('District is required.');
  if (!location || location.trim().length === 0) errors.push('Location is required.');

  const validTypes = [
    'Visible ground cracks',
    'Rockfall',
    'Slope movement',
    'Unusual water flow',
    'Road damage',
    'Other',
  ];
  if (!hazardType || !validTypes.includes(hazardType)) {
    errors.push(`Hazard type must be one of: ${validTypes.join(', ')}.`);
  }

  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters detailing the hazard.');
  }

  if (!observedConditions || observedConditions.trim().length === 0) {
    errors.push('Observed conditions field is required.');
  }

  if (req.body.latitude !== undefined && req.body.latitude !== null && req.body.latitude !== '') {
    const lat = Number(req.body.latitude);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      errors.push('Latitude must be a valid number between -90 and 90.');
    }
  }

  if (req.body.longitude !== undefined && req.body.longitude !== null && req.body.longitude !== '') {
    const lng = Number(req.body.longitude);
    if (isNaN(lng) || lng < -180 || lng > 180) {
      errors.push('Longitude must be a valid number between -180 and 180.');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = {
  reportLimiter,
  authLimiter,
  validateReportInput,
};
