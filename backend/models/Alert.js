const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
      maxlength: [150, 'Alert title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Alert description is required'],
      trim: true,
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
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
    location: {
      type: String,
      required: [true, 'Specific location is required'],
      trim: true,
    },
    riskLevel: {
      type: String,
      required: [true, 'Risk level is required'],
      enum: {
        values: ['Low', 'Moderate', 'High', 'Critical'],
        message: '{VALUE} is not a valid risk level',
      },
    },
    recommendedPrecautions: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      required: [true, 'Alert status is required'],
      enum: {
        values: ['Draft', 'Active', 'Expired', 'Resolved'],
        message: '{VALUE} is not a valid alert status',
      },
      default: 'Draft',
    },
    issuedBy: {
      type: String,
      default: 'Authorized Admin',
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
alertSchema.index({ status: 1, riskLevel: 1 });
alertSchema.index({ publishedAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
