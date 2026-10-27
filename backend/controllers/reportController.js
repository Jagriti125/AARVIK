const mongoose = require('mongoose');
const HazardReport = require('../models/HazardReport');
const fallbackStore = require('../config/fallbackStore');

// Helper to sanitize public report object
const sanitizeReportForPublic = (report) => {
  const doc = report.toObject ? report.toObject() : { ...report };
  delete doc.reporterEmail;
  delete doc.adminNotes;
  return doc;
};

// @desc    Submit a new hazard report
// @route   POST /api/reports
// @access  Public
const createReport = async (req, res, next) => {
  try {
    const {
      title,
      reporterName,
      reporterEmail,
      state,
      district,
      location,
      latitude,
      longitude,
      hazardType,
      description,
      observedConditions,
      rainfall,
      imageUrl,
      observedAt,
    } = req.body;

    const reportData = {
      title: title.trim(),
      reporterName: reporterName.trim(),
      reporterEmail: reporterEmail.trim().toLowerCase(),
      state: state.trim(),
      district: district.trim(),
      location: location.trim(),
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      hazardType,
      description: description.trim(),
      observedConditions: observedConditions.trim(),
      rainfall: rainfall !== undefined && rainfall !== '' ? Number(rainfall) : undefined,
      imageUrl: imageUrl || '',
      observedAt: observedAt ? new Date(observedAt) : new Date(),
      status: 'Pending Review',
    };

    let newReport;

    if (mongoose.connection.readyState === 1) {
      newReport = await HazardReport.create(reportData);
    } else {
      newReport = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...reportData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      fallbackStore.reports.unshift(newReport);
    }

    res.status(201).json({
      success: true,
      message:
        'Hazard report submitted successfully. It will be reviewed by emergency administration before verification.',
      data: sanitizeReportForPublic(newReport),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get hazard reports (with filtering, search, pagination)
// @route   GET /api/reports
// @access  Public (Sanitized) / Admin (Full details if authenticated)
const getReports = async (req, res, next) => {
  try {
    const {
      search,
      status,
      district,
      state,
      hazardType,
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

      if (status && status !== 'All') query.status = status;
      if (district && district !== 'All') query.district = new RegExp(`^${district}$`, 'i');
      if (state && state !== 'All') query.state = new RegExp(`^${state}$`, 'i');
      if (hazardType && hazardType !== 'All') query.hazardType = hazardType;

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

      const total = await HazardReport.countDocuments(query);
      const reports = await HazardReport.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limitNum);

      const formattedReports = reports.map((rep) =>
        isAdmin ? rep : sanitizeReportForPublic(rep)
      );

      return res.status(200).json({
        success: true,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
        count: formattedReports.length,
        data: formattedReports,
      });
    }

    // Fallback in-memory processing
    let filtered = [...fallbackStore.reports];

    if (status && status !== 'All') {
      filtered = filtered.filter((r) => r.status === status);
    }
    if (district && district !== 'All') {
      filtered = filtered.filter(
        (r) => r.district.toLowerCase() === district.toLowerCase()
      );
    }
    if (state && state !== 'All') {
      filtered = filtered.filter(
        (r) => r.state.toLowerCase() === state.toLowerCase()
      );
    }
    if (hazardType && hazardType !== 'All') {
      filtered = filtered.filter((r) => r.hazardType === hazardType);
    }
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const valA = new Date(a[sortBy] || a.createdAt).getTime();
      const valB = new Date(b[sortBy] || b.createdAt).getTime();
      return order === 'asc' ? valA - valB : valB - valA;
    });

    const total = filtered.length;
    const skip = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(skip, skip + limitNum);

    const formattedReports = paginated.map((rep) =>
      isAdmin ? rep : sanitizeReportForPublic(rep)
    );

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
      count: formattedReports.length,
      data: formattedReports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hazard report by ID
// @route   GET /api/reports/:id
// @access  Public (Sanitized) / Admin (Full details)
const getReportById = async (req, res, next) => {
  try {
    let report = null;

    if (mongoose.connection.readyState === 1) {
      report = await HazardReport.findById(req.params.id);
    } else {
      report = fallbackStore.reports.find(
        (r) => r._id.toString() === req.params.id.toString()
      );
    }

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Hazard report not found.',
      });
    }

    const isAdmin = Boolean(req.admin);
    const data = isAdmin ? report : sanitizeReportForPublic(report);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hazard report status / details
// @route   PUT /api/reports/:id
// @access  Private (Admin)
const updateReport = async (req, res, next) => {
  try {
    const { status, adminNotes, hazardType, description, rainfall, title } = req.body;

    const validStatuses = ['Pending Review', 'Under Review', 'Verified', 'Resolved', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (mongoose.connection.readyState === 1) {
      const report = await HazardReport.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Hazard report not found.',
        });
      }

      if (status) report.status = status;
      if (adminNotes !== undefined) report.adminNotes = adminNotes;
      if (hazardType) report.hazardType = hazardType;
      if (description) report.description = description;
      if (rainfall !== undefined) report.rainfall = rainfall;
      if (title) report.title = title;

      const updated = await report.save();

      return res.status(200).json({
        success: true,
        message: `Report status updated to "${updated.status}".`,
        data: updated,
      });
    }

    // Fallback store update
    const reportIndex = fallbackStore.reports.findIndex(
      (r) => r._id.toString() === req.params.id.toString()
    );
    if (reportIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Hazard report not found.',
      });
    }

    const report = fallbackStore.reports[reportIndex];
    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;
    if (hazardType) report.hazardType = hazardType;
    if (description) report.description = description;
    if (rainfall !== undefined) report.rainfall = rainfall;
    if (title) report.title = title;
    report.updatedAt = new Date();

    fallbackStore.reports[reportIndex] = report;

    res.status(200).json({
      success: true,
      message: `Report status updated to "${report.status}".`,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hazard report
// @route   DELETE /api/reports/:id
// @access  Private (Admin)
const deleteReport = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const report = await HazardReport.findById(req.params.id);
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Hazard report not found.',
        });
      }

      await HazardReport.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Hazard report deleted successfully.',
      });
    }

    // Fallback store delete
    const idx = fallbackStore.reports.findIndex(
      (r) => r._id.toString() === req.params.id.toString()
    );
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: 'Hazard report not found.',
      });
    }

    fallbackStore.reports.splice(idx, 1);

    res.status(200).json({
      success: true,
      message: 'Hazard report deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
};
