import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import CourseDetail from './components/CourseDetail';
import GradingView from './components/GradingView';
import { MockAPI } from './services/mockData';
import { User } from './types';

const App: React.FC = () => {
  // Simulate Auth State
  const [user] = useState<User>(MockAPI.getCurrentUser());

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/course/:id/grade/:assignmentId" element={<GradingView />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;