const mongoose = require('mongoose');

const hazardReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    reporterName: {
      type: String,
      required: [true, 'Reporter name is required'],
      trim: true,
      maxlength: [80, 'Reporter name cannot exceed 80 characters'],
    },
    reporterEmail: {
      type: String,
      required: [true, 'Reporter email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
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
    hazardType: {
      type: String,
      required: [true, 'Hazard type is required'],
      enum: {
        values: [
          'Visible ground cracks',
          'Rockfall',
          'Slope movement',
          'Unusual water flow',
          'Road damage',
          'Other',
        ],
        message: '{VALUE} is not a supported hazard category',
      },
    },
    description: {
      type: String,
      required: [true, 'Detailed description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    observedConditions: {
      type: String,
      required: [true, 'Observed conditions description is required'],
      trim: true,
      maxlength: [500, 'Observed conditions cannot exceed 500 characters'],
    },
    rainfall: {
      type: Number,
      min: [0, 'Rainfall cannot be negative'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    observedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Pending Review', 'Under Review', 'Verified', 'Resolved', 'Rejected'],
      default: 'Pending Review',
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for search and filtering
hazardReportSchema.index({ district: 1, state: 1, status: 1 });
hazardReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('HazardReport', hazardReportSchema);
