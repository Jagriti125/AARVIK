import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Shield, AlertTriangle, ArrowRight, Loader2, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // If already authenticated, redirect to /admin
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both administrator email and password.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Authentication failed. Please verify your administrator email and password.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '4rem 0 6rem', backgroundColor: '#F8FAF7', minHeight: 'calc(100vh - 140px)', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: 'var(--color-sage-light)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              color: 'var(--color-primary-dark)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <Shield size={32} />
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
            Administrator Access
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.925rem' }}>
            Authorized portal for disaster coordinators and geotechnical verification officers.
          </p>
        </div>

        {error && (
          <div
            className="animate-fade-in"
            style={{
              background: 'var(--risk-critical-bg)',
              border: '1.5px solid var(--risk-critical-border)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center',
            }}
          >
            <AlertTriangle size={20} color="var(--risk-critical)" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.875rem', color: 'var(--risk-critical)', fontWeight: 600 }}>
              {error}
            </div>
          </div>
        )}

        <div className="card" style={{ padding: '2.25rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Official Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={18}
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="admin@aarvik.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={18}
                  style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}
                />
                <input
                  type="password"
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Sign In to Management Console
                </>
              )}
            </button>
          </form>

          {/* Academic Reviewer Helper Box */}
          <div
            style={{
              marginTop: '1.75rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #EEF3EF',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.5,
              background: '#F9FCF9',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: '0.3rem' }}>
              <Info size={15} color="var(--color-mountain)" />
              <span>Evaluator / Project Setup Note</span>
            </div>
            <div>
              Initial admin created via seed script:
              <br />
              <strong>Email:</strong> <code>admin@aarvik.org</code>
              <br />
              <strong>Password:</strong> <code>AarvikAdmin#2026</code>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem' }}>
          <Link to="/" style={{ color: 'var(--color-mountain)', fontWeight: 600 }}>
            &larr; Return to Public Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
