import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../store/AuthStore';

const MainLayout = () => {
  const { refreshUser } = useAuth();

  // Keep the stored user (runs remaining, limits) in sync with the server:
  // admin changes to limits show up without needing to log out and back in.
  useEffect(() => {
    refreshUser();
    const onFocus = () => refreshUser();
    window.addEventListener('focus', onFocus);
    const interval = setInterval(refreshUser, 60_000);
    return () => {
      window.removeEventListener('focus', onFocus);
      clearInterval(interval);
    };
  }, [refreshUser]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - offset by sidebar width (w-64 = 16rem = 256px) */}
      <main className="ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
