import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthStore';
import Sidebar, { SidebarProvider, useSidebar } from './components/Sidebar';
import { RequireAdmin, RequireUser } from './components/ProtectedRoute';
import ChartDetail from './pages/ChartDetail';
import WorkQueue from './pages/WorkQueue';
import DocumentIngestion from './pages/DocumentIngestionPage';
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import AdminAccounts from './pages/AdminAccounts';

const UserLayout = ({ children }) => {
  const { isCollapsed } = useSidebar();
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className={`transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-[72px]' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  );
};

const UserArea = () => (
  <SidebarProvider>
    <UserLayout>
      <Routes>
        <Route path="/work-queue" element={<WorkQueue />} />
        <Route path="/document-ingestion" element={<DocumentIngestion />} />
        <Route path="/chart/:chartNumber" element={<ChartDetail />} />
        <Route path="*" element={<Navigate to="/document-ingestion" replace />} />
      </Routes>
    </UserLayout>
  </SidebarProvider>
);

const RootRedirect = () => {
  const { isAuthenticated, isAdmin, isUser } = useAuth();
  if (isAuthenticated && isAdmin) return <Navigate to="/admin/accounts" replace />;
  if (isAuthenticated && isUser) return <Navigate to="/document-ingestion" replace />;
  return <Navigate to="/login" replace />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RootRedirect />} />
    <Route path="/login" element={<UserLogin />} />
    <Route path="/admin/login" element={<AdminLogin />} />

    <Route path="/admin/accounts" element={<RequireAdmin><AdminAccounts /></RequireAdmin>} />
    <Route path="/admin" element={<Navigate to="/admin/accounts" replace />} />

    <Route path="/*" element={<RequireUser><UserArea /></RequireUser>} />
  </Routes>
);

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
