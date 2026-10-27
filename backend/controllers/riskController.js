const mongoose = require('mongoose');
const RiskRecord = require('../models/RiskRecord');
const fallbackStore = require('../config/fallbackStore');

// @desc    Create a new risk monitoring record
// @route   POST /api/risks
// @access  Private (Admin)
const createRiskRecord = async (req, res, next) => {
  try {
    const {
      locationName,
      state,
      district,
      latitude,
      longitude,
      rainfall,
      recordedAt,
      riskLevel,
      monitoringStatus,
      remarks,
      dataSource,
    } = req.body;

    if (!locationName || !state || !district || rainfall === undefined || rainfall === null) {
      return res.status(400).json({
        success: false,
        message: 'Location name, state, district, and rainfall reading are required.',
      });
    }

    let finalSource = dataSource || 'Manual entry';
    if (finalSource === 'AABHAS model output' && !process.env.AABHAS_API_KEY) {
      finalSource = 'Manual entry';
    }

    const recordData = {
      locationName: locationName.trim(),
      state: state.trim(),
      district: district.trim(),
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
      rainfall: Number(rainfall),
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      riskLevel: riskLevel || 'Low',
      monitoringStatus: monitoringStatus || 'Active',
      remarks: remarks ? remarks.trim() : '',
      dataSource: finalSource,
    };

    let newRecord;

    if (mongoose.connection.readyState === 1) {
      newRecord = await RiskRecord.create(recordData);
    } else {
      newRecord = {
        _id: new mongoose.Types.ObjectId().toString(),
        ...recordData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      fallbackStore.risks.unshift(newRecord);
    }

    res.status(201).json({
      success: true,
      message: 'Risk monitoring record created successfully.',
      data: newRecord,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get risk monitoring records
// @route   GET /api/risks
// @access  Public
const getRiskRecords = async (req, res, next) => {
  try {
    const {
      search,
      riskLevel,
      state,
      district,
      monitoringStatus,
      dataSource,
      page = 1,
      limit = 10,
      sortBy = 'recordedAt',
      order = 'desc',
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    if (mongoose.connection.readyState === 1) {
      const query = {};

      if (riskLevel && riskLevel !== 'All') query.riskLevel = riskLevel;
      if (state && state !== 'All') query.state = new RegExp(`^${state}$`, 'i');
      if (district && district !== 'All') query.district = new RegExp(`^${district}$`, 'i');
      if (monitoringStatus && monitoringStatus !== 'All') query.monitoringStatus = monitoringStatus;
      if (dataSource && dataSource !== 'All') query.dataSource = dataSource;

      if (search && search.trim() !== '') {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { locationName: searchRegex },
          { district: searchRegex },
          { state: searchRegex },
          { remarks: searchRegex },
        ];
      }

      const skip = (pageNum - 1) * limitNum;
      const sortOrder = order === 'asc' ? 1 : -1;

      const total = await RiskRecord.countDocuments(query);
      const records = await RiskRecord.find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limitNum);

      const districts = await RiskRecord.distinct('district');
      const states = await RiskRecord.distinct('state');

      return res.status(200).json({
        success: true,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
        limit: limitNum,
        count: records.length,
        availableDistricts: districts.sort(),
        availableStates: states.sort(),
        data: records,
      });
    }

    // Fallback store
    let filtered = [...fallbackStore.risks];

    if (riskLevel && riskLevel !== 'All') {
      filtered = filtered.filter((r) => r.riskLevel === riskLevel);
    }
    if (state && state !== 'All') {
      filtered = filtered.filter(
        (r) => r.state.toLowerCase() === state.toLowerCase()
      );
    }
    if (district && district !== 'All') {
      filtered = filtered.filter(
        (r) => r.district.toLowerCase() === district.toLowerCase()
      );
    }
    if (monitoringStatus && monitoringStatus !== 'All') {
      filtered = filtered.filter((r) => r.monitoringStatus === monitoringStatus);
    }
    if (dataSource && dataSource !== 'All') {
      filtered = filtered.filter((r) => r.dataSource === dataSource);
    }
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.locationName.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.state.toLowerCase().includes(q) ||
          (r.remarks && r.remarks.toLowerCase().includes(q))
      );
    }

    filtered.sort((a, b) => {
      const valA = new Date(a[sortBy] || a.recordedAt).getTime();
      const valB = new Date(b[sortBy] || b.recordedAt).getTime();
      return order === 'asc' ? valA - valB : valB - valA;
    });

    const total = filtered.length;
    const skip = (pageNum - 1) * limitNum;
    const paginated = filtered.slice(skip, skip + limitNum);

    const districts = [...new Set(fallbackStore.risks.map((r) => r.district))].sort();
    const states = [...new Set(fallbackStore.risks.map((r) => r.state))].sort();

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
      count: paginated.length,
      availableDistricts: districts,
      availableStates: states,
      data: paginated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single risk record
// @route   GET /api/risks/:id
// @access  Public
const getRiskRecordById = async (req, res, next) => {
  try {
    let record = null;

    if (mongoose.connection.readyState === 1) {
      record = await RiskRecord.findById(req.params.id);
    } else {
      record = fallbackStore.risks.find(
        (r) => r._id.toString() === req.params.id.toString()
      );
    }

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Risk record not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update risk record
// @route   PUT /api/risks/:id
// @access  Private (Admin)
const updateRiskRecord = async (req, res, next) => {
  try {
    const fieldsToUpdate = [
      'locationName',
      'state',
      'district',
      'latitude',
      'longitude',
      'rainfall',
      'recordedAt',
      'riskLevel',
      'monitoringStatus',
      'remarks',
      'dataSource',
    ];

    if (mongoose.connection.readyState === 1) {
      const record = await RiskRecord.findById(req.params.id);
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Risk record not found.',
        });
      }

      fieldsToUpdate.forEach((field) => {
        if (req.body[field] !== undefined) {
          record[field] = req.body[field];
        }
      });

      const updated = await record.save();

      return res.status(200).json({
        success: true,
        message: 'Risk monitoring record updated successfully.',
        data: updated,
      });
    }

    // Fallback store update
    const idx = fallbackStore.risks.findIndex(
      (r) => r._id.toString() === req.params.id.toString()
    );
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: 'Risk record not found.',
      });
    }

    const record = fallbackStore.risks[idx];
    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        record[field] = req.body[field];
      }
    });
    record.updatedAt = new Date();
    fallbackStore.risks[idx] = record;

    res.status(200).json({
      success: true,
      message: 'Risk monitoring record updated successfully.',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete risk record
// @route   DELETE /api/risks/:id
// @access  Private (Admin)
const deleteRiskRecord = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const record = await RiskRecord.findById(req.params.id);
      if (!record) {
        return res.status(404).json({
          success: false,
          message: 'Risk record not found.',
        });
      }

      await RiskRecord.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Risk monitoring record deleted successfully.',
      });
    }

    const idx = fallbackStore.risks.findIndex(
      (r) => r._id.toString() === req.params.id.toString()
    );
    if (idx === -1) {
      return res.status(404).json({
        success: false,
        message: 'Risk record not found.',
      });
    }

    fallbackStore.risks.splice(idx, 1);

    res.status(200).json({
      success: true,
      message: 'Risk monitoring record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRiskRecord,
  getRiskRecords,
  getRiskRecordById,
  updateRiskRecord,
  deleteRiskRecord,
};
