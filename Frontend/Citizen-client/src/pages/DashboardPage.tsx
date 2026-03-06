import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';
import CitizenDashboard from '../components/CitizenDashboard';

const DashboardPage: React.FC = () => {
  const { citizenSummary } = useAppSelector((state) => state.citizen);

  // אם אין אזרח, הפנה לדף הבית
  if (!citizenSummary) {
    return <Navigate to="/" replace />;
  }

  return <CitizenDashboard />;
};

export default DashboardPage;
