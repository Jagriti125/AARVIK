import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, Mountain, ExternalLink, GitBranch } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#12372A', color: '#E7EFE8', marginTop: 'auto', paddingTop: '3.5rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          {/* Column 1: Brand & Tagline */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img src="/logo.svg" alt="AARVIK Logo" style={{ width: '36px', height: '36px', filter: 'brightness(1.2)' }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>
                AARVIK
              </span>
            </div>
            <p style={{ color: '#F2B84B', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '0.75rem', fontWeight: 600 }}>
              "Understanding the Terrain. Preparing for Tomorrow."
            </p>
            <p style={{ fontSize: '0.85rem', color: '#B3C6BA', lineHeight: 1.6 }}>
              A web-based landslide risk monitoring, community hazard reporting, and early warning management system built for disaster risk reduction.
            </p>
          </div>

          {/* Column 2: System Navigation */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/" style={{ color: '#E7EFE8', transition: 'color 0.15s' }}>Home & Overview</Link></li>
              <li><Link to="/dashboard" style={{ color: '#E7EFE8', transition: 'color 0.15s' }}>Analytical Dashboard</Link></li>
              <li><Link to="/monitoring" style={{ color: '#E7EFE8', transition: 'color 0.15s' }}>Risk Monitoring Records</Link></li>
              <li><Link to="/report" style={{ color: '#E7EFE8', transition: 'color 0.15s' }}>Report Hazard Incident</Link></li>
              <li><Link to="/alerts" style={{ color: '#E7EFE8', transition: 'color 0.15s' }}>Early Warning Alerts</Link></li>
              <li><Link to="/guidelines" style={{ color: '#E7EFE8', transition: 'color 0.15s' }}>Preparedness Guidelines</Link></li>
            </ul>
          </div>

          {/* Column 3: Architecture & AABHAS Distinction */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <GitBranch size={16} color="#F2B84B" />
              AABHAS Model Relation
            </h4>
            <p style={{ fontSize: '0.825rem', color: '#B3C6BA', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              <strong>AABHAS:</strong> The separate AI/ML prediction model designed for landslide susceptibility analysis.
            </p>
            <p style={{ fontSize: '0.825rem', color: '#B3C6BA', lineHeight: 1.5 }}>
              <strong>AARVIK:</strong> This web application managing records, alerts, and field reports. Prepared for REST API model integration.
            </p>
          </div>

          {/* Column 4: Institutional Disclaimer */}
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={16} color="#F2B84B" />
              Academic Disclaimer
            </h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.78rem', color: '#C8D9CD', lineHeight: 1.5 }}>
              This portal is a full-stack college web engineering project demonstrating CRUD operations, REST architecture, and emergency information workflows. Displayed records are demonstration data and must not be used as operational emergency directives.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#9BB2A4' }}>
          <div>
            &copy; {new Date().getFullYear()} AARVIK Early Warning System. All rights reserved.
          </div>
          <div>
            Built with React, Express, Node.js &amp; MongoDB.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
