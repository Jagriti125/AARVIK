import React from 'react';
import { AlertTriangle, Clock, MapPin, ShieldAlert, CheckCircle2, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import RiskBadge from './RiskBadge';

const AlertCard = ({ alert, onSelect, onEdit, onDelete, isAdmin = false }) => {
  const isCritical = alert.riskLevel === 'Critical';

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: `1.5px solid ${isCritical ? 'var(--risk-critical-border)' : 'var(--color-border-subtle)'}`,
        boxShadow: isCritical ? '0 4px 14px rgba(217, 79, 69, 0.12)' : 'var(--shadow-sm)',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      }}
      className="card alert-card-item"
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <RiskBadge level={alert.riskLevel} />
            <span className={`status-badge status-${alert.status?.toLowerCase().replace(/\s+/g, '-')}`}>
              {alert.status}
            </span>
          </div>

          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} />
            {alert.publishedAt ? new Date(alert.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Draft Mode'}
          </span>
        </div>

        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem', fontWeight: 700 }}>
          {alert.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-mountain)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.9rem' }}>
          <MapPin size={15} />
          <span>{alert.location}, {alert.district}, {alert.state}</span>
        </div>

        <p style={{ color: 'var(--color-charcoal)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem' }}>
          {alert.description}
        </p>

        {alert.recommendedPrecautions && alert.recommendedPrecautions.length > 0 && (
          <div style={{ background: '#F8FAF7', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-dark)', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldAlert size={14} color="var(--color-mountain)" />
              Recommended Precautions
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.835rem', color: 'var(--color-charcoal)' }}>
              {alert.recommendedPrecautions.slice(0, 3).map((item, idx) => (
                <li key={idx} style={{ marginBottom: '0.2rem' }}>{item}</li>
              ))}
              {alert.recommendedPrecautions.length > 3 && (
                <li style={{ color: 'var(--color-text-muted)', listStyle: 'none', marginLeft: '-0.5rem', fontStyle: 'italic' }}>
                  +{alert.recommendedPrecautions.length - 3} more precautions
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #EEF3EF', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span>Issued by: </span>
          <strong style={{ color: 'var(--color-primary-dark)' }}>{alert.issuedBy || 'Authorized Admin'}</strong>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isAdmin && onEdit && (
            <button
              onClick={() => onEdit(alert)}
              className="btn btn-secondary btn-sm"
              title="Edit Alert"
              style={{ padding: '0.3rem 0.6rem' }}
            >
              <Edit3 size={14} />
              Edit
            </button>
          )}

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(alert)}
              className="btn btn-danger btn-sm"
              title="Delete Alert"
              style={{ padding: '0.3rem 0.6rem' }}
            >
              <Trash2 size={14} />
              Delete
            </button>
          )}

          {onSelect && (
            <button
              onClick={() => onSelect(alert)}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.3rem 0.75rem' }}
            >
              Details
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
