import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../api/clerkApi';
import ClerkDashboard from '../components/ClerkDashboard';

const ClerkDashboardPage: React.FC = () => {
  // אם לא מחובר, הפנה לדף התחברות
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <ClerkDashboard />;
};

export default ClerkDashboardPage;
