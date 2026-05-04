import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, Users, BarChart3, LogOut, Loader2, MessageSquare,
  AlertCircle, Building, Hash, Mail, ChevronRight, Inbox
} from 'lucide-react';
import { useAuth } from '../store/AuthStore';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

function timeAgo(iso) {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

const AdminMessages = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [threads, setThreads] = useState([]);
  const [totalUnread, setTotalUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/messages/threads`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to load threads');
      setThreads(data.threads || []);
      setTotalUnread(data.totalUnread || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
              <p className="text-xs text-slate-500">Chart messages</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/accounts" className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
              <Users className="w-4 h-4" /> Accounts
            </Link>
            <Link to="/admin/messages" className="inline-flex items-center gap-2 px-3 py-2 text-sm text-blue-700 bg-blue-50 rounded-lg">
              <MessageSquare className="w-4 h-4" /> Messages
              {totalUnread > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-semibold">{totalUnread}</span>
              )}
            </Link>
            <Link to="/admin/analytics" className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
              <BarChart3 className="w-4 h-4" /> Analytics
            </Link>
            <button onClick={logout} className="inline-flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer">
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Chart messages</h2>
            <p className="text-sm text-slate-500 mt-1">
              Conversations users started from a chart. Open a thread to view the chart side-by-side.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-white border border-slate-200">
              <p className="text-xs text-slate-500">Threads</p>
              <p className="text-xl font-semibold text-slate-900">{threads.length}</p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-200">
              <p className="text-xs text-blue-700">Unread</p>
              <p className="text-xl font-semibold text-blue-900">{totalUnread}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-red-800 flex-1">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-slate-500">Loading threads...</p>
          </div>
        ) : threads.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-700 font-medium">No chart messages yet</p>
            <p className="text-sm text-slate-500 mt-1">
              When a user sends a message from a chart, it will appear here.
            </p>
          </div>
        ) : (
          <ul className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {threads.map((t) => {
              const unread = t.unread_count || 0;
              return (
                <li key={t.chart_number}>
                  <button
                    onClick={() => navigate(`/admin/charts/${t.chart_number}`, { state: { from: '/admin/messages', openMessages: true } })}
                    className="w-full text-left flex items-start gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${unread > 0 ? 'bg-blue-100' : 'bg-slate-100'}`}>
                      <MessageSquare className={`w-4 h-4 ${unread > 0 ? 'text-blue-600' : 'text-slate-500'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900">{t.owner_name || 'Unknown user'}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 inline-flex items-center gap-1"><Hash className="w-3 h-3" />{t.chart_number}</span>
                        {t.facility && <span className="text-xs text-slate-500 inline-flex items-center gap-1"><Building className="w-3 h-3" />{t.facility}</span>}
                        {t.owner_email && <span className="text-xs text-slate-500 inline-flex items-center gap-1"><Mail className="w-3 h-3" />{t.owner_email}</span>}
                        {unread > 0 && (
                          <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold">
                            {unread} new
                          </span>
                        )}
                      </div>
                      <p className={`mt-1 text-sm truncate ${unread > 0 ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                        <span className="text-slate-400 mr-1">
                          {t.last_sender_role === 'admin' ? 'You:' : `${t.owner_name || 'User'}:`}
                        </span>
                        {t.last_message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {timeAgo(t.last_message_at)} · {t.message_count} message{t.message_count === 1 ? '' : 's'}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 mt-3 shrink-0" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
