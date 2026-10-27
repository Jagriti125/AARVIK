import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck2,
  Activity,
  AlertTriangle,
  Settings,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';

const Sidebar = ({ activeTab, onSelectTab }) => {
  const navItems = [
    { id: 'overview', label: 'Admin Overview', icon: LayoutDashboard },
    { id: 'reports', label: 'Hazard Reports (Review)', icon: FileCheck2 },
    { id: 'monitoring', label: 'Risk Records (CRUD)', icon: Activity },
    { id: 'alerts', label: 'Alert Management (CRUD)', icon: AlertTriangle },
    { id: 'aabhas', label: 'AABHAS Model Config', icon: ShieldAlert },
  ];

  return (
    <aside
      style={{
        width: '260px',
        background: '#FFFFFF',
        borderRight: '1px solid var(--color-border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1rem',
        minHeight: 'calc(100vh - 120px)',
      }}
      className="admin-sidebar"
    >
      <div>
        <div style={{ padding: '0 0.5rem 1.25rem', borderBottom: '1px solid #EEF3EF', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-mountain)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Administrative Console
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
            Operations & Control
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-primary-dark)' : 'var(--color-text-muted)',
                  backgroundColor: isActive ? 'var(--color-sage-light)' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={18} color={isActive ? 'var(--color-primary-dark)' : 'var(--color-mountain)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div style={{ paddingTop: '1.5rem', borderTop: '1px solid #EEF3EF' }}>
        <NavLink
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.65rem 0.85rem',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            fontWeight: 600,
            borderRadius: 'var(--radius-md)',
            transition: 'background 0.15s ease',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Public Portal</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
