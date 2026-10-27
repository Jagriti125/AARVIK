import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading terrain data...', size = 32 }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        color: 'var(--color-mountain)',
        gap: '0.75rem',
      }}
    >
      <Loader2
        size={size}
        style={{
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      {message && (
        <span
          style={{
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--color-text-muted)',
          }}
        >
          {message}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
