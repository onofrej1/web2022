import { useAuth } from 'context/auth.context';
import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAuth();
  const location = useLocation();
  if (!auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export { ProtectedRoute };
