import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Mail, AlertCircle, Loader2, MailCheck
} from 'lucide-react';
import { useAuth } from '../store/AuthStore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState(null);
  const [submitState, setSubmitState] = useState('idle'); // idle | submitting | sent
  const [sentTo, setSentTo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setFieldError("That doesn't look like a valid email.");
      return;
    }
    setSubmitState('submitting');
    await forgotPassword(email.trim());
    setSentTo(email.trim());
    setSubmitState('sent');
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
          {submitState === 'sent' ? (
            <div className="text-center anim-rise">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center">
                <MailCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="display text-3xl font-semibold mt-6 text-[#020617]">Check your inbox.</h1>
              <p className="text-[#334155] mt-3 leading-relaxed">
                If an account exists for <span className="font-mono">{sentTo}</span>, we've sent a link to reset
                your password. The link is valid for 1 hour.
              </p>
              <div className="mt-7">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-[#0369A1] hover:bg-[#075985] text-white font-medium px-6 py-3 rounded-md shadow-cta transition-colors">
                  Back to sign in <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <p className="mt-5 text-sm text-[#64748B]">
                Didn't get it?{' '}
                <button
                  type="button"
                  onClick={() => { setSubmitState('idle'); }}
                  className="text-[#0369A1] hover:text-[#075985] font-medium underline hover:no-underline cursor-pointer"
                >
                  Try a different email
                </button>
              </p>
            </div>
          ) : (
            <>
              <div className="anim-rise">
                <p className="eyebrow text-[#0369A1]">Forgot your password?</p>
                <h1 className="display text-4xl sm:text-5xl font-semibold leading-[1.05] mt-3 text-[#020617]">
                  Reset it.
                </h1>
                <p className="text-base text-[#334155] leading-relaxed mt-4">
                  Enter the email you signed up with and we'll send you a link to set a new password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5 anim-rise" style={{ animationDelay: '100ms' }} noValidate>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#020617] mb-1.5">Work email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setFieldError(null); }}
                      placeholder="you@yourorg.health"
                      className={`field pl-10 ${fieldError ? 'field-error' : ''}`}
                    />
                  </div>
                  {fieldError && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> {fieldError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitState !== 'idle'}
                  className="w-full inline-flex items-center justify-center gap-2 text-white font-medium px-6 py-3.5 rounded-md shadow-cta transition-colors bg-[#0369A1] hover:bg-[#075985] disabled:opacity-70"
                >
                  {submitState === 'submitting'
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                    : <>Send reset link <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-[#64748B] anim-rise" style={{ animationDelay: '200ms' }}>
                Remembered it?
                <Link to="/login" className="text-[#0369A1] hover:text-[#075985] font-medium ml-1">
                  <span className="border-b border-transparent hover:border-[#075985]">Back to sign in</span>
                </Link>
              </div>
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
