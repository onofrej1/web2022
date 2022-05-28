import React from 'react';
import { ProtectedRoute } from 'router/ProtectedRoute';
import { Layout } from './Layout';
import { Resources } from './Resources';

const DashboardComponent = () => {
  return <h1>component</h1>;
};

const resources = [
  {
    path: 'entity/:resource',
    element: (
      <ProtectedRoute>
        <Resources />
      </ProtectedRoute>
    ),
  },
];

const routes = [
  {
    path: '/admin',
    element: <Layout />,
    children: [{ path: 'dashboard', element: <DashboardComponent /> }]
      .concat(resources),
  },
];

export { routes };
