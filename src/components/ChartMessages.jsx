import { useEffect, useRef, useState, useCallback } from 'react';
import { MessageSquare, Send, X, Loader2, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
}

export default function ChartMessages({ chartNumber, viewerRole, isOpen, onClose, onUnreadChange }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const scrollerRef = useRef(null);

  const load = useCallback(async () => {
    if (!chartNumber) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/charts/${chartNumber}/messages`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to load messages');
      setMessages(data.messages || []);
      if (onUnreadChange) onUnreadChange(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [chartNumber, onUnreadChange]);

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen, load]);

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async (e) => {
    e?.preventDefault?.();
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/charts/${chartNumber}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to send');
      setMessages((prev) => [...prev, data.message]);
      setDraft('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div
        className="flex-1 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
        <header className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">
                {viewerRole === 'admin' ? 'Conversation with user' : 'Message admin'}
              </h3>
              <p className="text-xs text-slate-500">Chart {chartNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </header>

        <div ref={scrollerRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {loading && messages.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-medium text-slate-700">No messages yet</p>
              <p className="text-xs mt-1">
                {viewerRole === 'admin'
                  ? 'No messages from the user on this chart yet.'
                  : 'Have a question or something not working? Send the admin a message about this chart.'}
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const mine = m.sender_role === viewerRole;
              return (
                <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    mine
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'
                  }`}>
                    <div className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${
                      mine ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {m.sender_name || (m.sender_role === 'admin' ? 'Admin' : 'User')}
                    </div>
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{m.body}</p>
                    <div className={`text-[10px] mt-1 ${mine ? 'text-blue-100' : 'text-slate-400'}`}>
                      {formatTime(m.created_at)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-200 flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        <form onSubmit={send} className="border-t border-slate-200 p-3 bg-white flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(e);
              }
            }}
            rows={2}
            maxLength={4000}
            placeholder={viewerRole === 'admin' ? 'Reply to user...' : 'Write your message...'}
            className="flex-1 resize-none border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          />
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm"
            aria-label="Send"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      </aside>
    </div>
  );
}
