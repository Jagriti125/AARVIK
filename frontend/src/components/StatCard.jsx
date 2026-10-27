import React from 'react';

const StatCard = ({ title, value, icon: Icon, changeText, color = 'green', subtitle }) => {
  const colorStyles = {
    green: {
      bg: 'rgba(67, 104, 80, 0.1)',
      text: '#436850',
      border: 'rgba(67, 104, 80, 0.2)',
    },
    amber: {
      bg: 'rgba(242, 184, 75, 0.15)',
      text: '#B7791F',
      border: 'rgba(242, 184, 75, 0.3)',
    },
    red: {
      bg: 'rgba(217, 79, 69, 0.12)',
      text: '#D94F45',
      border: 'rgba(217, 79, 69, 0.25)',
    },
    blue: {
      bg: 'rgba(59, 130, 246, 0.12)',
      text: '#2563EB',
      border: 'rgba(59, 130, 246, 0.25)',
    },
  }[color] || {
    bg: 'rgba(67, 104, 80, 0.1)',
    text: '#436850',
    border: 'rgba(67, 104, 80, 0.2)',
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        border: '1px solid var(--color-border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      className="stat-card"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span
            style={{
              fontSize: '0.825rem',
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {title}
          </span>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-primary-dark)',
              marginTop: '0.25rem',
              lineHeight: 1.1,
            }}
          >
            {value !== undefined && value !== null ? value : '--'}
          </div>
        </div>

        {Icon && (
          <div
            style={{
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              background: colorStyles.bg,
              color: colorStyles.text,
              border: `1px solid ${colorStyles.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={22} />
          </div>
        )}
      </div>

      {(changeText || subtitle) && (
        <div
          style={{
            marginTop: '0.75rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid #F1F5F2',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{changeText || subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
