// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Facilities from './ResidentDashboard/AvailableFacilities/Facilities';
import Dashboard from './ResidentDashboard/HomePage/Dashboard';
import Maintenance from './ResidentDashboard/FacilitiesMaintenance/Maintenance';
import Events from './ResidentDashboard/UpcomingEvents/Events';

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/events" element={<Events />} />
        <Route path="/facilities" element={<Facilities />} />
      </Routes>
    </Router>
  );
};

export default App;
