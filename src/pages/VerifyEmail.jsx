import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../store/AuthStore';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuth();

  const [state, setState] = useState('loading'); // loading | success | error
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setState('error');
      setError('Missing verification token.');
      return;
    }
    let cancelled = false;
    (async () => {
      const result = await verifyEmail(token);
      if (cancelled) return;
      if (result.success) {
        setState('success');
        setTimeout(() => navigate('/login?verified=1', { replace: true }), 1200);
      } else {
        setState('error');
        setError(result.error || 'Verification failed.');
      }
    })();
    return () => { cancelled = true; };
  }, [params, navigate, verifyEmail]);

  return (
    <div className="marketing min-h-screen flex flex-col">
      <header className="border-b border-[#E2E8F0] bg-[#F8FAFC]/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <Link to="/" className="flex items-baseline gap-0.5" aria-label="MedCode AI home">
            <span className="display text-xl font-semibold text-[#0F172A]">MedCode</span>
            <span className="text-[0.95rem] font-semibold text-[#0369A1]">.AI</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center anim-rise">
          {state === 'loading' && (
            <>
              <div className="w-12 h-12 mx-auto rounded-full bg-[#E8ECF1] flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-[#0369A1] animate-spin" />
              </div>
              <h1 className="display text-3xl font-semibold mt-6 text-[#020617]">Verifying your email…</h1>
              <p className="text-[#334155] mt-3">Hold on a sec.</p>
            </>
          )}

          {state === 'success' && (
            <>
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 ring-1 ring-emerald-200 flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <h1 className="display text-3xl font-semibold mt-6 text-[#020617]">Email verified.</h1>
              <p className="text-[#334155] mt-3">Redirecting you to sign in…</p>
            </>
          )}

          {state === 'error' && (
            <>
              <div className="w-12 h-12 mx-auto rounded-full bg-red-50 ring-1 ring-red-200 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h1 className="display text-3xl font-semibold mt-6 text-[#020617]">We couldn't verify that link.</h1>
              <p className="text-[#334155] mt-3">{error}</p>
              <div className="mt-7 flex flex-col gap-2 items-center">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-[#0369A1] hover:bg-[#075985] text-white font-medium px-6 py-3 rounded-md shadow-cta transition-colors">
                  Go to sign in <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/signup" className="text-sm text-[#0369A1] hover:text-[#075985]">
                  <span className="border-b border-transparent hover:border-[#075985]">Or sign up again</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
