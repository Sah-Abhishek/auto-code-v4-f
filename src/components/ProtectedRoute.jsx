import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/AuthStore';

export const RequireAdmin = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) return <Navigate to="/login" replace />;
  return children;
};

export const RequireUser = ({ children }) => {
  const { isAuthenticated, isUser } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isUser) return <Navigate to="/admin/login" replace />;
  return children;
};

export const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};
