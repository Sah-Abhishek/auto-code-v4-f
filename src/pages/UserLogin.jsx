import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Stethoscope, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../store/AuthStore';

const UserLogin = () => {
  const navigate = useNavigate();
  const { userLogin, loading, error, clearError, isAuthenticated, isUser } = useAuth();

  const [code, setCode] = useState('');

  useEffect(() => {
    if (isAuthenticated && isUser) navigate('/document-ingestion', { replace: true });
  }, [isAuthenticated, isUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    const result = await userLogin(code.trim().toUpperCase());
    if (result.success) navigate('/document-ingestion', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/25 mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">MedCode AI</h1>
          <p className="text-slate-500">Enter your access code to continue</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Access Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => { setCode(e.target.value.toUpperCase()); clearError(); }}
                  placeholder="XXXX-XXXX-XXXX"
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono tracking-wider uppercase placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>
              <p className="text-xs text-slate-500 pl-1">Enter the code provided by your administrator</p>
            </div>

            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</> : <>Continue →</>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <a href="/admin/login" className="text-sm text-slate-500 hover:text-slate-700">
              Administrator login →
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Contact your administrator if you need an access code
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
