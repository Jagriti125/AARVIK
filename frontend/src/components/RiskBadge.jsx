import React from 'react';

const RiskBadge = ({ level, showDot = true, className = '' }) => {
  const normalizedLevel = level ? level.toLowerCase() : 'low';

  const labels = {
    low: 'Low Risk',
    moderate: 'Moderate Risk',
    high: 'High Risk',
    critical: 'Critical Risk',
  };

  const badgeClass = {
    low: 'risk-badge-low',
    moderate: 'risk-badge-moderate',
    high: 'risk-badge-high',
    critical: 'risk-badge-critical',
  }[normalizedLevel] || 'risk-badge-low';

  return (
    <span className={`risk-badge ${badgeClass} ${className}`}>
      {labels[normalizedLevel] || level}
    </span>
  );
};

export default RiskBadge;
