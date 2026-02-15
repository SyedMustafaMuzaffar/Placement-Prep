import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import History from './pages/History';
import TestPage from './pages/TestPage';
import ShipPage from './pages/ShipPage';
import ProofPage from './pages/ProofPage';
import { Practice, Assessments, Resources, Profile } from './pages/Placeholders';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/history" element={<History />} />
        <Route path="/prp/07-test" element={<TestPage />} />
        <Route path="/prp/08-ship" element={<ShipPage />} />
        <Route path="/prp/proof" element={<ProofPage />} />

        {/* App Shell Routes */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="practice" element={<Practice />} />
          <Route path="assessments" element={<Assessments />} />
          <Route path="resources" element={<Resources />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
