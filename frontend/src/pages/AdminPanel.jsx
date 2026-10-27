import React, { useEffect, useState } from 'react';
import {
  Shield,
  FileCheck2,
  Activity,
  AlertTriangle,
  LayoutDashboard,
  CheckCircle,
  Clock,
  Trash2,
  Edit,
  Eye,
  Plus,
  Search,
  Filter,
  RefreshCw,
  GitBranch,
  ExternalLink,
  User,
  Mail,
  MapPin,
  Calendar,
  CloudRain,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import reportService from '../services/reportService';
import riskService from '../services/riskService';
import alertService from '../services/alertService';
import RiskBadge from '../components/RiskBadge';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const AdminPanel = () => {
  const { admin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('reports'); // 'overview' | 'reports' | 'monitoring' | 'alerts' | 'aabhas'

  // Summary Metrics
  const [stats, setStats] = useState(null);
  const [aabhasStatus, setAabhasStatus] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Hazard Reports State
  const [reports, setReports] = useState([]);
  const [reportFilter, setReportFilter] = useState('All');
  const [reportSearch, setReportSearch] = useState('');
  const [loadingReports, setLoadingReports] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [statusUpdateVal, setStatusUpdateVal] = useState('Pending Review');
  const [adminNotesVal, setAdminNotesVal] = useState('');
  const [isDeleteReportOpen, setIsDeleteReportOpen] = useState(false);

  // Alerts State
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const [alertSearch, setAlertSearch] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isAlertEditMode, setIsAlertEditMode] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [alertFormData, setAlertFormData] = useState({
    title: '',
    description: '',
    state: '',
    district: '',
    location: '',
    riskLevel: 'High',
    recommendedPrecautions: '',
    status: 'Active',
  });

  // Risk Records State
  const [riskRecords, setRiskRecords] = useState([]);
  const [loadingRisks, setLoadingRisks] = useState(false);
  const [riskSearch, setRiskSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isRiskEditMode, setIsRiskEditMode] = useState(false);
  const [isDeleteRiskOpen, setIsDeleteRiskOpen] = useState(false);
  const [riskFormData, setRiskFormData] = useState({
    locationName: '',
    state: '',
    district: '',
    latitude: '',
    longitude: '',
    rainfall: '',
    riskLevel: 'Moderate',
    monitoringStatus: 'Active',
    remarks: '',
    dataSource: 'Manual entry',
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);

  // Load Overview Data & AABHAS Status
  const loadOverview = async () => {
    try {
      setLoadingStats(true);
      const [dashRes, aabhasRes] = await Promise.all([
        dashboardService.getDashboardStats().catch(() => null),
        dashboardService.getAabhasStatus().catch(() => null),
      ]);
      if (dashRes?.success) setStats(dashRes.data.summary);
      if (aabhasRes?.success) setAabhasStatus(aabhasRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Load Reports
  const loadReports = async () => {
    try {
      setLoadingReports(true);
      const res = await reportService.getReports({
        status: reportFilter,
        search: reportSearch,
        limit: 50,
      });
      if (res.success) setReports(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReports(false);
    }
  };

  // Load Alerts
  const loadAlerts = async () => {
    try {
      setLoadingAlerts(true);
      const res = await alertService.getAlerts({
        search: alertSearch,
        status: 'All', // Admin sees Drafts, Active, Resolved
        limit: 50,
      });
      if (res.success) setAlerts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAlerts(false);
    }
  };

  // Load Risk Records
  const loadRiskRecords = async () => {
    try {
      setLoadingRisks(true);
      const res = await riskService.getRiskRecords({
        search: riskSearch,
        limit: 50,
      });
      if (res.success) setRiskRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRisks(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  useEffect(() => {
    if (activeTab === 'reports') loadReports();
    if (activeTab === 'alerts') loadAlerts();
    if (activeTab === 'monitoring') loadRiskRecords();
    if (activeTab === 'aabhas') loadOverview();
  }, [activeTab, reportFilter, reportSearch, alertSearch, riskSearch]);

  // Handle Report Review Modal Open
  const handleOpenReportReview = (rep) => {
    setSelectedReport(rep);
    setStatusUpdateVal(rep.status || 'Pending Review');
    setAdminNotesVal(rep.adminNotes || '');
    setIsReportModalOpen(true);
  };

  // Save Report Status Update
  const handleSaveReportStatus = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    try {
      setActionLoading(true);
      await reportService.updateReport(selectedReport._id, {
        status: statusUpdateVal,
        adminNotes: adminNotesVal,
      });
      setIsReportModalOpen(false);
      loadReports();
      loadOverview();
      setActionMsg('Hazard report status updated successfully.');
      setTimeout(() => setActionMsg(null), 3500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update report.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Report
  const handleDeleteReportConfirm = async () => {
    if (!selectedReport) return;
    try {
      setActionLoading(true);
      await reportService.deleteReport(selectedReport._id);
      setIsDeleteReportOpen(false);
      setSelectedReport(null);
      loadReports();
      loadOverview();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report.');
    } finally {
      setActionLoading(false);
    }
  };

  // Alert Actions
  const handleOpenCreateAlert = () => {
    setAlertFormData({
      title: '',
      description: '',
      state: '',
      district: '',
      location: '',
      riskLevel: 'Moderate',
      recommendedPrecautions: '',
      status: 'Active',
    });
    setIsAlertEditMode(false);
    setIsAlertModalOpen(true);
  };

  const handleOpenEditAlert = (alt) => {
    setSelectedAlert(alt);
    setAlertFormData({
      title: alt.title,
      description: alt.description,
      state: alt.state,
      district: alt.district,
      location: alt.location,
      riskLevel: alt.riskLevel,
      recommendedPrecautions: Array.isArray(alt.recommendedPrecautions)
        ? alt.recommendedPrecautions.join('\n')
        : alt.recommendedPrecautions || '',
      status: alt.status,
    });
    setIsAlertEditMode(true);
    setIsAlertModalOpen(true);
  };

  const handleSaveAlert = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      if (isAlertEditMode && selectedAlert) {
        await alertService.updateAlert(selectedAlert._id, alertFormData);
      } else {
        await alertService.createAlert(alertFormData);
      }
      setIsAlertModalOpen(false);
      loadAlerts();
      loadOverview();
      setActionMsg('Advisory saved successfully.');
      setTimeout(() => setActionMsg(null), 3500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save alert.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAlertConfirm = async () => {
    if (!selectedAlert) return;
    try {
      setActionLoading(true);
      await alertService.deleteAlert(selectedAlert._id);
      setIsDeleteAlertOpen(false);
      setSelectedAlert(null);
      loadAlerts();
      loadOverview();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete alert.');
    } finally {
      setActionLoading(false);
    }
  };

  // Risk Records Actions
  const handleOpenCreateRisk = () => {
    setRiskFormData({
      locationName: '',
      state: '',
      district: '',
      latitude: '',
      longitude: '',
      rainfall: '',
      riskLevel: 'Moderate',
      monitoringStatus: 'Active',
      remarks: '',
      dataSource: 'Manual entry',
    });
    setIsRiskEditMode(false);
    setIsRiskModalOpen(true);
  };

  const handleOpenEditRisk = (rec) => {
    setSelectedRisk(rec);
    setRiskFormData({
      locationName: rec.locationName,
      state: rec.state,
      district: rec.district,
      latitude: rec.latitude !== undefined ? rec.latitude : '',
      longitude: rec.longitude !== undefined ? rec.longitude : '',
      rainfall: rec.rainfall,
      riskLevel: rec.riskLevel,
      monitoringStatus: rec.monitoringStatus,
      remarks: rec.remarks || '',
      dataSource: rec.dataSource || 'Manual entry',
    });
    setIsRiskEditMode(true);
    setIsRiskModalOpen(true);
  };

  const handleSaveRisk = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      if (isRiskEditMode && selectedRisk) {
        await riskService.updateRiskRecord(selectedRisk._id, riskFormData);
      } else {
        await riskService.createRiskRecord(riskFormData);
      }
      setIsRiskModalOpen(false);
      loadRiskRecords();
      loadOverview();
      setActionMsg('Monitoring record saved successfully.');
      setTimeout(() => setActionMsg(null), 3500);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save record.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRiskConfirm = async () => {
    if (!selectedRisk) return;
    try {
      setActionLoading(true);
      await riskService.deleteRiskRecord(selectedRisk._id);
      setIsDeleteRiskOpen(false);
      setSelectedRisk(null);
      loadRiskRecords();
      loadOverview();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete record.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
              <Shield size={24} color="var(--color-primary-dark)" />
              <h1 style={{ fontSize: '2.1rem', color: 'var(--color-primary-dark)' }}>
                Administrator Command Panel
              </h1>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Authenticated as <strong>{admin?.name}</strong> ({admin?.email}) &bull; Role: <code>{admin?.role}</code>
            </p>
          </div>

          <button onClick={logout} className="btn btn-outline btn-sm">
            Log Out
          </button>
        </div>

        {/* Action Success Toast */}
        {actionMsg && (
          <div
            className="animate-fade-in"
            style={{
              background: '#DEF7EC',
              border: '1px solid #31C48D',
              color: '#03543F',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle size={18} />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Tab Navigation Navigation Bar */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '2px solid var(--color-border)',
            marginBottom: '2rem',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'reports', label: 'Hazard Reports (Review)', icon: FileCheck2 },
            { id: 'monitoring', label: 'Monitoring Records (CRUD)', icon: Activity },
            { id: 'alerts', label: 'Warning Advisories (CRUD)', icon: AlertTriangle },
            { id: 'aabhas', label: 'AABHAS AI Model Config', icon: GitBranch },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.925rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                  borderBottom: isActive ? '3px solid var(--color-primary-dark)' : '3px solid transparent',
                  marginBottom: '-2px',
                  background: 'none',
                  borderTop: 'none',
                  borderLeft: 'none',
                  borderRight: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            TAB 1: HAZARD REPORTS MANAGEMENT (REVIEW, VERIFY, RESOLVE, REJECT)
            ========================================================================= */}
        {activeTab === 'reports' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
                  Submitted Hazard Reports
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Review public and field submissions. Change status to prevent false alarms or confirm threats.
                </span>
              </div>

              {/* Status Filter */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Filter:</span>
                <select
                  value={reportFilter}
                  onChange={(e) => setReportFilter(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto' }}
                >
                  <option value="All">All Reports</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Verified">Verified</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </select>

                <button onClick={loadReports} className="btn btn-secondary btn-sm" title="Refresh">
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {loadingReports ? (
              <LoadingSpinner message="Loading submitted hazard reports..." />
            ) : reports.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <FileCheck2 size={40} color="var(--color-mountain)" style={{ marginBottom: '0.75rem' }} />
                <h3>No Hazard Reports Found</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  No reports match the selected status filter.
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title & Location</th>
                      <th>Reporter Contact</th>
                      <th>Category</th>
                      <th>Observed Date</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((rep) => (
                      <tr key={rep._id}>
                        <td>
                          <strong style={{ color: 'var(--color-primary-dark)', display: 'block' }}>
                            {rep.title}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {rep.location}, {rep.district} ({rep.state})
                          </span>
                        </td>
                        <td>
                          <span style={{ display: 'block', fontWeight: 600, color: 'var(--color-charcoal)' }}>
                            {rep.reporterName}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-mountain)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <Mail size={12} />
                            {rep.reporterEmail || 'Confidential'}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.825rem' }}>{rep.hazardType}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                            {new Date(rep.observedAt || rep.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${rep.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {rep.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleOpenReportReview(rep)}
                              className="btn btn-primary btn-sm"
                              style={{ padding: '0.35rem 0.65rem' }}
                            >
                              Review &amp; Status
                            </button>
                            <button
                              onClick={() => {
                                setSelectedReport(rep);
                                setIsDeleteReportOpen(true);
                              }}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.35rem 0.55rem' }}
                              title="Delete Report"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: RISK RECORDS MANAGEMENT (CRUD)
            ========================================================================= */}
        {activeTab === 'monitoring' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
                  Risk Monitoring Stations &amp; Observations
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Manage geotechnical observations, rainfall telemetry, and slope assessments.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleOpenCreateRisk} className="btn btn-primary">
                  <Plus size={16} />
                  <span>Add New Record</span>
                </button>
                <button onClick={loadRiskRecords} className="btn btn-secondary" title="Refresh">
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>

            {loadingRisks ? (
              <LoadingSpinner message="Loading monitoring records..." />
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Location</th>
                      <th>District</th>
                      <th>Rainfall</th>
                      <th>Risk Level</th>
                      <th>Status</th>
                      <th>Data Source</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {riskRecords.map((rec) => (
                      <tr key={rec._id}>
                        <td>
                          <strong>{rec.locationName}</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>
                            {rec.state}
                          </span>
                        </td>
                        <td>{rec.district}</td>
                        <td>
                          <span style={{ fontWeight: 700, color: 'var(--color-mountain)' }}>
                            {rec.rainfall} mm
                          </span>
                        </td>
                        <td>
                          <RiskBadge level={rec.riskLevel} />
                        </td>
                        <td>
                          <span className={`status-badge status-${rec.monitoringStatus?.toLowerCase()}`}>
                            {rec.monitoringStatus}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {rec.dataSource}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleOpenEditRisk(rec)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.35rem 0.55rem' }}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRisk(rec);
                                setIsDeleteRiskOpen(true);
                              }}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.35rem 0.55rem' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: ALERTS MANAGEMENT (CRUD)
            ========================================================================= */}
        {activeTab === 'alerts' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)' }}>
                  Early Warning Alerts Management
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                  Create, activate, edit, or archive official early warning notices.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handleOpenCreateAlert} className="btn btn-primary">
                  <Plus size={16} />
                  <span>Draft New Alert</span>
                </button>
                <button onClick={loadAlerts} className="btn btn-secondary" title="Refresh">
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>

            {loadingAlerts ? (
              <LoadingSpinner message="Loading alerts..." />
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title & Location</th>
                      <th>Risk Level</th>
                      <th>Status</th>
                      <th>Issued By</th>
                      <th>Published Date</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alerts.map((alt) => (
                      <tr key={alt._id}>
                        <td>
                          <strong>{alt.title}</strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>
                            {alt.location}, {alt.district} ({alt.state})
                          </span>
                        </td>
                        <td>
                          <RiskBadge level={alt.riskLevel} />
                        </td>
                        <td>
                          <span className={`status-badge status-${alt.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {alt.status}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.825rem' }}>{alt.issuedBy}</span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {alt.publishedAt ? new Date(alt.publishedAt).toLocaleDateString() : 'Unpublished (Draft)'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleOpenEditAlert(alt)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.35rem 0.55rem' }}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedAlert(alt);
                                setIsDeleteAlertOpen(true);
                              }}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.35rem 0.55rem' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: AABHAS MODEL CONFIGURATION & INTEGRATION ARCHITECTURE
            ========================================================================= */}
        {activeTab === 'aabhas' && (
          <div>
            <div className="card" style={{ padding: '2.5rem', maxWidth: '820px', margin: '0 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <GitBranch size={28} color="var(--color-mountain)" />
                <div>
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--color-primary-dark)' }}>
                    AABHAS AI/ML Model Connection Interface
                  </h2>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Geotechnical Susceptibility Prediction System
                  </span>
                </div>
              </div>

              {/* Status Box */}
              <div
                style={{
                  background: aabhasStatus?.connected ? '#DEF7EC' : '#FFFBEB',
                  border: `1.5px solid ${aabhasStatus?.connected ? '#31C48D' : '#FCD34D'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  marginBottom: '1.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: aabhasStatus?.connected ? '#03543F' : '#92400E', fontSize: '0.95rem' }}>
                    Current Integration Status: {aabhasStatus?.status || 'DESIGN_MODE'}
                  </strong>
                  <span style={{ fontSize: '0.78rem', background: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid #E5E7EB' }}>
                    {aabhasStatus?.connected ? 'Online' : 'Unconnected (Manual Mode)'}
                  </span>
                </div>
                <p style={{ fontSize: '0.875rem', color: aabhasStatus?.connected ? '#046C4E' : '#78350F', margin: 0, lineHeight: 1.5 }}>
                  {aabhasStatus?.message ||
                    'AABHAS model endpoint is currently operating in manual assessment mode. No external inference server is attached.'}
                </p>
              </div>

              {/* Architecture Explanation */}
              <div style={{ marginBottom: '2rem', lineHeight: 1.6, fontSize: '0.925rem', color: 'var(--color-charcoal)' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                  Architectural Separation: AABHAS vs AARVIK
                </h3>
                <p style={{ marginBottom: '1rem' }}>
                  A key requirement of this system is maintaining architectural modularity:
                </p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>
                    <strong>AABHAS (Artificial AI-Based Hazard Assessment System):</strong> Responsible for computational AI/ML modeling, training on geological strata, slope angle, and digital elevation models (DEM) to predict susceptibility coefficients.
                  </li>
                  <li>
                    <strong>AARVIK (This Platform):</strong> The user-facing web platform managing real-time reporting, administrative alert workflows, temporal rainfall tracking, and disaster communication.
                  </li>
                </ul>
              </div>

              {/* Future Integration Code Sample */}
              <div style={{ background: '#1E293B', color: '#E2E8F0', padding: '1.25rem', borderRadius: 'var(--radius-md)', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '1.5rem', overflowX: 'auto' }}>
                <div style={{ color: '#94A3B8', marginBottom: '0.5rem' }}>// backend/services/aabhasService.js Interface Specification</div>
                <div>{`const prediction = await aabhasService.requestPrediction({`}</div>
                <div style={{ paddingLeft: '1rem' }}>{`latitude: 30.5564,`}</div>
                <div style={{ paddingLeft: '1rem' }}>{`longitude: 79.5638,`}</div>
                <div style={{ paddingLeft: '1rem' }}>{`rainfall24h: 142.5, // mm`}</div>
                <div style={{ paddingLeft: '1rem' }}>{`slopeAngle: 42.0   // degrees`}</div>
                <div>{`});`}</div>
                <div style={{ color: '#38BDF8', marginTop: '0.5rem' }}>{`// Returns: { predictedRiskLevel: 'Critical', susceptibilityIndex: 0.89 }`}</div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                To connect the real AABHAS API later, configure <code>AABHAS_API_URL</code> and <code>AABHAS_API_KEY</code> in <code>backend/.env</code>.
              </div>
            </div>
          </div>
        )}

        {/* Modal: Review & Change Hazard Report Status */}
        <Modal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          title="Review Hazard Report"
          maxWidth="680px"
        >
          {selectedReport && (
            <form onSubmit={handleSaveReportStatus}>
              <div style={{ background: '#F8FAF7', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)', marginBottom: '0.25rem' }}>
                  {selectedReport.title}
                </h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-mountain)', marginBottom: '0.5rem' }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '3px' }} />
                  {selectedReport.location}, {selectedReport.district} ({selectedReport.state})
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-charcoal)', lineHeight: 1.5, margin: 0 }}>
                  <strong>Description:</strong> {selectedReport.description}
                </p>
                <div style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                  <strong>Observed Conditions:</strong> {selectedReport.observedConditions}
                </div>
              </div>

              {/* Private Reporter Information (Shown only to authenticated admin) */}
              <div style={{ background: '#EEF2F6', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary-dark)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  Reporter Confidential Details (Admin Only View)
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <div>Name: <strong>{selectedReport.reporterName}</strong></div>
                  <div>Email: <strong>{selectedReport.reporterEmail}</strong></div>
                  <div>Rainfall: <strong>{selectedReport.rainfall !== undefined ? `${selectedReport.rainfall} mm` : 'Not provided'}</strong></div>
                  <div>Observed: <strong>{new Date(selectedReport.observedAt).toLocaleString()}</strong></div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Update Official Status <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={statusUpdateVal}
                  onChange={(e) => setStatusUpdateVal(e.target.value)}
                >
                  <option value="Pending Review">Pending Review (Under investigation)</option>
                  <option value="Under Review">Under Review (Inspection dispatched)</option>
                  <option value="Verified">Verified (Confirmed geotechnical hazard)</option>
                  <option value="Resolved">Resolved (Mitigated or road cleared)</option>
                  <option value="Rejected">Rejected (False alarm or non-hazard)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Administrator Inspection Notes</label>
                <textarea
                  rows="3"
                  className="form-textarea"
                  placeholder="e.g. Dispatched PWD road safety unit; crack is stable, barricades placed..."
                  value={adminNotesVal}
                  onChange={(e) => setAdminNotesVal(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="btn btn-secondary"
                  disabled={actionLoading}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                  {actionLoading ? 'Updating Status...' : 'Save Status Update'}
                </button>
              </div>
            </form>
          )}
        </Modal>

        {/* Modal: Create/Edit Risk Record */}
        <Modal
          isOpen={isRiskModalOpen}
          onClose={() => setIsRiskModalOpen(false)}
          title={isRiskEditMode ? 'Edit Risk Record' : 'Create New Risk Record'}
        >
          <form onSubmit={handleSaveRisk}>
            <div className="form-group">
              <label className="form-label">Location Name *</label>
              <input
                type="text"
                className="form-input"
                value={riskFormData.locationName}
                onChange={(e) => setRiskFormData({ ...riskFormData, locationName: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  className="form-input"
                  value={riskFormData.state}
                  onChange={(e) => setRiskFormData({ ...riskFormData, state: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">District *</label>
                <input
                  type="text"
                  className="form-input"
                  value={riskFormData.district}
                  onChange={(e) => setRiskFormData({ ...riskFormData, district: e.target.value })}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Rainfall (mm) *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="form-input"
                  value={riskFormData.rainfall}
                  onChange={(e) => setRiskFormData({ ...riskFormData, rainfall: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Risk Level</label>
                <select
                  className="form-select"
                  value={riskFormData.riskLevel}
                  onChange={(e) => setRiskFormData({ ...riskFormData, riskLevel: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={riskFormData.monitoringStatus}
                  onChange={(e) => setRiskFormData({ ...riskFormData, monitoringStatus: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Remarks</label>
              <textarea
                rows="3"
                className="form-textarea"
                value={riskFormData.remarks}
                onChange={(e) => setRiskFormData({ ...riskFormData, remarks: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setIsRiskModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                {actionLoading ? 'Saving...' : 'Save Record'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Modal: Create/Edit Alert */}
        <Modal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          title={isAlertEditMode ? 'Edit Warning Alert' : 'Create Warning Alert'}
          maxWidth="700px"
        >
          <form onSubmit={handleSaveAlert}>
            <div className="form-group">
              <label className="form-label">Alert Title *</label>
              <input
                type="text"
                className="form-input"
                value={alertFormData.title}
                onChange={(e) => setAlertFormData({ ...alertFormData, title: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">State *</label>
                <input
                  type="text"
                  className="form-input"
                  value={alertFormData.state}
                  onChange={(e) => setAlertFormData({ ...alertFormData, state: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">District *</label>
                <input
                  type="text"
                  className="form-input"
                  value={alertFormData.district}
                  onChange={(e) => setAlertFormData({ ...alertFormData, district: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Specific Location *</label>
              <input
                type="text"
                className="form-input"
                value={alertFormData.location}
                onChange={(e) => setAlertFormData({ ...alertFormData, location: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Risk Level</label>
                <select
                  className="form-select"
                  value={alertFormData.riskLevel}
                  onChange={(e) => setAlertFormData({ ...alertFormData, riskLevel: e.target.value })}
                >
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Alert Status</label>
                <select
                  className="form-select"
                  value={alertFormData.status}
                  onChange={(e) => setAlertFormData({ ...alertFormData, status: e.target.value })}
                >
                  <option value="Active">Active (Published)</option>
                  <option value="Draft">Draft</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Alert Description *</label>
              <textarea
                rows="4"
                className="form-textarea"
                value={alertFormData.description}
                onChange={(e) => setAlertFormData({ ...alertFormData, description: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Recommended Precautions (One per line)</label>
              <textarea
                rows="3"
                className="form-textarea"
                value={alertFormData.recommendedPrecautions}
                onChange={(e) => setAlertFormData({ ...alertFormData, recommendedPrecautions: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={() => setIsAlertModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={actionLoading}>
                {actionLoading ? 'Saving...' : 'Save Alert'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmations */}
        <ConfirmDialog
          isOpen={isDeleteReportOpen}
          onClose={() => setIsDeleteReportOpen(false)}
          onConfirm={handleDeleteReportConfirm}
          title="Delete Hazard Report"
          message={`Are you sure you want to delete report "${selectedReport?.title}"?`}
          isLoading={actionLoading}
        />

        <ConfirmDialog
          isOpen={isDeleteRiskOpen}
          onClose={() => setIsDeleteRiskOpen(false)}
          onConfirm={handleDeleteRiskConfirm}
          title="Delete Risk Record"
          message={`Are you sure you want to delete record "${selectedRisk?.locationName}"?`}
          isLoading={actionLoading}
        />

        <ConfirmDialog
          isOpen={isDeleteAlertOpen}
          onClose={() => setIsDeleteAlertOpen(false)}
          onConfirm={handleDeleteAlertConfirm}
          title="Delete Alert"
          message={`Are you sure you want to delete alert "${selectedAlert?.title}"?`}
          isLoading={actionLoading}
        />
      </div>
    </div>
  );
};

export default AdminPanel;
