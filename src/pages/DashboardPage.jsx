// src/pages/DashboardPage.jsx
import React from 'react';
import DashboardOverview from '../components/DashboardOverview';
import { useAuth } from '../hooks/useAuth';

function DashboardPage() {
  const { user, logout } = useAuth();

  return <DashboardOverview user={user} logout={logout} />;
}

export default DashboardPage;