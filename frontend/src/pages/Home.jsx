import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Activity,
  FileText,
  AlertTriangle,
  ArrowRight,
  Eye,
  BellRing,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Mountain,
  Compass,
  Radio,
} from 'lucide-react';
import dashboardService from '../services/dashboardService';
import alertService from '../services/alertService';
import RiskBadge from '../components/RiskBadge';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [stats, setStats] = useState(null);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, alertsRes] = await Promise.all([
          dashboardService.getDashboardStats().catch(() => null),
          alertService.getAlerts({ limit: 3, status: 'Active' }).catch(() => null),
        ]);

        if (dashRes && dashRes.data) {
          setStats(dashRes.data.summary);
        }
        if (alertsRes && alertsRes.data) {
          setRecentAlerts(alertsRes.data);
        }
      } catch (err) {
        console.error('Failed to load home page metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* =========================================================================
          HERO SECTION
          Mountain-inspired aesthetic with deep forest green tones & clear typography
          ========================================================================= */}
      <section
        style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #12372A 0%, #1E4D3B 55%, #2D5A46 100%)',
          color: '#FFFFFF',
          padding: '5rem 0 6rem',
          overflow: 'hidden',
        }}
      >
        {/* Subtle SVG mountain silhouette overlay in background */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '160px',
            opacity: 0.15,
            pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M0,0 L150,90 L320,30 L500,100 L720,20 L940,80 L1080,25 L1200,90 L1200,120 L0,120 Z' fill='%23FFFFFF'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom',
            backgroundSize: 'cover',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'rgba(231, 239, 232, 0.15)',
                border: '1px solid rgba(231, 239, 232, 0.3)',
                padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.825rem',
                fontWeight: 600,
                color: '#E7EFE8',
                marginBottom: '1.5rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Radio size={14} color="#F2B84B" />
              <span>AARVIK Geotechnical Observation Platform</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#FFFFFF',
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-heading)',
              }}
            >
              Building Awareness Before the Ground Shifts.
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: '#DCE8DE',
                lineHeight: 1.6,
                marginBottom: '2.5rem',
                fontWeight: 400,
              }}
            >
              AARVIK empowers mountain communities and disaster managers with real-time hazard reporting, localized rainfall monitoring records, and early warning notifications designed to safeguard vulnerable terrain.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn btn-amber btn-lg">
                <Activity size={18} />
                Explore Risk Dashboard
              </Link>
              <Link
                to="/report"
                className="btn btn-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  color: '#FFFFFF',
                  border: '1.5px solid rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <AlertTriangle size={18} />
                Report a Hazard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STATISTICS SECTION (Database-Backed)
          ========================================================================= */}
      <section style={{ transform: 'translateY(-2rem)', zIndex: 10, position: 'relative' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <StatCard
              title="Total Hazard Reports"
              value={stats ? stats.totalReports : '--'}
              icon={FileText}
              color="green"
              subtitle="Community & field submissions"
            />
            <StatCard
              title="Active Alerts"
              value={stats ? stats.activeAlerts : '--'}
              icon={BellRing}
              color="red"
              subtitle="Live early warning notices"
            />
            <StatCard
              title="Monitored Locations"
              value={stats ? stats.totalMonitoringLocations : '--'}
              icon={Activity}
              color="blue"
              subtitle="Active terrain observation points"
            />
            <StatCard
              title="Resolved Incidents"
              value={stats ? stats.resolvedReports : '--'}
              icon={CheckCircle}
              color="green"
              subtitle="Mitigated or cleared slopes"
            />
          </div>

          {stats && stats.isDemonstration && (
            <div
              style={{
                marginTop: '1rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
              }}
            >
              * Numerical metrics reflect current database records, including labeled demonstration data.
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          HOW AARVIK WORKS SECTION
          ========================================================================= */}
      <section style={{ padding: '4rem 0', background: 'var(--color-warm-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 3rem' }}>
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: 'var(--color-mountain)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              System Operations
            </span>
            <h2
              style={{
                fontSize: '2.2rem',
                color: 'var(--color-primary-dark)',
                marginTop: '0.4rem',
                marginBottom: '1rem',
              }}
            >
              How AARVIK Safeguards Hill Communities
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>
              From initial field observation to administrative review and early warning distribution, AARVIK coordinates critical geotechnical workflows.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Step 1 */}
            <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'left' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--color-sage-light)',
                  color: 'var(--color-primary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                01
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                Community Hazard Reporting
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Locals and travelers submit ground crack observations, rockfall signs, road erosion, or abnormal seepage with location coordinates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'left' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'var(--color-sage-light)',
                  color: 'var(--color-primary-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                02
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                Field Record Verification
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Authorized officers review submitted reports, correlate with cumulative rainfall records, and update status from review to verified mitigation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card" style={{ padding: '2rem 1.5rem', textAlign: 'left' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(242, 184, 75, 0.2)',
                  color: '#92400E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                03
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', color: 'var(--color-primary-dark)' }}>
                Early Warning Dissemination
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Administrators publish actionable advisories categorized by severity (Low, Moderate, High, Critical) with life-saving evacuation and travel precautions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          RECENTLY PUBLISHED ALERTS SECTION
          ========================================================================= */}
      <section style={{ padding: '4rem 0', background: '#FFFFFF', borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--risk-critical)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldAlert size={16} />
                Live Bulletins
              </span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--color-primary-dark)', marginTop: '0.3rem' }}>
                Recently Published Early Warnings
              </h2>
            </div>
            <Link to="/alerts" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>View All Alerts</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Checking active hazard bulletins..." />
          ) : recentAlerts.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <CheckCircle size={40} color="var(--risk-low)" style={{ marginBottom: '0.75rem' }} />
              <h4 style={{ fontSize: '1.2rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                No Critical Alerts Published
              </h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto' }}>
                There are currently no active emergency alerts in the system. Check the risk monitoring database for local rainfall records.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {recentAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className="card"
                  style={{
                    borderLeft: `5px solid ${alert.riskLevel === 'Critical' ? 'var(--risk-critical)' : 'var(--risk-moderate)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <RiskBadge level={alert.riskLevel} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {alert.publishedAt ? new Date(alert.publishedAt).toLocaleDateString() : 'Active'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.5rem' }}>
                      {alert.title}
                    </h3>

                    <p style={{ fontSize: '0.875rem', color: 'var(--color-mountain)', fontWeight: 600, marginBottom: '0.75rem' }}>
                      {alert.location}, {alert.district} ({alert.state})
                    </p>

                    <p style={{ fontSize: '0.875rem', color: 'var(--color-charcoal)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {alert.description.length > 140 ? `${alert.description.substring(0, 140)}...` : alert.description}
                    </p>
                  </div>

                  <Link to={`/alerts/${alert._id}`} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                    <span>Read Advisory & Precautions</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SAFETY AWARENESS PREVIEW SECTION
          ========================================================================= */}
      <section style={{ padding: '4.5rem 0', background: 'var(--color-warm-bg)' }}>
        <div className="container">
          <div
            style={{
              background: 'linear-gradient(135deg, #1E4D3B 0%, #12372A 100%)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(2rem, 5vw, 4rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ maxWidth: '680px' }}>
              <span
                style={{
                  background: 'rgba(242, 184, 75, 0.25)',
                  color: '#F2B84B',
                  padding: '0.3rem 0.8rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  display: 'inline-block',
                  marginBottom: '1rem',
                }}
              >
                Disaster Preparedness
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', color: '#FFFFFF', marginBottom: '1rem' }}>
                Recognize the Warning Signs Early.
              </h2>
              <p style={{ color: '#D5E5DA', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Tension cracks on hillside roads, sudden muddiness in hillside brooks, or jamming doors and windows are vital early indicators of slope displacement. Review our safety protocols before traveling through mountainous belts.
              </p>
              <Link to="/guidelines" className="btn btn-amber btn-lg">
                <BookOpen size={18} />
                Explore Safety Guidelines
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
