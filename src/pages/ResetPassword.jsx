import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Lock, Eye, EyeOff,
  AlertCircle, Loader2, Check
} from 'lucide-react';
import { useAuth } from '../store/AuthStore';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { resetPassword } = useAuth();

  const token = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState('idle'); // idle | submitting | success
  const [serverError, setServerError] = useState(null);

  const setFieldError = (field, msg) =>
    setErrors((e) => ({ ...e, [field]: msg }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (confirm !== password) next.confirm = "Passwords don't match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitState('submitting');
    setServerError(null);

    const result = await resetPassword(token, password);
    if (result.success) {
      setSubmitState('success');
      setTimeout(() => navigate('/login?reset=1', { replace: true }), 1200);
      return;
    }
    setSubmitState('idle');
    setServerError(result.error || 'Could not reset your password.');
  };

  return (
    <div className="marketing min-h-screen flex flex-col">
      <a href="#main" className="skip-link">Skip to main content</a>

      <header className="border-b border-[#E2E8F0] bg-[#F8FAFC]/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-baseline gap-0.5" aria-label="Nxtcodeai home">
            <span className="display text-xl font-semibold text-[#0F172A]">Nxtcode</span>
            <span className="text-[0.95rem] font-semibold text-[#0369A1]">ai</span>
          </Link>
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#334155] hover:text-[#0F172A] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </div>
      </header>

      <main id="main" className="flex-1 flex items-center justify-center py-12 sm:py-16 lg:py-20 px-6">
        <div className="w-full max-w-md">
          {!token ? (
            <div className="text-center anim-rise">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-50 ring-1 ring-red-200 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="display text-3xl font-semibold mt-6 text-[#020617]">This link looks incomplete.</h1>
              <p className="text-[#334155] mt-3">The reset link is missing its token. Request a fresh one to continue.</p>
              <div className="mt-7">
                <Link to="/forgot-password" className="inline-flex items-center justify-center gap-2 bg-[#0369A1] hover:bg-[#075985] text-white font-medium px-6 py-3 rounded-md shadow-cta transition-colors">
                  Request a new link <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : submitState === 'success' ? (
            <div className="text-center anim-rise">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="display text-3xl font-semibold mt-6 text-[#020617]">Password updated.</h1>
              <p className="text-[#334155] mt-3">Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <div className="anim-rise">
                <p className="eyebrow text-[#0369A1]">Almost there</p>
                <h1 className="display text-4xl sm:text-5xl font-semibold leading-[1.05] mt-3 text-[#020617]">
                  Set a new password.
                </h1>
                <p className="text-base text-[#334155] leading-relaxed mt-4">
                  Choose a strong password you don't use anywhere else. At least 8 characters.
                </p>
              </div>

              {serverError && (
                <div className="mt-6 flex items-start gap-3 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <span>{serverError}</span>
                    <div className="mt-1">
                      <Link to="/forgot-password" className="underline font-medium hover:no-underline">Request a new link</Link>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5 anim-rise" style={{ animationDelay: '100ms' }} noValidate>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[#020617] mb-1.5">New password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                    <input
                      id="password"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setFieldError('password', null); }}
                      placeholder="At least 8 characters"
                      className={`field pl-10 pr-11 ${errors.password ? 'field-error' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-[#64748B] hover:text-[#334155] hover:bg-[#E8ECF1] transition-colors"
                    >
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm" className="block text-sm font-medium text-[#020617] mb-1.5">Confirm new password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                    <input
                      id="confirm"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setFieldError('confirm', null); }}
                      placeholder="Re-enter your password"
                      className={`field pl-10 pr-11 ${errors.confirm ? 'field-error' : ''}`}
                    />
                  </div>
                  {errors.confirm && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.confirm}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitState !== 'idle'}
                  className="w-full inline-flex items-center justify-center gap-2 text-white font-medium px-6 py-3.5 rounded-md shadow-cta transition-colors bg-[#0369A1] hover:bg-[#075985] disabled:opacity-70"
                >
                  {submitState === 'submitting'
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</>
                    : <>Update password <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#64748B]">
          <span>© 2026 Nxtcodeai · Trial site</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-[#334155]">Privacy</a>
            <a href="#" className="hover:text-[#334155]">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
