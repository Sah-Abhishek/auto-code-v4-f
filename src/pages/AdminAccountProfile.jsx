import { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Shield, Users, BarChart3, LogOut, FileText, Loader2,
  AlertCircle, Calendar, Mail, Building, Hash, Clock, CheckCircle2,
  Edit3, XCircle, PlusCircle, ChevronRight, Eye
} from 'lucide-react';
import { useAuth } from '../store/AuthStore';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

const ACTION_STYLES = {
  modified: { icon: Edit3, cls: 'text-amber-700 bg-amber-50 border-amber-200', label: 'Modified' },
  rejected: { icon: XCircle, cls: 'text-red-700 bg-red-50 border-red-200', label: 'Rejected' },
  added: { icon: PlusCircle, cls: 'text-emerald-700 bg-emerald-50 border-emerald-200', label: 'Added' }
};

const StatusBadge = ({ status }) => {
  const map = {
    active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active' },
    revoked: { bg: 'bg-red-100', text: 'text-red-700', label: 'Revoked' },
    expired: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Expired' },
    exhausted: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Exhausted' }
  };
  const s = map[status] || map.active;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
};

const ReviewStatusBadge = ({ status }) => {
  const map = {
    submitted: 'bg-emerald-100 text-emerald-700',
    in_review: 'bg-blue-100 text-blue-700',
    pending: 'bg-slate-100 text-slate-700',
    rejected: 'bg-red-100 text-red-700'
  };
  const label = (status || 'pending').replace('_', ' ');
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${map[status] || map.pending}`}>
      {label}
    </span>
  );
};

const formatCode = (value) => {
  if (!value) return '—';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return value.code || value.description || JSON.stringify(value);
  }
  return String(value);
};

const formatDescription = (value) => {
  if (!value || typeof value !== 'object') return '';
  return value.description || '';
};

const AdminAccountProfile = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [account, setAccount] = useState(null);
  const [charts, setCharts] = useState([]);
  const [corrections, setCorrections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('charts');
  const [openCategory, setOpenCategory] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [acc, ch, co] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/accounts/${code}`).then(r => r.json()),
        fetch(`${API_BASE_URL}/admin/accounts/${code}/charts`).then(r => r.json()),
        fetch(`${API_BASE_URL}/admin/accounts/${code}/corrections`).then(r => r.json())
      ]);
      if (!acc.success) throw new Error(acc.error || 'Failed to load account');
      if (!ch.success) throw new Error(ch.error || 'Failed to load charts');
      if (!co.success) throw new Error(co.error || 'Failed to load corrections');
      setAccount(acc.account);
      setCharts(ch.charts || []);
      setCorrections(co);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => { load(); }, [load]);

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
              <p className="text-xs text-slate-500">Account profile</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/accounts" className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
              <Users className="w-4 h-4" /> Accounts
            </Link>
            <Link to="/admin/analytics" className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
              <BarChart3 className="w-4 h-4" /> Analytics
            </Link>
            <button onClick={logout} className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <button
          onClick={() => navigate('/admin/accounts')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" /> Back to accounts
        </button>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-red-800 flex-1">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-slate-500">Loading account...</p>
          </div>
        ) : account && (
          <>
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-slate-900">{account.userName}</h2>
                    <StatusBadge status={account.status} />
                  </div>
                  <p className="text-sm text-slate-500">
                    {account.clientName}{account.speciality ? ` · ${account.speciality}` : ''}{account.designation ? ` · ${account.designation}` : ''}
                  </p>
                  <div className="flex items-center gap-4 pt-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /><code className="font-mono text-slate-700">{account.code}</code></span>
                    {account.email && <span className="inline-flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{account.email}</span>}
                    <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />Valid until {new Date(account.validUntil).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 min-w-[360px]">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500">Charts</p>
                    <p className="text-xl font-semibold text-slate-900">{charts.length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500">Processing</p>
                    <p className="text-xl font-semibold text-slate-900">{account.processUsed} <span className="text-slate-400 text-sm font-normal">/ {account.processLimit}</span></p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="text-xs text-slate-500">Corrections</p>
                    <p className="text-xl font-semibold text-slate-900">{corrections?.totals?.total || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setTab('charts')}
                  className={`px-6 py-3 text-sm font-medium ${tab === 'charts' ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50/40' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Uploaded Charts ({charts.length})
                </button>
                <button
                  onClick={() => setTab('corrections')}
                  className={`px-6 py-3 text-sm font-medium ${tab === 'corrections' ? 'text-blue-700 border-b-2 border-blue-600 bg-blue-50/40' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Code Corrections ({corrections?.totals?.total || 0})
                </button>
              </div>

              {tab === 'charts' && (
                <div>
                  {charts.length === 0 ? (
                    <div className="p-12 text-center">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500">This account has not uploaded any charts yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Chart</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Facility / Specialty</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Review</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Corrections</th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Uploaded</th>
                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {charts.map(c => (
                            <tr key={c.chartNumber} className="hover:bg-slate-50">
                              <td className="px-6 py-3">
                                <p className="font-medium text-slate-900">{c.chartNumber}</p>
                                <p className="text-xs text-slate-500">MRN {c.mrn || '—'}</p>
                              </td>
                              <td className="px-6 py-3">
                                <p className="text-sm text-slate-700 inline-flex items-center gap-1.5"><Building className="w-3.5 h-3.5 text-slate-400" />{c.facility || '—'}</p>
                                {c.specialty && <p className="text-xs text-slate-500">{c.specialty}</p>}
                              </td>
                              <td className="px-6 py-3"><ReviewStatusBadge status={c.reviewStatus} /></td>
                              <td className="px-6 py-3">
                                <span className={`text-sm font-medium ${c.correctionCount > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                                  {c.correctionCount}
                                </span>
                              </td>
                              <td className="px-6 py-3 text-sm text-slate-500 inline-flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                {new Date(c.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-3 text-right">
                                <Link
                                  to={`/admin/charts/${c.chartNumber}`}
                                  state={{ from: `/admin/accounts/${code}` }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-50 rounded-lg"
                                >
                                  <Eye className="w-4 h-4" /> Open
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {tab === 'corrections' && corrections && (
                <div className="p-6 space-y-4">
                  {(corrections.totals?.total || 0) === 0 ? (
                    <div className="p-12 text-center">
                      <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500">No code corrections submitted by this account yet.</p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <p className="text-xs text-slate-500">Total corrections</p>
                          <p className="text-xl font-semibold text-slate-900">{corrections.totals.total}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                          <p className="text-xs text-amber-700">Modified</p>
                          <p className="text-xl font-semibold text-amber-900">{corrections.totals.modified}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                          <p className="text-xs text-red-700">Rejected</p>
                          <p className="text-xl font-semibold text-red-900">{corrections.totals.rejected}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                          <p className="text-xs text-emerald-700">Added</p>
                          <p className="text-xl font-semibold text-emerald-900">{corrections.totals.added}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {corrections.categories.map(cat => {
                          const isOpen = openCategory === cat.key;
                          return (
                            <div key={cat.key} className="border border-slate-200 rounded-xl overflow-hidden">
                              <button
                                onClick={() => setOpenCategory(isOpen ? null : cat.key)}
                                className="w-full flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50"
                              >
                                <div className="flex items-center gap-3">
                                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                                  <span className="font-medium text-slate-900">{cat.label}</span>
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-medium">{cat.total}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                  {cat.actions.modified > 0 && <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">{cat.actions.modified} modified</span>}
                                  {cat.actions.rejected > 0 && <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">{cat.actions.rejected} rejected</span>}
                                  {cat.actions.added > 0 && <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">{cat.actions.added} added</span>}
                                </div>
                              </button>
                              {isOpen && (
                                <div className="border-t border-slate-200 bg-slate-50/50">
                                  {cat.items.length === 0 ? (
                                    <p className="p-4 text-sm text-slate-500">No corrections in this category.</p>
                                  ) : (
                                    <ul className="divide-y divide-slate-200">
                                      {cat.items.map((item, idx) => {
                                        const style = ACTION_STYLES[item.action] || ACTION_STYLES.modified;
                                        const Icon = style.icon;
                                        return (
                                          <li key={`${item.chartNumber}-${idx}`} className="px-4 py-3 bg-white">
                                            <div className="flex items-start justify-between gap-4">
                                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${style.cls}`}>
                                                  <Icon className="w-3 h-3" /> {style.label}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                  {item.action !== 'added' && item.original && (
                                                    <p className="text-sm text-slate-700">
                                                      <span className="text-slate-400 mr-1">From:</span>
                                                      <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{formatCode(item.original)}</code>
                                                      {formatDescription(item.original) && <span className="text-xs text-slate-500 ml-2">{formatDescription(item.original)}</span>}
                                                    </p>
                                                  )}
                                                  {item.modified && (
                                                    <p className="text-sm text-slate-700 mt-0.5">
                                                      <span className="text-slate-400 mr-1">{item.action === 'added' ? 'Added:' : 'To:'}</span>
                                                      <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{formatCode(item.modified)}</code>
                                                      {formatDescription(item.modified) && <span className="text-xs text-slate-500 ml-2">{formatDescription(item.modified)}</span>}
                                                    </p>
                                                  )}
                                                  {item.reason && <p className="text-xs text-slate-500 mt-1">Reason: {item.reason}</p>}
                                                  {item.comment && <p className="text-xs text-slate-500 italic mt-0.5">“{item.comment}”</p>}
                                                </div>
                                              </div>
                                              <div className="text-right shrink-0">
                                                <Link
                                                  to={`/admin/charts/${item.chartNumber}`}
                                                  state={{ from: `/admin/accounts/${code}` }}
                                                  className="text-xs text-blue-700 hover:underline"
                                                >
                                                  {item.chartNumber}
                                                </Link>
                                                {item.submittedAt && (
                                                  <p className="text-xs text-slate-400 mt-0.5">{new Date(item.submittedAt).toLocaleDateString()}</p>
                                                )}
                                              </div>
                                            </div>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAccountProfile;
