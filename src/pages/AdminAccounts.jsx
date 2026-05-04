import { useState, useEffect, useCallback } from 'react';
import {
  Users, Ban, Search, Shield, Loader2,
  AlertCircle, CheckCircle2, X, FileText, LogOut,
  BarChart3, TrendingUp, Mail, Eye, ShieldCheck, MailCheck, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthStore';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

const StatusBadge = ({ status }) => {
  const map = {
    active:    { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Active' },
    revoked:   { bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500',     label: 'Revoked' },
    expired:   { bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500',   label: 'Expired' },
    exhausted: { bg: 'bg-slate-100',   text: 'text-slate-700',   dot: 'bg-slate-500',   label: 'Exhausted' }
  };
  const s = map[status] || map.active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const AdminAccounts = () => {
  const { logout } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [busyCode, setBusyCode] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [accRes, anaRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/accounts`),
        fetch(`${API_BASE_URL}/admin/analytics`)
      ]);
      const accData = await accRes.json();
      const anaData = await anaRes.json();
      if (accData.success) setAccounts(accData.accounts);
      if (anaData.success) setAnalytics(anaData.analytics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRevoke = async (a) => {
    if (!confirm(`Revoke access for ${a.userName || a.email}?`)) return;
    setError(''); setSuccess(''); setBusyCode(a.code);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/accounts/${a.code}/revoke`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Revoke failed');
        return;
      }
      setSuccess(`Access revoked for ${a.userName || a.email}.`);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyCode(null);
    }
  };

  const handleAllow = async (a) => {
    setError(''); setSuccess(''); setBusyCode(a.code);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/accounts/${a.code}/unrevoke`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Allow failed');
        return;
      }
      setSuccess(`Access restored for ${a.userName || a.email}.`);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyCode(null);
    }
  };

  const filtered = accounts.filter(a => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (a.userName || '').toLowerCase().includes(s) ||
      (a.email || '').toLowerCase().includes(s) ||
      (a.clientName || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Admin Portal</h1>
              <p className="text-xs text-slate-500">Account management &amp; analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/admin/accounts"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-900 bg-slate-100 rounded-lg"
            >
              <Users className="w-4 h-4" /> Accounts
            </Link>
            <Link
              to="/admin/messages"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Messages
            </Link>
            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4" /> Analytics
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-red-800 flex-1">{error}</p>
            <button onClick={() => setError('')}><X className="w-4 h-4 text-red-600" /></button>
          </div>
        )}
        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
            <p className="text-emerald-800 flex-1">{success}</p>
            <button onClick={() => setSuccess('')}><X className="w-4 h-4 text-emerald-600" /></button>
          </div>
        )}

        {analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5 text-slate-400" />
                <span className="text-xs text-slate-500">Total users</span>
              </div>
              <p className="text-2xl font-semibold text-slate-900">{analytics.users.total}</p>
              <p className="text-xs text-slate-500 mt-1">
                {analytics.users.active} active · {analytics.users.revoked} revoked
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-slate-400" />
                <span className="text-xs text-slate-500">Processing runs</span>
              </div>
              <p className="text-2xl font-semibold text-slate-900">
                {analytics.processing.total_used} <span className="text-slate-400 text-lg">/ {analytics.processing.total_allotted}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">used / allotted</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-slate-400" />
                <span className="text-xs text-slate-500">Charts</span>
              </div>
              <p className="text-2xl font-semibold text-slate-900">{analytics.charts.total_charts || 0}</p>
              <p className="text-xs text-slate-500 mt-1">
                {analytics.charts.submitted || 0} submitted · {analytics.charts.failed || 0} failed
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-5 h-5 text-slate-400" />
                <span className="text-xs text-slate-500">Ready charts</span>
              </div>
              <p className="text-2xl font-semibold text-slate-900">{analytics.charts.ready || 0}</p>
              <p className="text-xs text-slate-500 mt-1">AI processing complete</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or organization…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
          <p className="text-sm text-slate-500">
            {filtered.length} {filtered.length === 1 ? 'user' : 'users'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-slate-500">Loading users...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">No users yet. Users appear here after they sign up.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Email</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Usage</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Joined</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(a => (
                    <tr key={a.code} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{a.userName || '—'}</p>
                        {(a.clientName || a.speciality) && (
                          <p className="text-sm text-slate-500">
                            {[a.clientName, a.speciality].filter(Boolean).join(' · ')}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[220px]">{a.email || '—'}</span>
                        </div>
                        <div className="mt-1">
                          {a.emailVerified ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                              <MailCheck className="w-3 h-3" /> verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                              <AlertCircle className="w-3 h-3" /> unverified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {a.processUsed} / {a.processLimit}
                        </p>
                        <p className="text-xs text-slate-500">{a.processRemaining} remaining</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">
                          {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}
                        </p>
                        {a.lastLoginAt && (
                          <p className="text-xs text-slate-500">
                            last login {new Date(a.lastLoginAt).toLocaleDateString()}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={a.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            to={`/admin/accounts/${a.code}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Link>
                          {a.revoked ? (
                            <button
                              onClick={() => handleAllow(a)}
                              disabled={busyCode === a.code}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-emerald-700 hover:bg-emerald-50 rounded-lg disabled:opacity-60"
                            >
                              {busyCode === a.code
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <ShieldCheck className="w-4 h-4" />}
                              Allow
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRevoke(a)}
                              disabled={busyCode === a.code}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-60"
                            >
                              {busyCode === a.code
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Ban className="w-4 h-4" />}
                              Revoke
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAccounts;
