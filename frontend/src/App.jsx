import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import RiskMonitoring from './pages/RiskMonitoring';
import ReportHazard from './pages/ReportHazard';
import Alerts from './pages/Alerts';
import AlertDetails from './pages/AlertDetails';
import SafetyGuidelines from './pages/SafetyGuidelines';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      {/* Public Pages Layout */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitoring" element={<RiskMonitoring />} />
        <Route path="/report" element={<ReportHazard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/alerts/:id" element={<AlertDetails />} />
        <Route path="/guidelines" element={<SafetyGuidelines />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Protected Admin Console Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminPanel />} />
      </Route>
    </Routes>
  );
}

export default App;
