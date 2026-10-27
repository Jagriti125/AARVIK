import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ padding: '6rem 1.5rem', textAlign: 'center', backgroundColor: '#F8FAF7', minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '3rem 2rem' }}>
        <Mountain size={64} color="var(--color-mountain)" style={{ marginBottom: '1.25rem' }} />
        <h1 style={{ fontSize: '3.5rem', color: 'var(--color-primary-dark)', lineHeight: 1, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
          Terrain Path Not Found
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '2rem' }}>
          The requested hazard record, advisory, or management page does not exist or has been relocated.
        </p>
        <Link to="/" className="btn btn-primary" style={{ margin: '0 auto', display: 'inline-flex' }}>
          <ArrowLeft size={16} />
          Return to Platform Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
