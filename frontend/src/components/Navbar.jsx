import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Shield,
  Activity,
  AlertTriangle,
  FileText,
  LifeBuoy,
  Lock,
  LogOut,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { admin, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Risk Monitoring', path: '/monitoring' },
    { name: 'Report a Hazard', path: '/report' },
    { name: 'Alerts', path: '/alerts' },
    { name: 'Safety Guidelines', path: '/guidelines' },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 900, background: '#FFFFFF', boxShadow: '0 2px 8px rgba(18, 55, 42, 0.05)' }}>
      {/* Demonstration Banner */}
      <div className="demo-banner">
        <Info size={15} />
        <span>
          <strong>Academic Demonstration Mode:</strong> Data reflects simulated terrain observations. Not an authorized real-time emergency dispatch service.
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '70px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.svg" alt="AARVIK Logo" style={{ width: '38px', height: '38px' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-dark)', letterSpacing: '0.02em', lineHeight: 1 }}>
              AARVIK
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-mountain)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Terrain Risk Monitor
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              style={({ isActive }) => ({
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                padding: '0.4rem 0',
                borderBottom: isActive ? '2px solid var(--color-mountain)' : '2px solid transparent',
                transition: 'all 0.15s ease',
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Auth / Admin CTA */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="desktop-auth">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/admin" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Shield size={16} />
                <span>Admin Panel</span>
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Log Out"
                style={{ padding: '0.4rem 0.6rem' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Lock size={15} />
              <span>Admin Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'flex', alignItems: 'center', padding: '0.5rem', color: 'var(--color-primary-dark)' }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid var(--color-border-subtle)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: 'var(--shadow-md)',
          }}
          className="animate-fade-in"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                fontSize: '1rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--color-primary-dark)' : 'var(--color-charcoal)',
                padding: '0.5rem 0',
                borderBottom: '1px solid #F1F5F2',
              })}
            >
              {link.name}
            </NavLink>
          ))}

          <div style={{ paddingTop: '0.5rem' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <Shield size={16} />
                  Admin Control Panel
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-outline"
                  style={{ width: '100%' }}
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                <Lock size={16} />
                Admin Portal Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Media Query Styles injected inline */}
      <style>{`
        @media (min-width: 868px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
