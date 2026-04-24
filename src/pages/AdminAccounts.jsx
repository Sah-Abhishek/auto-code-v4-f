import { useState, useEffect, useCallback } from 'react';
import {
  Users, UserPlus, Copy, Check, Ban, Search, Shield, Loader2,
  AlertCircle, CheckCircle2, X, Calendar, FileText, Clock, LogOut,
  BarChart3, TrendingUp, Mail, Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../store/AuthStore';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

const StatusBadge = ({ status }) => {
  const map = {
    active: { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Active' },
    revoked: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Revoked' },
    expired: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Expired' },
    exhausted: { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500', label: 'Exhausted' }
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

  const [showCreate, setShowCreate] = useState(false);
  const [createdCode, setCreatedCode] = useState(null);
  const [emailStatus, setEmailStatus] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    userName: '', clientName: '', speciality: '', designation: '', email: '',
    processLimit: 50, validDays: 30
  });

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

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setEmailStatus(null); setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to create account');
        return;
      }
      setCreatedCode(data.account);
      setEmailStatus(data.email || null);
      if (data.email?.sent) {
        setSuccess(`Account created. Access code emailed to ${data.account.email}.`);
      } else if (form.email) {
        setSuccess('Account created, but the welcome email could not be sent. Share the access code manually.');
      } else {
        setSuccess('Account created. Share the access code below with the user.');
      }
      setForm({ userName: '', clientName: '', speciality: '', designation: '', email: '', processLimit: 50, validDays: 30 });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (code) => {
    if (!confirm(`Revoke access for code ${code}? This cannot be undone.`)) return;
    setError(''); setSuccess('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/accounts/${code}/revoke`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Revoke failed');
        return;
      }
      setSuccess('Access revoked');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const copyCode = async (code) => {
    if (!code) return;
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        ok = true;
      } else {
        const ta = document.createElement('textarea');
        ta.value = code;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        ok = document.execCommand('copy');
        document.body.removeChild(ta);
      }
    } catch (err) {
      console.error('Copy failed:', err);
      ok = false;
    }
    if (ok) {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode((c) => (c === code ? null : c)), 2000);
    } else {
      setError('Copy failed. Please select and copy the code manually.');
    }
  };

  const filtered = accounts.filter(a => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      a.code.toLowerCase().includes(s) ||
      (a.userName || '').toLowerCase().includes(s) ||
      (a.clientName || '').toLowerCase().includes(s) ||
      (a.speciality || '').toLowerCase().includes(s)
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
              placeholder="Search by code, name, client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            />
          </div>
          <button
            onClick={() => { setCreatedCode(null); setShowCreate(true); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-5 h-5" />
            New Account
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-slate-500">Loading accounts...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-500">No accounts yet. Create the first one.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">User</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Access code</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Usage</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Valid until</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(a => (
                    <tr key={a.code} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">{a.userName}</p>
                        <p className="text-sm text-slate-500">
                          {a.clientName}{a.speciality ? ` · ${a.speciality}` : ''}
                        </p>
                        {a.designation && <p className="text-xs text-slate-400">{a.designation}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded">{a.code}</code>
                          <button
                            type="button"
                            onClick={() => copyCode(a.code)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                            title={copiedCode === a.code ? 'Copied' : 'Copy code'}
                          >
                            {copiedCode === a.code
                              ? <Check className="w-3.5 h-3.5 text-emerald-600" />
                              : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        {a.email && (
                          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {a.email}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-900">
                          {a.processUsed} / {a.processLimit}
                        </p>
                        <p className="text-xs text-slate-500">{a.processRemaining} remaining</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">
                          {new Date(a.validUntil).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500">{a.validDays} day validity</p>
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
                          {!a.revoked ? (
                            <button
                              onClick={() => handleRevoke(a.code)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Ban className="w-4 h-4" />
                              Revoke
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 px-2">
                              Revoked {new Date(a.revokedAt).toLocaleDateString()}
                            </span>
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

      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-slate-900">
                {createdCode ? 'Access code generated' : 'Create new account'}
              </h2>
              <button onClick={() => { setShowCreate(false); setCreatedCode(null); }} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {createdCode ? (
              <div className="p-6 space-y-4">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl text-center">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Access code for {createdCode.user_name}</p>
                  <p className="text-2xl font-mono font-bold text-slate-900 tracking-wider mb-3">{createdCode.code}</p>
                  <button
                    type="button"
                    onClick={() => copyCode(createdCode.code)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 text-sm font-medium"
                  >
                    {copiedCode === createdCode.code
                      ? <><Check className="w-4 h-4" /> Copied</>
                      : <><Copy className="w-4 h-4" /> Copy code</>}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Process limit</p>
                    <p className="font-semibold text-slate-900">{createdCode.process_limit} runs</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500">Valid for</p>
                    <p className="font-semibold text-slate-900">{createdCode.valid_days} days</p>
                  </div>
                </div>
                {emailStatus?.sent ? (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5" />
                    <span>Welcome email sent to <span className="font-medium">{createdCode.email}</span>.</span>
                  </div>
                ) : createdCode.email ? (
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <span>Email not sent{emailStatus?.reason ? ` (${emailStatus.reason})` : ''}. Please share the access code manually.</span>
                  </div>
                ) : null}
                <p className="text-xs text-slate-500 text-center">
                  Share this code with the user. They will use it at the user login page to access the portal.
                </p>
                <button
                  onClick={() => { setShowCreate(false); setCreatedCode(null); setEmailStatus(null); }}
                  className="w-full py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">User name *</label>
                    <input
                      type="text" required
                      value={form.userName}
                      onChange={(e) => setForm({ ...form, userName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Client name *</label>
                    <input
                      type="text" required
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Speciality</label>
                    <input
                      type="text"
                      value={form.speciality}
                      onChange={(e) => setForm({ ...form, speciality: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    <Mail className="w-3.5 h-3.5 inline mr-1" />
                    User email
                  </label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    If provided, the access code and login link are emailed to the user.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <FileText className="w-3.5 h-3.5 inline mr-1" />
                      Document process runs *
                    </label>
                    <input
                      type="number" required min="1"
                      value={form.processLimit}
                      onChange={(e) => setForm({ ...form, processLimit: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">Number of times user can run processing</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      <Calendar className="w-3.5 h-3.5 inline mr-1" />
                      Valid days *
                    </label>
                    <input
                      type="number" required min="1"
                      value={form.validDays}
                      onChange={(e) => setForm({ ...form, validDays: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                    <p className="text-xs text-slate-500 mt-1">Account expires after this many days</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2.5 text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                    Cancel
                  </button>
                  <button
                    type="submit" disabled={submitting}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <>Create &amp; generate code</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccounts;
