import { routes } from 'admin/Router';
import { useAuth } from 'context/auth.context';
import { Layout } from 'pages/Layout';
import { Login } from 'pages/Login';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function PublicPage() {
  return <h3>Public</h3>;
}

function ProtectedPage() {
  return <h3>Protected</h3>;
}

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const location = useLocation();
  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

const MainRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/mypage',
        element: <PublicPage />,
      },
      {
        path: '/protected',
        element: (
          <RequireAuth>
            <ProtectedPage />
          </RequireAuth>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
];

const Routes = [...MainRoutes, ...routes];
export { Routes };
