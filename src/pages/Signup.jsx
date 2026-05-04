import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, User, Mail, Lock, Eye, EyeOff,
  Gift, AlertCircle, Loader2, Check, MailCheck, Building2, Briefcase
} from 'lucide-react';
import { useAuth } from '../store/AuthStore';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRENGTH_LABELS = ['Strength', 'Weak', 'Okay', 'Good', 'Strong'];
const STRENGTH_BAR_BG = ['bg-[#E2E8F0]', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-500'];

function scorePassword(v) {
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
  if (/\d/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v) || v.length >= 14) score++;
  return score;
}

export default function Signup() {
  const navigate = useNavigate();
  const { signup, resendVerification, isAuthenticated, isUser, isAdmin } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitState, setSubmitState] = useState('idle'); // idle | submitting | sent
  const [serverError, setServerError] = useState(null);
  const [resentFor, setResentFor] = useState(null);

  useEffect(() => {
    if (isAuthenticated && isUser) navigate('/document-ingestion', { replace: true });
    if (isAuthenticated && isAdmin) navigate('/admin/accounts', { replace: true });
  }, [isAuthenticated, isUser, isAdmin, navigate]);

  const score = scorePassword(password);
  const setFieldError = (k, v) => setErrors((e) => ({ ...e, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!name.trim()) next.name = 'Tell us your name.';
    if (!EMAIL_RE.test(email.trim())) next.email = "That doesn't look like a valid email.";
    if (!organization.trim()) next.organization = 'Tell us where you work.';
    if (password.length < 8) next.password = 'Password must be at least 8 characters.';
    if (!terms) next.terms = 'Please accept the Terms and Privacy Policy.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitState('submitting');
    setServerError(null);

    const result = await signup({
      name: name.trim(),
      email: email.trim(),
      password,
      organization: organization.trim(),
      designation: designation.trim()
    });
    if (result.success) {
      setSubmitState('sent');
      return;
    }
    setSubmitState('idle');
    if (result.code === 'EMAIL_TAKEN') {
      setFieldError('email', 'An account with that email already exists.');
      return;
    }
    setServerError(result.error || 'Signup failed');
  };

  const handleResend = async () => {
    await resendVerification(email.trim());
    setResentFor(email.trim());
  };

  return (
    <div className="marketing min-h-screen">
      <a href="#main" className="skip-link">Skip to main content</a>

      <header className="border-b border-[#E2E8F0] bg-[#F8FAFC]/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-baseline gap-0.5" aria-label="MedCode AI home">
            <span className="display text-xl font-semibold text-[#0F172A]">MedCode</span>
            <span className="text-[0.95rem] font-semibold text-[#0369A1]">.AI</span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#334155] hover:text-[#0F172A] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main id="main" className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem-3.5rem)]">

        <section className="flex items-center justify-center py-12 sm:py-16 lg:py-20 px-6">
          <div className="w-full max-w-md">
            {submitState === 'sent' ? (
              <div className="anim-rise">
                <div className="w-12 h-12 rounded-full bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center">
                  <MailCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="eyebrow text-[#0369A1] mt-6">Almost there</p>
                <h1 className="display text-4xl sm:text-5xl font-semibold leading-[1.05] mt-3 text-[#020617]">
                  Check your email.
                </h1>
                <p className="text-base text-[#334155] leading-relaxed mt-4">
                  We sent a verification link to <span className="mono text-[#0F172A]">{email.trim()}</span>.
                  Click it within 24 hours and you're in.
                </p>
                <div className="mt-7 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleResend}
                    className="inline-flex items-center justify-center gap-2 border border-[#E2E8F0] text-[#0F172A] font-medium px-5 py-3 rounded-md hover:bg-[#F1F5F9] transition-colors"
                  >
                    {resentFor === email.trim() ? <><Check className="w-4 h-4 text-emerald-600" /> Sent again</> : 'Resend the email'}
                  </button>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center gap-2 text-[#0369A1] hover:text-[#075985] text-sm font-medium"
                  >
                    Already verified? Sign in <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className="anim-rise" style={{ animationDelay: '0ms' }}>
                  <p className="eyebrow text-[#0369A1]">Free trial</p>
                  <h1 className="display text-4xl sm:text-5xl font-semibold leading-[1.05] mt-3 text-[#020617]">
                    Create your account.
                  </h1>
                  <p className="text-base text-[#334155] leading-relaxed mt-4">
                    5 free document uploads, no card, no time limit. Sign up, upload a chart, and read the model's reasoning for yourself.
                  </p>
                </div>

                <div className="mt-7 inline-flex items-center gap-2.5 px-3 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium ring-1 ring-emerald-200 anim-rise" style={{ animationDelay: '80ms' }}>
                  <Gift className="w-4 h-4" />
                  <span><span className="font-semibold">5 free uploads</span> · included with every account</span>
                </div>

                {serverError && (
                  <div className="mt-6 flex items-start gap-3 px-4 py-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-8 space-y-5 anim-rise" style={{ animationDelay: '160ms' }} noValidate>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#020617] mb-1.5">Full name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                      <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => { setName(e.target.value); setFieldError('name', null); }}
                        placeholder="Maya Park"
                        className={`field pl-10 ${errors.name ? 'field-error' : ''}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.name}
                      </p>
                    )}
                  </div>

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
                        onChange={(e) => { setEmail(e.target.value); setFieldError('email', null); }}
                        placeholder="you@yourorg.health"
                        className={`field pl-10 ${errors.email ? 'field-error' : ''}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="organization" className="block text-sm font-medium text-[#020617] mb-1.5">
                        Organization
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                        <input
                          id="organization"
                          type="text"
                          autoComplete="organization"
                          required
                          value={organization}
                          onChange={(e) => { setOrganization(e.target.value); setFieldError('organization', null); }}
                          placeholder="St. Mary's Health"
                          className={`field pl-10 ${errors.organization ? 'field-error' : ''}`}
                        />
                      </div>
                      {errors.organization && (
                        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.organization}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="designation" className="block text-sm font-medium text-[#020617] mb-1.5">
                        Designation <span className="text-[#94A3B8] font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                        <input
                          id="designation"
                          type="text"
                          autoComplete="organization-title"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          placeholder="Coding Lead, CPC"
                          className="field pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#020617] mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                      <input
                        id="password"
                        type={showPw ? 'text' : 'password'}
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setFieldError('password', null); }}
                        placeholder="Minimum 8 characters"
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
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-colors ${i < score ? STRENGTH_BAR_BG[score] : 'bg-[#E2E8F0]'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-[#64748B] w-16 text-right">
                        {password.length === 0 ? 'Strength' : STRENGTH_LABELS[score]}
                      </span>
                    </div>
                  </div>

                  <label className="flex items-start gap-3 text-sm text-[#334155] leading-relaxed cursor-pointer">
                    <input
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => { setTerms(e.target.checked); setFieldError('terms', null); }}
                      required
                      className="mt-0.5 w-4 h-4 rounded border-[#E2E8F0] text-[#0369A1]"
                    />
                    <span>I agree to the <a href="#" className="text-[#0369A1] hover:text-[#075985] underline">Terms</a> and <a href="#" className="text-[#0369A1] hover:text-[#075985] underline">Privacy Policy</a>.</span>
                  </label>
                  {errors.terms && (
                    <p className="text-sm text-red-600 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" /> {errors.terms}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitState === 'submitting'}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0369A1] hover:bg-[#075985] text-white font-medium px-6 py-3.5 rounded-md shadow-cta transition-colors disabled:opacity-70"
                  >
                    {submitState === 'submitting'
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating your account…</>
                      : <>Create free account <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>

                <div className="mt-8 text-center text-sm text-[#64748B] anim-rise" style={{ animationDelay: '240ms' }}>
                  Already have an account?
                  <Link to="/login" className="text-[#0369A1] hover:text-[#075985] font-medium ml-1">
                    <span className="border-b border-transparent hover:border-[#075985]">Sign in</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        <aside aria-hidden="true" className="hidden lg:block relative overflow-hidden border-l border-[#E2E8F0] pane-bg">
          <div className="absolute inset-0 pane-grid" />

          <div className="absolute top-[10%] left-[6%] floater anim-pop" style={{ animationDelay: '400ms', transform: 'rotate(-4deg)' }}>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold uppercase tracking-wider ring-1 ring-blue-200 shadow-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />Reason for admit
            </span>
          </div>

          <div className="absolute top-[14%] right-[10%] floater delay-1 anim-pop" style={{ animationDelay: '500ms' }}>
            <span className="mono text-sm bg-white text-[#020617] font-semibold px-3 py-2 rounded-md border border-[#E2E8F0] shadow-2">
              R06.02
            </span>
          </div>

          <div className="absolute top-[55%] left-[3%] floater delay-2 anim-pop max-w-[200px]" style={{ animationDelay: '700ms', transform: 'rotate(-3deg)' }}>
            <div className="bg-violet-50 rounded-lg p-3 border border-violet-100 shadow-2">
              <p className="text-[11px] text-violet-700 leading-snug">
                <span className="font-semibold">AI Reasoning:</span> EF 30% + dyspnea pattern + chronic HF history.
              </p>
            </div>
          </div>

          <div className="absolute bottom-[12%] right-[8%] floater anim-pop" style={{ animationDelay: '600ms', transform: 'rotate(6deg)' }}>
            <span className="mono text-sm bg-white text-[#020617] font-semibold px-3 py-2 rounded-md border border-[#E2E8F0] shadow-2">
              93306
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="doc-stage w-full max-w-md">
              <div className="doc anim-rise bg-[#FBFAF7] rounded-xl border border-[#E2E8F0] shadow-doc overflow-hidden" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#E2E8F0] bg-white">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#FECACA]" />
                    <span className="w-2 h-2 rounded-full bg-[#FDE68A]" />
                    <span className="w-2 h-2 rounded-full bg-[#BBF7D0]" />
                  </div>
                  <div className="mono text-[10px] text-[#64748B]">CHT-001824 · sample</div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                      <div className="doc-line short" />
                      <div className="doc-line short" style={{ width: '25%' }} />
                    </div>
                    <div className="text-right space-y-1.5">
                      <div className="doc-line" style={{ width: '50px', height: '5px' }} />
                      <div className="doc-line" style={{ width: '70px', height: '5px' }} />
                    </div>
                  </div>
                  <div className="h-px bg-[#E2E8F0] my-4" />
                  <div className="space-y-2.5 text-[12px] text-[#334155] leading-relaxed">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <div className="doc-line short" style={{ width: '18%' }} />
                      <span className="text-[#020617]">presents with</span>
                      <span className="chip accent anim-pop" style={{ animationDelay: '900ms' }}>progressive dyspnea</span>
                      <div className="doc-line short" style={{ width: '22%' }} />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="chip accent anim-pop" style={{ animationDelay: '1000ms' }}>orthopnea</span>
                      <div className="doc-line med" />
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[#020617]">BNP</span>
                      <span className="chip mono">1,840</span>
                      <span className="text-[#020617]">. Echo:</span>
                      <span className="chip mono">EF 30%</span>
                      <div className="doc-line short" style={{ width: '15%' }} />
                    </div>
                    <div className="doc-line long" />
                  </div>
                  <div className="h-px bg-[#E2E8F0] my-4" />
                  <div className="bg-white rounded-lg p-3 border border-[#E2E8F0] anim-pop" style={{ animationDelay: '1100ms' }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-semibold uppercase tracking-wider ring-1 ring-emerald-200">
                        Primary DX
                      </span>
                      <span className="mono text-sm font-bold text-[#020617]">I50.23</span>
                    </div>
                    <p className="text-[11px] text-[#334155] mb-2">Acute on chronic systolic heart failure</p>
                    <div className="bg-violet-50 rounded p-2 border border-violet-100">
                      <p className="text-[10px] text-violet-700 leading-snug">
                        <span className="font-semibold">AI Reasoning:</span> EF measurement, dyspnea, prior HF history all align with acute-on-chronic systolic.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <footer className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#64748B]">
          <span>© 2026 MedCode AI · Trial site</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-[#334155]">Privacy</a>
            <a href="#" className="hover:text-[#334155]">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
