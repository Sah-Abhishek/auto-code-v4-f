import { useState } from 'react';
import { X, Loader2, Check, TrendingUp, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

/**
 * Modal for setting an account's upload/processing limits.
 * Lets the admin type exact values for the run limit and runs used,
 * then Apply. Calls onSaved with the updated counters on success.
 */
const EditLimitsModal = ({ account, onClose, onSaved }) => {
  const [limit, setLimit] = useState(String(account.processLimit ?? 0));
  const [used, setUsed] = useState(String(account.processUsed ?? 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const limitNum = Number(limit);
  const usedNum = Number(used);
  const limitValid = limit !== '' && Number.isInteger(limitNum) && limitNum >= 0;
  const usedValid = used !== '' && Number.isInteger(usedNum) && usedNum >= 0;
  const valid = limitValid && usedValid;
  const remaining = valid ? Math.max(0, limitNum - usedNum) : null;
  const changed = valid && (limitNum !== account.processLimit || usedNum !== account.processUsed);

  const apply = async (e) => {
    e?.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/admin/accounts/${account.code}/process`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ processLimit: limitNum, processUsed: usedNum })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Update failed');
      onSaved(data.account);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
      <form
        onSubmit={apply}
        className="relative bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Upload limits</h3>
              <p className="text-xs text-slate-500 truncate max-w-[240px]">
                {account.userName || account.email || account.code}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Upload limit (allotted runs)</label>
            <input
              type="number"
              min="0"
              step="1"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${limitValid ? 'border-slate-200' : 'border-red-300'}`}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Runs used</label>
            <input
              type="number"
              min="0"
              step="1"
              value={used}
              onChange={(e) => setUsed(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${usedValid ? 'border-slate-200' : 'border-red-300'}`}
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-sm">
          <span className="text-slate-500">Remaining after apply</span>
          <span className={`font-semibold ${remaining === 0 ? 'text-amber-700' : 'text-slate-900'}`}>
            {remaining === null ? '—' : remaining}
          </span>
        </div>

        {!valid && (
          <p className="text-xs text-red-600">Both values must be whole numbers of 0 or more.</p>
        )}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800 flex-1">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!valid || !changed || saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Apply
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLimitsModal;
