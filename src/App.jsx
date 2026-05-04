import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthStore';
import Sidebar, { SidebarProvider, useSidebar } from './components/Sidebar';
import { RequireAdmin, RequireUser } from './components/ProtectedRoute';
import ChartDetail from './pages/ChartDetail';
import WorkQueue from './pages/WorkQueue';
import DocumentIngestion from './pages/DocumentIngestionPage';
import AdminLogin from './pages/AdminLogin';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import AdminAccounts from './pages/AdminAccounts';
import AdminAccountProfile from './pages/AdminAccountProfile';
import Analytics from './pages/Analytics';

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

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/verify-email" element={<VerifyEmail />} />
    <Route path="/admin/login" element={<AdminLogin />} />

    <Route path="/admin/accounts" element={<RequireAdmin><AdminAccounts /></RequireAdmin>} />
    <Route path="/admin/accounts/:code" element={<RequireAdmin><AdminAccountProfile /></RequireAdmin>} />
    <Route path="/admin/charts/:chartNumber" element={<RequireAdmin><ChartDetail adminView /></RequireAdmin>} />
    <Route path="/admin/analytics" element={<RequireAdmin><Analytics /></RequireAdmin>} />
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
