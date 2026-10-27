const mongoose = require('mongoose');

const riskRecordSchema = new mongoose.Schema(
  {
    locationName: {
      type: String,
      required: [true, 'Location name is required'],
      trim: true,
      maxlength: [100, 'Location name cannot exceed 100 characters'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    latitude: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    rainfall: {
      type: Number,
      required: [true, 'Rainfall reading (mm) is required'],
      min: [0, 'Rainfall cannot be negative'],
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
    riskLevel: {
      type: String,
      required: [true, 'Risk level is required'],
      enum: {
        values: ['Low', 'Moderate', 'High', 'Critical'],
        message: '{VALUE} is not a valid risk level',
      },
      default: 'Low',
    },
    monitoringStatus: {
      type: String,
      required: [true, 'Monitoring status is required'],
      enum: {
        values: ['Active', 'Inactive', 'Archived'],
        message: '{VALUE} is not a valid monitoring status',
      },
      default: 'Active',
    },
    remarks: {
      type: String,
      trim: true,
      maxlength: [1000, 'Remarks cannot exceed 1000 characters'],
    },
    dataSource: {
      type: String,
      required: [true, 'Data source is required'],
      enum: {
        values: [
          'Manual entry',
          'Demonstration data',
          'External weather data',
          'AABHAS model output',
        ],
        message: '{VALUE} is not a recognized data source',
      },
      default: 'Manual entry',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
riskRecordSchema.index({ state: 1, district: 1, riskLevel: 1 });
riskRecordSchema.index({ recordedAt: -1 });

module.exports = mongoose.model('RiskRecord', riskRecordSchema);
