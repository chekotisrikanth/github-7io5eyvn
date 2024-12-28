import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { ClientDashboard } from '../components/client/ClientDashboard';
import { Dashboard } from '../pages/client/Dashboard';
import { AccountSettings } from '../pages/client/settings/AccountSettings';
import { RequireAuth } from '../components/auth/RequireAuth';

export const clientRoutes: RouteObject[] = [
  {
    path: 'client',
    element: (
      <RequireAuth roles={['client', 'user']}>
        <ClientDashboard />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      // ... other existing routes ...
      {
        path: 'settings',
        element: <AccountSettings />,
      },
    ],
  },
];