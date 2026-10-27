import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  AlertTriangle,
  Clock,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Share2,
  Calendar,
  UserCheck,
} from 'lucide-react';
import alertService from '../services/alertService';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const AlertDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [alertData, setAlertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlert = async () => {
      try {
        setLoading(true);
        const res = await alertService.getAlertById(id);
        if (res.success) {
          setAlertData(res.data);
        } else {
          setError('Advisory details not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading alert details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlert();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <LoadingSpinner message="Loading advisory bulletin..." />
      </div>
    );
  }

  if (error || !alertData) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="card" style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center', padding: '2.5rem' }}>
          <AlertTriangle size={40} color="var(--risk-critical)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
            Advisory Not Available
          </h3>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>{error || 'Alert not found.'}</p>
          <Link to="/alerts" className="btn btn-primary" style={{ margin: '0 auto' }}>
            <ArrowLeft size={16} /> Back to Alerts List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem', backgroundColor: '#F8FAF7' }}>
      <div className="container-narrow">
        {/* Back Link */}
        <Link
          to="/alerts"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-mountain)',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to All Advisories</span>
        </Link>

        {/* Advisory Header Card */}
        <div className="card" style={{ padding: '2.25rem', marginBottom: '1.75rem', borderTop: `6px solid ${alertData.riskLevel === 'Critical' ? 'var(--risk-critical)' : 'var(--risk-moderate)'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <RiskBadge level={alertData.riskLevel} />
              <span className={`status-badge status-${alertData.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                {alertData.status}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              <Clock size={15} />
              <span>
                Published: {alertData.publishedAt ? new Date(alertData.publishedAt).toLocaleString() : 'Draft mode'}
              </span>
            </div>
          </div>

          <h1 style={{ fontSize: '1.9rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
            {alertData.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-mountain)', fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            <MapPin size={18} />
            <span>
              {alertData.location}, {alertData.district}, {alertData.state}
            </span>
          </div>

          <div style={{ borderTop: '1px solid #EEF3EF', paddingTop: '1.25rem', fontSize: '1rem', color: 'var(--color-charcoal)', lineHeight: 1.7 }}>
            {alertData.description}
          </div>
        </div>

        {/* Recommended Precautions Card */}
        {alertData.recommendedPrecautions && alertData.recommendedPrecautions.length > 0 && (
          <div className="card" style={{ padding: '2rem', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <ShieldAlert size={22} color="var(--risk-critical)" />
              <h2 style={{ fontSize: '1.3rem', color: 'var(--color-primary-dark)' }}>
                Recommended Safety Protocols &amp; Precautions
              </h2>
            </div>

            <ul style={{ paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {alertData.recommendedPrecautions.map((precaution, idx) => (
                <li key={idx} style={{ fontSize: '0.95rem', color: 'var(--color-charcoal)', lineHeight: 1.5 }}>
                  {precaution}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Issuing Authority & Metadata */}
        <div className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
              Official Issuing Authority
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
              <UserCheck size={18} color="var(--color-mountain)" />
              <strong style={{ color: 'var(--color-primary-dark)' }}>{alertData.issuedBy || 'Authorized Admin'}</strong>
            </div>
          </div>

          {alertData.expiresAt && (
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                Advisory Valid Until
              </span>
              <span style={{ fontSize: '0.9rem', color: 'var(--color-charcoal)', fontWeight: 600 }}>
                {new Date(alertData.expiresAt).toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Demonstration Disclaimer */}
        <div className="disclaimer-box" style={{ marginTop: '1.5rem' }}>
          <strong>Demonstration Record:</strong> This early warning notification is part of the AARVIK academic demonstration platform. Always adhere to directions issued by the National Disaster Management Authority (NDMA) and local police during real monsoon contingencies.
        </div>
      </div>
    </div>
  );
};

export default AlertDetails;
