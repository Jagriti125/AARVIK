import React, { useState } from 'react';
import {
  AlertTriangle,
  Send,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  MapPin,
  Calendar,
  CloudRain,
  Camera,
  Info,
  Loader2,
} from 'lucide-react';
import reportService from '../services/reportService';

const HAZARD_TYPES = [
  'Visible ground cracks',
  'Rockfall',
  'Slope movement',
  'Unusual water flow',
  'Road damage',
  'Other',
];

const ReportHazard = () => {
  const initialForm = {
    title: '',
    reporterName: '',
    reporterEmail: '',
    state: '',
    district: '',
    location: '',
    latitude: '',
    longitude: '',
    hazardType: 'Visible ground cracks',
    description: '',
    observedConditions: '',
    rainfall: '',
    imageUrl: '',
    observedAt: new Date().toISOString().slice(0, 16),
  };

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};

    if (!formData.title.trim() || formData.title.trim().length < 5) {
      errors.title = 'Title must be at least 5 characters long.';
    }

    if (!formData.reporterName.trim() || formData.reporterName.trim().length < 2) {
      errors.reporterName = 'Please provide your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.reporterEmail.trim() || !emailRegex.test(formData.reporterEmail.trim())) {
      errors.reporterEmail = 'A valid email address is required for official verification contact.';
    }

    if (!formData.state.trim()) errors.state = 'State is required.';
    if (!formData.district.trim()) errors.district = 'District is required.';
    if (!formData.location.trim()) errors.location = 'Specific landmark or location is required.';

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errors.description = 'Please describe the observed hazard in at least 10 characters.';
    }

    if (!formData.observedConditions.trim()) {
      errors.observedConditions = 'Please describe the surrounding soil, slope, or weather conditions.';
    }

    if (formData.latitude !== '' && (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90)) {
      errors.latitude = 'Latitude must be between -90 and 90.';
    }

    if (formData.longitude !== '' && (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180)) {
      errors.longitude = 'Longitude must be between -180 and 180.';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    try {
      setSubmitting(true);
      const res = await reportService.createReport(formData);
      if (res.success) {
        setSuccessData(res.data);
        setFormData(initialForm);
        setValidationErrors({});
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          (err.response?.data?.errors ? err.response.data.errors.join('; ') : 'Failed to submit report. Please check the network and try again.')
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem', backgroundColor: '#F8FAF7' }}>
      <div className="container-narrow">
        {/* Page Title */}
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--color-mountain)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.5rem',
            }}
          >
            <AlertTriangle size={16} />
            <span>Community Hazard Reporting</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
            Report a Slope Hazard or Ground Movement
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Notice unusual tension cracks, rolling boulders, or abnormal water seepage? Submit your observation to alert emergency managers and the geotechnical review team.
          </p>
        </div>

        {/* Success Alert Banner */}
        {successData && (
          <div
            className="animate-fade-in"
            style={{
              background: '#DEF7EC',
              border: '1.5px solid #31C48D',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <CheckCircle size={24} color="#03543F" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#03543F', marginBottom: '0.25rem' }}>
                  Hazard Report Successfully Submitted!
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#046C4E', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                  Your report "<strong>{successData.title}</strong>" has been logged in the AARVIK system. It is currently marked with status <strong>Pending Review</strong> until emergency administration verifies the location.
                </p>
                <div style={{ fontSize: '0.8rem', color: '#03543F' }}>
                  Thank you for contributing to community disaster resilience.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div
            className="animate-fade-in"
            style={{
              background: 'var(--risk-critical-bg)',
              border: '1.5px solid var(--risk-critical-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <AlertTriangle size={20} color="var(--risk-critical)" />
              <div style={{ fontSize: '0.9rem', color: 'var(--risk-critical)', fontWeight: 600 }}>
                {errorMessage}
              </div>
            </div>
          </div>
        )}

        {/* Verification & Privacy Notice */}
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', background: '#FFFFFF', borderLeft: '4px solid var(--color-mountain)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', color: 'var(--color-primary-dark)', fontWeight: 700, fontSize: '0.9rem' }}>
            <ShieldCheck size={18} color="var(--color-mountain)" />
            <span>Field Integrity & Privacy Notice</span>
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
            To prevent panic, reports do not immediately become verified warnings. They are marked <em>Pending Review</em> and evaluated by local disaster managers. Your email is kept strictly confidential and will never be shown on public pages.
          </p>
        </div>

        {/* Form Container */}
        <div className="card" style={{ padding: '2rem 2.25rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Report Title */}
            <div className="form-group">
              <label className="form-label">
                Report Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 10m longitudinal crack on NH-58 roadside shoulder"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={120}
              />
              {validationErrors.title && <div className="form-error">{validationErrors.title}</div>}
              <div className="form-help">Concise summary of the hazard (5 to 120 characters).</div>
            </div>

            {/* Reporter Contact Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Your Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                />
                {validationErrors.reporterName && <div className="form-error">{validationErrors.reporterName}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Your Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. rajesh@example.com"
                  value={formData.reporterEmail}
                  onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                />
                {validationErrors.reporterEmail && <div className="form-error">{validationErrors.reporterEmail}</div>}
                <div className="form-help">Used only for verification; kept private.</div>
              </div>
            </div>

            {/* Geographic Location */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
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
                />
                {validationErrors.state && <div className="form-error">{validationErrors.state}</div>}
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
                />
                {validationErrors.district && <div className="form-error">{validationErrors.district}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Specific Location / Landmark <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Helang bend near Km marker 18"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
              {validationErrors.location && <div className="form-error">{validationErrors.location}</div>}
            </div>

            {/* Coordinates (Optional) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Latitude (Optional)</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 30.5284"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                />
                {validationErrors.latitude && <div className="form-error">{validationErrors.latitude}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Longitude (Optional)</label>
                <input
                  type="number"
                  step="any"
                  className="form-input"
                  placeholder="e.g. 79.5218"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                />
                {validationErrors.longitude && <div className="form-error">{validationErrors.longitude}</div>}
              </div>
            </div>

            {/* Hazard Category & Date */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Hazard Category <span className="required">*</span>
                </label>
                <select
                  className="form-select"
                  value={formData.hazardType}
                  onChange={(e) => setFormData({ ...formData, hazardType: e.target.value })}
                >
                  {HAZARD_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Observation Date & Time</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.observedAt}
                  onChange={(e) => setFormData({ ...formData, observedAt: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                Detailed Hazard Description <span className="required">*</span>
              </label>
              <textarea
                rows="4"
                className="form-textarea"
                placeholder="Describe what you observed: crack length, rolling boulders, tilting trees, unusual water seepage, affected road width..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              {validationErrors.description && <div className="form-error">{validationErrors.description}</div>}
            </div>

            {/* Observed Conditions */}
            <div className="form-group">
              <label className="form-label">
                Surrounding Terrain & Weather Conditions <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Steep shale slope, saturated wet topsoil, ongoing heavy rain..."
                value={formData.observedConditions}
                onChange={(e) => setFormData({ ...formData, observedConditions: e.target.value })}
              />
              {validationErrors.observedConditions && (
                <div className="form-error">{validationErrors.observedConditions}</div>
              )}
            </div>

            {/* Rainfall & Photo URL */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Rainfall Estimate (mm, Optional)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="form-input"
                  placeholder="e.g. 50"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Photograph Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/photo.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
                <div className="form-help">Direct link to hosted field photo.</div>
              </div>
            </div>

            {/* Safety Reminder */}
            <div
              style={{
                background: '#FEF3C7',
                border: '1px solid #FCD34D',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                fontSize: '0.835rem',
                color: '#92400E',
                marginBottom: '1.5rem',
              }}
            >
              <strong>Safety First:</strong> Never enter an unstable slope, swollen stream bed, or active rockfall zone to capture photos or coordinates. Prioritize your personal safety at all times.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Submitting Report to Database...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Hazard Report for Verification
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportHazard;
