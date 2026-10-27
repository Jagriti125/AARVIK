import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  BellRing,
  Activity,
  CheckCircle,
  Clock,
  Filter,
  AlertTriangle,
  RefreshCw,
  Info,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import dashboardService from '../services/dashboardService';
import StatCard from '../components/StatCard';
import RiskBadge from '../components/RiskBadge';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_COLORS = {
  'Pending Review': '#F59E0B',
  'Under Review': '#6366F1',
  'Verified': '#10B981',
  'Resolved': '#6B7280',
  'Rejected': '#EF4444',
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const res = await dashboardService.getDashboardStats();
      if (res.success) {
        setData(res.data);
      } else {
        setError('Failed to retrieve statistics from backend.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Could not connect to the backend database. Please ensure the backend server and MongoDB are online.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <LoadingSpinner message="Calculating database-backed environmental metrics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '2.5rem' }}>
          <AlertTriangle size={48} color="var(--risk-critical)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary-dark)', marginBottom: '0.75rem' }}>
            System Connectivity Notice
          </h3>
          <p style={{ color: 'var(--color-charcoal)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            {error}
          </p>
          <button onClick={handleRefresh} className="btn btn-primary" style={{ margin: '0 auto' }}>
            <RefreshCw size={16} />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { summary, charts, recentReports, recentAlerts } = data || {};

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <h1 style={{ fontSize: '2rem', color: 'var(--color-primary-dark)' }}>
                Terrain Monitoring Dashboard
              </h1>
              {summary?.isDemonstration && (
                <span
                  style={{
                    background: '#FEF3C7',
                    color: '#92400E',
                    border: '1px solid #FCD34D',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 'var(--radius-full)',
                    textTransform: 'uppercase',
                  }}
                >
                  Demo Data Mode
                </span>
              )}
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              Live telemetry aggregated from MongoDB field records, active advisories, and community submissions.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>{refreshing ? 'Updating...' : 'Refresh Metrics'}</span>
          </button>
        </div>

        {/* 1. Summary Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <StatCard
            title="Total Hazard Reports"
            value={summary?.totalReports ?? 0}
            icon={FileText}
            color="green"
            subtitle={`${summary?.pendingReports || 0} awaiting verification`}
          />
          <StatCard
            title="Active Alerts"
            value={summary?.activeAlerts ?? 0}
            icon={BellRing}
            color="red"
            subtitle="Immediate warnings in effect"
          />
          <StatCard
            title="Monitored Locations"
            value={summary?.totalMonitoringLocations ?? 0}
            icon={Activity}
            color="blue"
            subtitle="Geotechnical observation points"
          />
          <StatCard
            title="Resolved Reports"
            value={summary?.resolvedReports ?? 0}
            icon={CheckCircle}
            color="green"
            subtitle="Stabilized or cleared incidents"
          />
        </div>

        {/* 2. Charts Section (Grid: Line chart on left, Status Pie on right) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {/* Chart 1: Recorded Rainfall Over Time (Line Chart) */}
          <div className="card" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)' }}>
                  Rainfall Observations Over Time
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Precipitation (mm) recorded across monitoring stations
                </span>
              </div>
              <TrendingUp size={20} color="var(--color-mountain)" />
            </div>

            <div style={{ flex: 1, width: '100%', height: '280px' }}>
              {charts?.rainfallOverTime && charts.rainfallOverTime.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.rainfallOverTime} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF3EF" />
                    <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#5A6D63' }} />
                    <YAxis unit="mm" tick={{ fontSize: 12, fill: '#5A6D63' }} />
                    <Tooltip
                      contentStyle={{
                        background: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-md)',
                      }}
                      formatter={(val, name, item) => [`${val} mm`, `${item.payload.location} (${item.payload.district})`]}
                    />
                    <Line
                      type="monotone"
                      dataKey="rainfall"
                      stroke="#436850"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#12372A' }}
                      activeDot={{ r: 6, fill: '#D94F45' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  No temporal rainfall data recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* Chart 2: Report Status Distribution (Doughnut / Pie Chart) */}
          <div className="card" style={{ minHeight: '380px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)' }}>
                Hazard Report Status Distribution
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Categorization of community and field reports
              </span>
            </div>

            <div style={{ flex: 1, width: '100%', height: '280px' }}>
              {charts?.reportStatusDistribution &&
              charts.reportStatusDistribution.some((item) => item.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={charts.reportStatusDistribution}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {charts.reportStatusDistribution.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={STATUS_COLORS[entry.name] || '#9CA3AF'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  No reports logged in database.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. District Distribution & Risk Level Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {/* Chart 3: Reports by District (Bar Chart) */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.25rem' }}>
              Reports by District
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '1.25rem' }}>
              Frequency of reported incidents by geographic jurisdiction
            </span>

            <div style={{ width: '100%', height: '260px' }}>
              {charts?.reportsByDistrict && charts.reportsByDistrict.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.reportsByDistrict} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF3EF" vertical={false} />
                    <XAxis
                      dataKey="district"
                      angle={-25}
                      textAnchor="end"
                      interval={0}
                      tick={{ fontSize: 11, fill: '#5A6D63' }}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#5A6D63' }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(67, 104, 80, 0.08)' }}
                      contentStyle={{
                        background: '#FFFFFF',
                        border: '1px solid var(--color-border)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="reports" fill="#1E4D3B" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  No district reports available.
                </div>
              )}
            </div>
          </div>

          {/* Risk Level Distribution Cards */}
          <div className="card">
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary-dark)', marginBottom: '0.25rem' }}>
              Monitoring Records Risk Level Breakdown
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '1.25rem' }}>
              Distribution of current monitored slope assessments
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              {charts?.riskLevelDistribution?.map((item) => (
                <div
                  key={item.riskLevel}
                  style={{
                    background: '#F8FAF7',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <RiskBadge level={item.riskLevel} />
                  <div style={{ marginTop: '0.75rem', fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary-dark)' }}>
                    {item.count}
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--color-text-muted)', marginLeft: '0.3rem' }}>
                      stations
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: 'rgba(67, 104, 80, 0.08)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-mountain)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} />
              <span>Risk assessments are manually recorded or demonstration entries until the AABHAS ML model is connected.</span>
            </div>
          </div>
        </div>

        {/* 4. Recent Tables Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Recent Hazard Reports */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>
                Recent Hazard Reports
              </h3>
              <Link to="/monitoring" style={{ fontSize: '0.85rem', color: 'var(--color-mountain)', fontWeight: 600 }}>
                View All &rarr;
              </Link>
            </div>

            {recentReports && recentReports.length > 0 ? (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title & Location</th>
                      <th>Category</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((rep) => (
                      <tr key={rep._id}>
                        <td>
                          <strong style={{ display: 'block', color: 'var(--color-primary-dark)' }}>
                            {rep.title}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                            {rep.location}, {rep.district}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-charcoal)' }}>
                            {rep.hazardType}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge status-${rep.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {rep.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                No hazard reports logged yet.
              </div>
            )}
          </div>

          {/* Active Advisories */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>
                Active Warnings & Advisories
              </h3>
              <Link to="/alerts" style={{ fontSize: '0.85rem', color: 'var(--color-mountain)', fontWeight: 600 }}>
                View All &rarr;
              </Link>
            </div>

            {recentAlerts && recentAlerts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentAlerts.map((alt) => (
                  <div
                    key={alt._id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: '#F8FAF7',
                      border: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <RiskBadge level={alt.riskLevel} />
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          {alt.location}, {alt.district}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                        {alt.title}
                      </div>
                    </div>

                    <Link to={`/alerts/${alt._id}`} className="btn btn-outline btn-sm">
                      Details
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                No active advisories published.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
