import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BellRing,
  Search,
  Filter,
  Plus,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Info,
  CheckCircle2,
} from 'lucide-react';
import alertService from '../services/alertService';
import AlertCard from '../components/AlertCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

const Alerts = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlerts, setTotalAlerts] = useState(0);

  // Admin Modals
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    title: '',
    description: '',
    state: '',
    district: '',
    location: '',
    riskLevel: 'Moderate',
    recommendedPrecautions: '',
    status: 'Active',
    expiresAt: '',
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await alertService.getAlerts({
        search,
        riskLevel,
        status,
        page,
        limit: 9,
      });

      if (res.success) {
        setAlerts(res.data);
        setTotalPages(res.pages);
        setTotalAlerts(res.total);
      }
    } catch (err) {
      setError('Could not retrieve early warning advisories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [search, riskLevel, status, page]);

  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setIsEditMode(false);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (alertItem) => {
    setFormData({
      title: alertItem.title || '',
      description: alertItem.description || '',
      state: alertItem.state || '',
      district: alertItem.district || '',
      location: alertItem.location || '',
      riskLevel: alertItem.riskLevel || 'Moderate',
      recommendedPrecautions: Array.isArray(alertItem.recommendedPrecautions)
        ? alertItem.recommendedPrecautions.join('\n')
        : alertItem.recommendedPrecautions || '',
      status: alertItem.status || 'Active',
      expiresAt: alertItem.expiresAt ? alertItem.expiresAt.slice(0, 16) : '',
    });
    setSelectedAlert(alertItem);
    setIsEditMode(true);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (alertItem) => {
    setSelectedAlert(alertItem);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAlert) return;
    try {
      setSubmitting(true);
      await alertService.deleteAlert(selectedAlert._id);
      setIsDeleteDialogOpen(false);
      setSelectedAlert(null);
      fetchAlerts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete alert.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.state.trim() ||
      !formData.district.trim() ||
      !formData.location.trim()
    ) {
      setFormError('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditMode && selectedAlert) {
        await alertService.updateAlert(selectedAlert._id, formData);
      } else {
        await alertService.createAlert(formData);
      }
      setIsFormModalOpen(false);
      fetchAlerts();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving alert.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)' }}>
                Early Warning Advisories &amp; Alerts
              </h1>
              <span
                style={{
                  background: 'var(--risk-critical-bg)',
                  color: 'var(--risk-critical)',
                  border: '1px solid var(--risk-critical-border)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {totalAlerts} Advisories
              </span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Official administrative advisories issued to guide public transit and vulnerable hill settlements.
            </p>
          </div>

          <div>
            {isAuthenticated ? (
              <button onClick={handleOpenCreate} className="btn btn-primary">
                <Plus size={16} />
                <span>Publish New Alert</span>
              </button>
            ) : (
              <div
                style={{
                  background: '#F1F5F2',
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Info size={15} color="var(--color-mountain)" />
                <span>Authorized administrators can create official alerts</span>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="disclaimer-box" style={{ marginBottom: '1.5rem' }}>
          <strong>Academic Demonstration Mode:</strong> All advisories displayed here are simulated early warnings for testing emergency communication workflows. Never treat demonstration alerts as real-world civil emergency evacuation orders.
        </div>

        {/* Search & Filter Toolbar */}
        <div
          className="card"
          style={{
            marginBottom: '1.5rem',
            padding: '1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search alerts by title, location, description..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Risk:</span>
            <select
              value={riskLevel}
              onChange={(e) => {
                setRiskLevel(e.target.value);
                setPage(1);
              }}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>Status:</span>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Resolved">Resolved</option>
              <option value="Expired">Expired</option>
              {isAuthenticated && <option value="Draft">Draft</option>}
            </select>
          </div>

          {(search || riskLevel !== 'All' || status !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setRiskLevel('All');
                setStatus('All');
                setPage(1);
              }}
              className="btn btn-secondary btn-sm"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Content List */}
        {loading ? (
          <LoadingSpinner message="Retrieving hazard advisories..." />
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <AlertTriangle size={40} color="var(--risk-critical)" style={{ marginBottom: '1rem' }} />
            <p style={{ color: 'var(--color-charcoal)', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchAlerts} className="btn btn-primary">
              <RefreshCw size={15} /> Retry
            </button>
          </div>
        ) : alerts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <ShieldAlert size={40} color="var(--color-mountain)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              No Advisories Matching Selection
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
              {search || riskLevel !== 'All' || status !== 'All'
                ? 'No alerts match your current filter parameters.'
                : 'There are currently no alerts in the system.'}
            </p>
            {isAuthenticated && (
              <button onClick={handleOpenCreate} className="btn btn-primary">
                <Plus size={16} /> Publish First Alert
              </button>
            )}
          </div>
        ) : (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {alerts.map((item) => (
                <AlertCard
                  key={item._id}
                  alert={item}
                  isAdmin={isAuthenticated}
                  onSelect={(alertItem) => navigate(`/alerts/${alertItem._id}`)}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '2rem',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                <div>
                  Page {page} of {totalPages} ({totalAlerts} advisories)
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="btn btn-secondary btn-sm"
                  >
                    Previous
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="btn btn-secondary btn-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Create / Edit Alert Modal (Admin Protected) */}
        <Modal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          title={isEditMode ? 'Edit Warning Advisory' : 'Create New Early Warning Alert'}
          maxWidth="700px"
        >
          <form onSubmit={handleFormSubmit}>
            {formError && (
              <div style={{ background: 'var(--risk-critical-bg)', color: 'var(--risk-critical)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {formError}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Alert Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. CRITICAL HAZARD ADVISORY: Alaknanda Basin Slope Failure"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  State <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Uttarakhand"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  District <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Chamoli"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Specific Location / Corridor <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Joshimath-Helang Sector and Pipalkoti Gorge"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Risk Severity Level</label>
                <select
                  className="form-select"
                  value={formData.riskLevel}
                  onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
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
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Active">Active (Published)</option>
                  <option value="Draft">Draft (Unpublished)</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Detailed Alert Description <span className="required">*</span>
              </label>
              <textarea
                rows="4"
                className="form-textarea"
                placeholder="Describe current terrain vulnerability, rainfall triggers, affected road segments, and anticipated risks..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Recommended Precautions (One per line)</label>
              <textarea
                rows="4"
                className="form-textarea"
                placeholder="Halt non-emergency transit after dark&#10;Residents near toe slopes relocate to shelter&#10;Monitor local warning broadcasts"
                value={formData.recommendedPrecautions}
                onChange={(e) => setFormData({ ...formData, recommendedPrecautions: e.target.value })}
              />
              <div className="form-help">Enter each safety instruction on a separate line.</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="btn btn-secondary"
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving...' : isEditMode ? 'Update Alert' : 'Publish Alert'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Alert"
          message={`Are you sure you want to permanently delete the alert "${selectedAlert?.title}"?`}
          isLoading={submitting}
        />
      </div>
    </div>
  );
};

export default Alerts;
