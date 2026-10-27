const mongoose = require('mongoose');
const HazardReport = require('../models/HazardReport');
const RiskRecord = require('../models/RiskRecord');
const Alert = require('../models/Alert');
const fallbackStore = require('../config/fallbackStore');

// @desc    Get consolidated dashboard metrics and charts data
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      // 1. Basic counts
      const [
        totalReports,
        pendingReports,
        verifiedReports,
        resolvedReports,
        activeAlerts,
        totalAlerts,
        totalLocations,
        distinctLocations,
        demoRecordsCount,
      ] = await Promise.all([
        HazardReport.countDocuments(),
        HazardReport.countDocuments({ status: 'Pending Review' }),
        HazardReport.countDocuments({ status: 'Verified' }),
        HazardReport.countDocuments({ status: 'Resolved' }),
        Alert.countDocuments({ status: 'Active' }),
        Alert.countDocuments(),
        RiskRecord.countDocuments(),
        RiskRecord.distinct('locationName'),
        RiskRecord.countDocuments({ dataSource: 'Demonstration data' }),
      ]);

      // 2. Report Status Distribution
      const reportStatusAggregation = await HazardReport.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]);
      const reportStatusDistribution = [
        'Pending Review',
        'Under Review',
        'Verified',
        'Resolved',
        'Rejected',
      ].map((statusName) => {
        const match = reportStatusAggregation.find((item) => item._id === statusName);
        return {
          name: statusName,
          value: match ? match.count : 0,
        };
      });

      // 3. Reports Grouped by District
      const reportsByDistrictAggregation = await HazardReport.aggregate([
        {
          $group: {
            _id: '$district',
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]);
      const reportsByDistrict = reportsByDistrictAggregation.map((item) => ({
        district: item._id || 'Unknown',
        reports: item.count,
      }));

      // 4. Risk Records Grouped by Risk Level
      const riskLevelAggregation = await RiskRecord.aggregate([
        {
          $group: {
            _id: '$riskLevel',
            count: { $sum: 1 },
          },
        },
      ]);
      const riskLevelDistribution = ['Low', 'Moderate', 'High', 'Critical'].map(
        (level) => {
          const match = riskLevelAggregation.find((item) => item._id === level);
          return {
            riskLevel: level,
            count: match ? match.count : 0,
          };
        }
      );

      // 5. Rainfall Observations Over Time
      const rainfallRecords = await RiskRecord.find()
        .sort({ recordedAt: 1 })
        .limit(15)
        .select('locationName rainfall recordedAt riskLevel district');

      const rainfallOverTime = rainfallRecords.map((rec) => ({
        date: new Date(rec.recordedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        location: rec.locationName,
        district: rec.district,
        rainfall: rec.rainfall,
        riskLevel: rec.riskLevel,
      }));

      // 6. Recent Hazard Reports
      const recentReportsRaw = await HazardReport.find()
        .sort({ createdAt: -1 })
        .limit(5);

      const recentReports = recentReportsRaw.map((rep) => ({
        _id: rep._id,
        title: rep.title,
        reporterName: rep.reporterName,
        location: rep.location,
        district: rep.district,
        state: rep.state,
        hazardType: rep.hazardType,
        status: rep.status,
        observedAt: rep.observedAt,
        createdAt: rep.createdAt,
      }));

      // 7. Recent Active Alerts
      const recentAlerts = await Alert.find({ status: 'Active' })
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(5);

      const isDemonstration = totalLocations > 0 && demoRecordsCount > 0;

      return res.status(200).json({
        success: true,
        data: {
          summary: {
            totalReports,
            pendingReports,
            verifiedReports,
            resolvedReports,
            activeAlerts,
            totalAlerts,
            totalMonitoringLocations: distinctLocations.length || totalLocations,
            totalRiskRecords: totalLocations,
            demoRecordsCount,
            isDemonstration,
          },
          charts: {
            reportStatusDistribution,
            reportsByDistrict,
            riskLevelDistribution,
            rainfallOverTime,
          },
          recentReports,
          recentAlerts,
        },
      });
    }

    // Fallback store calculation
    const reports = fallbackStore.reports;
    const risks = fallbackStore.risks;
    const alerts = fallbackStore.alerts;

    const totalReports = reports.length;
    const pendingReports = reports.filter((r) => r.status === 'Pending Review').length;
    const verifiedReports = reports.filter((r) => r.status === 'Verified').length;
    const resolvedReports = reports.filter((r) => r.status === 'Resolved').length;

    const activeAlerts = alerts.filter((a) => a.status === 'Active').length;
    const totalAlerts = alerts.length;

    const distinctLocations = [...new Set(risks.map((r) => r.locationName))];
    const totalLocations = risks.length;
    const demoRecordsCount = risks.filter((r) => r.dataSource === 'Demonstration data').length;

    // Report status distribution
    const reportStatusDistribution = [
      'Pending Review',
      'Under Review',
      'Verified',
      'Resolved',
      'Rejected',
    ].map((st) => ({
      name: st,
      value: reports.filter((r) => r.status === st).length,
    }));

    // Reports by district
    const districtCounts = {};
    reports.forEach((r) => {
      districtCounts[r.district] = (districtCounts[r.district] || 0) + 1;
    });
    const reportsByDistrict = Object.keys(districtCounts).map((dist) => ({
      district: dist,
      reports: districtCounts[dist],
    }));

    // Risk level distribution
    const riskLevelDistribution = ['Low', 'Moderate', 'High', 'Critical'].map(
      (level) => ({
        riskLevel: level,
        count: risks.filter((r) => r.riskLevel === level).length,
      })
    );

    // Rainfall over time
    const sortedRisks = [...risks].sort(
      (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    );
    const rainfallOverTime = sortedRisks.slice(-15).map((rec) => ({
      date: new Date(rec.recordedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      location: rec.locationName,
      district: rec.district,
      rainfall: rec.rainfall,
      riskLevel: rec.riskLevel,
    }));

    // Recent reports
    const recentReports = [...reports]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((rep) => ({
        _id: rep._id,
        title: rep.title,
        reporterName: rep.reporterName,
        location: rep.location,
        district: rep.district,
        state: rep.state,
        hazardType: rep.hazardType,
        status: rep.status,
        observedAt: rep.observedAt,
        createdAt: rep.createdAt,
      }));

    // Recent alerts
    const recentAlerts = [...alerts]
      .filter((a) => a.status === 'Active')
      .sort(
        (a, b) =>
          new Date(b.publishedAt || b.createdAt).getTime() -
          new Date(a.publishedAt || a.createdAt).getTime()
      )
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalReports,
          pendingReports,
          verifiedReports,
          resolvedReports,
          activeAlerts,
          totalAlerts,
          totalMonitoringLocations: distinctLocations.length || totalLocations,
          totalRiskRecords: totalLocations,
          demoRecordsCount,
          isDemonstration: true,
        },
        charts: {
          reportStatusDistribution,
          reportsByDistrict,
          riskLevelDistribution,
          rainfallOverTime,
        },
        recentReports,
        recentAlerts,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
