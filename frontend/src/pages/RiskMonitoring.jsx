import React, { useEffect, useState } from 'react';
import {
  Activity,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  CloudRain,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle2,
  Database,
  ArrowUpDown,
} from 'lucide-react';
import riskService from '../services/riskService';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

const RiskMonitoring = () => {
  const { isAuthenticated } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Pagination States
  const [search, setSearch] = useState('');
  const [riskLevel, setRiskLevel] = useState('All');
  const [district, setDistrict] = useState('All');
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Modals & Active Record
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    locationName: '',
    state: '',
    district: '',
    latitude: '',
    longitude: '',
    rainfall: '',
    riskLevel: 'Low',
    monitoringStatus: 'Active',
    remarks: '',
    dataSource: 'Manual entry',
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await riskService.getRiskRecords({
        search,
        riskLevel,
        district,
        page,
        limit: 10,
        sortBy: 'recordedAt',
        order: 'desc',
      });

      if (res.success) {
        setRecords(res.data);
        setTotalPages(res.pages);
        setTotalRecords(res.total);
        if (res.availableDistricts) {
          setAvailableDistricts(res.availableDistricts);
        }
      }
    } catch (err) {
      setError('Could not retrieve risk monitoring records from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [search, riskLevel, district, page]);

  const handleOpenCreate = () => {
    setFormData(initialFormState);
    setIsEditMode(false);
    setFormError(null);
    setFormSuccess(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (record) => {
    setFormData({
      locationName: record.locationName || '',
      state: record.state || '',
      district: record.district || '',
      latitude: record.latitude !== undefined ? record.latitude : '',
      longitude: record.longitude !== undefined ? record.longitude : '',
      rainfall: record.rainfall !== undefined ? record.rainfall : '',
      riskLevel: record.riskLevel || 'Low',
      monitoringStatus: record.monitoringStatus || 'Active',
      remarks: record.remarks || '',
      dataSource: record.dataSource || 'Manual entry',
    });
    setSelectedRecord(record);
    setIsEditMode(true);
    setFormError(null);
    setFormSuccess(null);
    setIsFormModalOpen(true);
  };

  const handleOpenDetail = (record) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleOpenDelete = (record) => {
    setSelectedRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRecord) return;
    try {
      setSubmitting(true);
      await riskService.deleteRiskRecord(selectedRecord._id);
      setIsDeleteDialogOpen(false);
      setSelectedRecord(null);
      fetchRecords();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!formData.locationName || !formData.state || !formData.district || formData.rainfall === '') {
      setFormError('Please fill out all required fields (Location, State, District, and Rainfall).');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditMode && selectedRecord) {
        await riskService.updateRiskRecord(selectedRecord._id, formData);
        setFormSuccess('Monitoring record updated successfully.');
      } else {
        await riskService.createRiskRecord(formData);
        setFormSuccess('New monitoring record added successfully.');
      }
      setTimeout(() => {
        setIsFormModalOpen(false);
        fetchRecords();
      }, 700);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving monitoring record.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header & Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)' }}>
                Landslide Risk Monitoring
              </h1>
              <span
                style={{
                  background: 'var(--color-sage-light)',
                  color: 'var(--color-primary-dark)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {totalRecords} Records
              </span>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Systematic geotechnical records of hillside rainfall, observed stability, and manual field assessments.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {isAuthenticated ? (
              <button onClick={handleOpenCreate} className="btn btn-primary">
                <Plus size={16} />
                <span>Add Monitoring Record</span>
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
                <span>Log in as Administrator to add/edit records</span>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer / Model Relation Box */}
        <div className="disclaimer-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <strong>Geotechnical Assessment Notice:</strong> Risk levels shown here reflect manually entered observations and demonstration datasets. Rainfall is one factor among many; numerical precipitation alone does not represent verified automated predictions until the AABHAS AI model is connected.
          </div>
        </div>

        {/* Filters and Search Bar */}
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
          {/* Search Input */}
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
            />
            <input
              type="text"
              placeholder="Search by location, district, remarks..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Filter: Risk Level */}
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

          {/* Filter: District */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>District:</span>
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setPage(1);
              }}
              className="form-select"
              style={{ width: 'auto' }}
            >
              <option value="All">All Districts</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(search || riskLevel !== 'All' || district !== 'All') && (
            <button
              onClick={() => {
                setSearch('');
                setRiskLevel('All');
                setDistrict('All');
                setPage(1);
              }}
              className="btn btn-secondary btn-sm"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Data Table */}
        {loading ? (
          <LoadingSpinner message="Loading monitoring records..." />
        ) : error ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <AlertTriangle size={40} color="var(--risk-critical)" style={{ marginBottom: '1rem' }} />
            <p style={{ color: 'var(--color-charcoal)', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchRecords} className="btn btn-primary">
              <RefreshCw size={15} /> Retry
            </button>
          </div>
        ) : records.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <Activity size={40} color="var(--color-mountain)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
              No Monitoring Records Found
            </h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
              {search || riskLevel !== 'All' || district !== 'All'
                ? 'No records match your selected search or filter criteria.'
                : 'No monitoring records exist in the database. Run the backend seed script or add one manually.'}
            </p>
            {isAuthenticated && (
              <button onClick={handleOpenCreate} className="btn btn-primary">
                <Plus size={16} /> Add First Record
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Location</th>
                    <th>District</th>
                    <th>Rainfall</th>
                    <th>Risk Level</th>
                    <th>Last Updated</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec._id}>
                      <td>
                        <strong style={{ color: 'var(--color-primary-dark)', display: 'block' }}>
                          {rec.locationName}
                        </strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {rec.state} {rec.latitude ? `(${rec.latitude.toFixed(2)}°, ${rec.longitude?.toFixed(2)}°)` : ''}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--color-charcoal)' }}>
                          {rec.district}
                        </span>
                      </td>

                      <td>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: rec.rainfall > 100 ? 'var(--risk-critical)' : 'var(--color-mountain)' }}>
                          <CloudRain size={15} />
                          {rec.rainfall} mm
                        </span>
                      </td>

                      <td>
                        <RiskBadge level={rec.riskLevel} />
                      </td>

                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {new Date(rec.recordedAt || rec.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge status-${rec.monitoringStatus?.toLowerCase()}`}
                          style={{
                            background: rec.monitoringStatus === 'Active' ? 'var(--color-sage-light)' : '#F3F4F6',
                            color: rec.monitoringStatus === 'Active' ? 'var(--color-primary-dark)' : '#6B7280',
                          }}
                        >
                          {rec.monitoringStatus}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => handleOpenDetail(rec)}
                            className="btn btn-secondary btn-sm"
                            title="View Record Details"
                            style={{ padding: '0.35rem 0.55rem' }}
                          >
                            <Eye size={14} />
                          </button>

                          {isAuthenticated && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(rec)}
                                className="btn btn-outline btn-sm"
                                title="Edit Record"
                                style={{ padding: '0.35rem 0.55rem' }}
                              >
                                <Edit size={14} />
                              </button>
                              <button
                                onClick={() => handleOpenDelete(rec)}
                                className="btn btn-danger btn-sm"
                                title="Delete Record"
                                style={{ padding: '0.35rem 0.55rem' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '1.25rem',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                }}
              >
                <div>
                  Page {page} of {totalPages} ({totalRecords} records)
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

        {/* View Details Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Monitoring Record Details"
        >
          {selectedRecord && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <RiskBadge level={selectedRecord.riskLevel} />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Source: <strong>{selectedRecord.dataSource}</strong>
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Location Name</span>
                  <strong style={{ fontSize: '1rem', color: 'var(--color-primary-dark)' }}>{selectedRecord.locationName}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>District & State</span>
                  <strong>{selectedRecord.district}, {selectedRecord.state}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Rainfall Recorded</span>
                  <strong style={{ color: 'var(--color-mountain)', fontSize: '1.1rem' }}>{selectedRecord.rainfall} mm</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Monitoring Status</span>
                  <strong>{selectedRecord.monitoringStatus}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Coordinates</span>
                  <span>
                    {selectedRecord.latitude && selectedRecord.longitude
                      ? `${selectedRecord.latitude}°, ${selectedRecord.longitude}°`
                      : 'Not recorded'}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', display: 'block' }}>Observation Timestamp</span>
                  <span>{new Date(selectedRecord.recordedAt).toLocaleString()}</span>
                </div>
              </div>

              {selectedRecord.remarks && (
                <div style={{ background: '#F8FAF7', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.3rem' }}>
                    Remarks & Geological Notes:
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-charcoal)', margin: 0, lineHeight: 1.5 }}>
                    {selectedRecord.remarks}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button onClick={() => setIsDetailModalOpen(false)} className="btn btn-secondary">
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Add/Edit Modal (Admin Protected) */}
        <Modal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          title={isEditMode ? 'Edit Risk Monitoring Record' : 'Add New Risk Monitoring Record'}
        >
          <form onSubmit={handleFormSubmit}>
            {formError && (
              <div style={{ background: 'var(--risk-critical-bg)', color: 'var(--risk-critical)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {formError}
              </div>
            )}
            {formSuccess && (
              <div style={{ background: '#DEF7EC', color: '#03543F', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {formSuccess}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                Location Name <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Joshimath Upper Ridge Sector B"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Rainfall (mm) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="form-input"
                  placeholder="e.g. 74.5"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Risk Level</label>
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
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={formData.monitoringStatus}
                  onChange={(e) => setFormData({ ...formData, monitoringStatus: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Latitude (Optional)</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 30.5564"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Longitude (Optional)</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 79.5638"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Data Source Designation</label>
              <select
                className="form-select"
                value={formData.dataSource}
                onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
              >
                <option value="Manual entry">Manual entry (Field observation)</option>
                <option value="Demonstration data">Demonstration data (Simulated)</option>
                <option value="External weather data">External weather data (Station)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Remarks & Stability Notes</label>
              <textarea
                rows="3"
                className="form-textarea"
                placeholder="Observed scree movement, drainage condition, tension cracks..."
                value={formData.remarks}
                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              />
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
                {submitting ? 'Saving...' : isEditMode ? 'Update Record' : 'Save Record'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Delete Monitoring Record"
          message={`Are you sure you want to delete the record for "${selectedRecord?.locationName}"?`}
          isLoading={submitting}
        />
      </div>
    </div>
  );
};

export default RiskMonitoring;
