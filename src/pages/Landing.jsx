import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Menu, Stethoscope, Hash, Sparkles,
  Calendar, UserCheck, Check, X, Edit3, RotateCcw, Brain,
  Upload, Phone, FileInput, ClipboardCheck, UserPlus,
  Gift, Infinity as InfinityIcon, BookOpen, CreditCard
} from 'lucide-react';

function useReveal() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('in'), (i % 4) * 40);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useStickyShadow(navRef) {
  useEffect(() => {
    const onScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY > 8) navRef.current.classList.add('border-[#E2E8F0]', 'shadow-2');
      else navRef.current.classList.remove('border-[#E2E8F0]', 'shadow-2');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [navRef]);
}

const Container = ({ children, className = '' }) => (
  <div className={`max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 ${className}`}>{children}</div>
);

export default function Landing() {
  const navRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();
  useStickyShadow(navRef);

  return (
    <div className="marketing scroll-smooth">
      <a href="#main" className="skip-link">Skip to main content</a>

      <header ref={navRef} className="sticky top-0 z-40 bg-[#F8FAFC]/80 backdrop-blur border-b border-transparent">
        <Container className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-baseline gap-0.5" aria-label="MedCode AI home">
            <span className="display text-xl font-semibold text-[#0F172A]">MedCode</span>
            <span className="text-[0.95rem] font-semibold text-[#0369A1]">.AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#334155]" aria-label="Primary">
            <a href="#product" className="hover:text-[#0F172A] transition-colors">Product</a>
            <a href="#how" className="hover:text-[#0F172A] transition-colors">How it works</a>
            <a href="#cta" className="hover:text-[#0F172A] transition-colors">Talk to us</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/login" className="hidden sm:inline-flex text-sm font-medium text-[#334155] hover:text-[#0F172A] transition-colors px-2 py-2">Sign in</Link>
            <Link to="/signup" className="inline-flex items-center gap-1.5 bg-[#0369A1] hover:bg-[#075985] text-white text-sm font-medium px-5 py-2.5 rounded-md shadow-cta transition-colors">
              Sign up free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 -mr-2 text-[#334155]"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </Container>
        {menuOpen && (
          <div className="md:hidden border-t border-[#E2E8F0] bg-white">
            <Container className="py-4 flex flex-col gap-1 text-sm font-medium">
              <a href="#product" className="px-2 py-3 text-[#334155] hover:text-[#0F172A]">Product</a>
              <a href="#how" className="px-2 py-3 text-[#334155] hover:text-[#0F172A]">How it works</a>
              <a href="#cta" className="px-2 py-3 text-[#334155] hover:text-[#0F172A]">Talk to us</a>
              <Link to="/login" className="px-2 py-3 text-[#334155] hover:text-[#0F172A]">Sign in</Link>
              <Link to="/signup" className="px-2 py-3 text-[#334155] hover:text-[#0F172A]">Sign up</Link>
            </Container>
          </div>
        )}
      </header>

      <main id="main">

        {/* HERO */}
        <section className="relative pt-16 md:pt-24 pb-24 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden="true" />
          <Container className="relative">
            <div className="max-w-4xl">
              <p className="eyebrow text-[#0369A1] reveal">A trial of our medical coding AI</p>
              <h1 className="display text-[2.5rem] sm:text-5xl md:text-[4.25rem] lg:text-[4.75rem] font-semibold leading-[1.04] mt-5 text-[#020617] reveal">
                Predicted codes,<br />
                <span className="text-[#334155]">with the model's reasoning.</span>
              </h1>
              <p className="text-lg md:text-xl text-[#334155] leading-relaxed mt-6 max-w-[55ch] reveal">
                Upload a chart — ED notes, labs, radiology, or discharge summary — and MedCode predicts ICD-10, E&amp;M, CPT, and modifier codes. Every prediction comes with the reasoning behind it, so you can decide whether to accept, modify, or reject.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-7 mt-9 reveal">
                <Link to="/signup" className="inline-flex items-center gap-2 bg-[#0369A1] hover:bg-[#075985] text-white text-base font-medium px-6 py-3.5 rounded-md shadow-cta transition-colors">
                  Create free account
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="group inline-flex items-center gap-1.5 text-base font-medium text-[#0369A1] hover:text-[#075985] transition-colors">
                  <span className="border-b border-transparent group-hover:border-[#075985] transition-colors">Already have an account? Sign in</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-9 text-xs text-[#64748B] reveal">
                <span className="flex items-center gap-1.5"><Gift className="w-3.5 h-3.5 text-emerald-600" />5 free document uploads</span>
                <span className="flex items-center gap-1.5"><InfinityIcon className="w-3.5 h-3.5 text-emerald-600" />No time limit</span>
                <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 text-emerald-600" />No card required</span>
              </div>
            </div>

            {/* Product mock */}
            <div className="mt-16 md:mt-20 reveal">
              <div className="flex items-center gap-2 mb-4 text-xs text-[#64748B]">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#E8ECF1] border border-[#E2E8F0] mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Sample chart · synthetic data
                </span>
                <span className="hidden sm:inline">A view from the actual app: predicted codes with the AI's reasoning.</span>
              </div>
              <div className="relative">
                <div className="absolute -inset-x-8 -bottom-12 -top-2 -z-10 rounded-[28px]" style={{ background: 'radial-gradient(60% 80% at 50% 100%, rgba(3,105,161,0.08), transparent 70%)' }} />
                <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-3 overflow-hidden">
                  <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-200 bg-white">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-200/60 shrink-0">
                        <Stethoscope className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                          <span>CHT-001824</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-medium ring-1 ring-blue-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />In review
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mono mt-0.5 truncate">MRN 84-220-7714 · ED · St. Mary's Medical Center</div>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />2026-04-29</span>
                      <span className="flex items-center gap-1.5"><UserCheck className="w-3.5 h-3.5" />Dr. R. Chen</span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-7">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Hash className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900">AI Predicted Codes</h3>
                          <p className="text-xs text-slate-500">Review each suggestion. Accept, modify, or reject.</p>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        3 codes predicted
                      </span>
                    </div>

                    <div className="space-y-3">
                      <CodeRow
                        category={{ label: 'E/M Level', cls: 'bg-blue-50 text-blue-700 ring-blue-100' }}
                        code="99284"
                        title="Emergency department visit, moderate complexity decision-making"
                        active="accept"
                        extra={(
                          <div className="bg-slate-50 rounded-lg p-2.5 mb-2 border border-slate-200">
                            <p className="text-xs font-semibold text-slate-900 mb-1">MDM Justification:</p>
                            <div className="grid grid-cols-2 gap-1 text-xs text-slate-600">
                              <div><span className="text-slate-500">Complexity:</span> Moderate</div>
                              <div><span className="text-slate-500">Diagnoses:</span> 2 stable + 1 new</div>
                              <div><span className="text-slate-500">Data:</span> Echo, BNP, CBC reviewed</div>
                              <div><span className="text-slate-500">Risk:</span> Moderate (IV diuresis)</div>
                            </div>
                          </div>
                        )}
                        reasoning="Moderate MDM supported by multiple chronic conditions, prescription drug management, and a new acute problem requiring workup. Risk and data review align with 99284 over 99283."
                      />
                      <CodeRow
                        category={{ label: 'Primary DX', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-100' }}
                        code="I50.23"
                        title="Acute on chronic systolic (congestive) heart failure"
                        active="modify"
                        extra={(
                          <div className="bg-amber-50 rounded-lg p-2.5 mb-2 border border-amber-200">
                            <p className="text-xs text-amber-800">
                              <span className="font-semibold">Reason for Change:</span> Specificity Not Achieved — original I50.9 modified to I50.23 based on documented EF 30%.
                            </p>
                          </div>
                        )}
                        reasoning="Patient presents with progressive dyspnea, orthopnea, and bilateral lower-extremity edema. BNP elevated. Echo shows EF 30% with reduced systolic function on a known background of chronic HF."
                      />
                      <CodeRow
                        category={{ label: 'Procedure (CPT)', cls: 'bg-violet-50 text-violet-700 ring-violet-100' }}
                        code="93306"
                        title="Echocardiogram, transthoracic, with spectral & color Doppler"
                        active="accept"
                        reasoning="Complete TTE documented in radiology with 2D imaging, M-mode, spectral Doppler, and color flow mapping. Findings include EF measurement and chamber sizing — supports 93306 over 93307."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* PROBLEM */}
        <section className="py-24 md:py-32">
          <Container>
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              <div className="lg:col-span-7 reveal">
                <p className="eyebrow text-[#0369A1]">Why a trial</p>
                <h2 className="display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.1] text-[#020617] mt-3">
                  A coding model is only worth trusting<br />
                  if you can <em className="not-italic underline decoration-[#0369A1] decoration-2 underline-offset-[6px]">read its reasoning</em>.
                </h2>
                <p className="text-lg text-[#334155] leading-relaxed mt-6 max-w-[65ch]">
                  Most "AI coding" demos show you a code and ask you to take it on faith. We'd rather you upload one of your own charts, see what we predict, read the reasoning behind each code, and decide for yourself.
                </p>
                <p className="text-lg text-[#334155] leading-relaxed mt-4 max-w-[65ch]">
                  The trial gives you the same workflow your coders would use day-to-day: ingest a chart, get codes by category, accept or modify each one. If it works for the chart you brought, let's talk.
                </p>
              </div>
              <aside className="lg:col-span-5 lg:pt-2 reveal">
                <ul className="space-y-5">
                  {[
                    { Icon: Upload, title: 'Bring your own chart', body: 'Upload a real (de-identified) document. PDF, scan, or pasted text. ED, labs, radiology, or discharge.' },
                    { Icon: Brain, title: 'Read the reasoning', body: "Every predicted code — ICD-10, E&M, CPT, modifier — comes with the model's reasoning attached. No black box." },
                    { Icon: Phone, title: 'Then talk to us', body: "If the trial earns it, we'll set up a call to scope what your team needs and what pricing looks like. No self-serve checkout." }
                  ].map(({ Icon, title, body }) => (
                    <li key={title} className="flex gap-4">
                      <div className="shrink-0 w-9 h-9 rounded-md bg-[#0369A1]/10 text-[#0369A1] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-[#020617]">{title}</div>
                        <p className="text-sm text-[#64748B] mt-1">{body}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </Container>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="py-24 md:py-32 border-y border-[#E2E8F0]" style={{ background: 'linear-gradient(180deg, #F4F6FA 0%, #F8FAFC 100%)' }}>
          <Container>
            <div className="max-w-3xl reveal">
              <p className="eyebrow text-[#0369A1]">How the trial works</p>
              <h2 className="display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.1] text-[#020617] mt-3">
                Four steps from a chart you upload to codes you can read.
              </h2>
            </div>
            <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
              {[
                { Icon: UserPlus, n: '01 · Sign up', title: 'Create your account', body: "Email and password — that's it. You get 5 document uploads to try the model. No card, no time limit on when you use them.", iconBg: 'bg-[#0369A1]/10 text-[#0369A1]' },
                { Icon: FileInput, n: '02 · Upload', title: 'Bring a chart', body: 'PDF, image, or pasted text. Tag it as ED notes, Labs, Radiology, or Discharge. Add MRN, facility, specialty, and provider details.', iconBg: 'bg-blue-50 text-blue-600' },
                { Icon: Sparkles, n: '03 · Predict', title: 'Codes with reasoning', body: "Reason for admit, E&M level (with MDM justification), procedures, primary & secondary diagnoses, and modifiers — each with the model's reasoning attached.", iconBg: 'bg-violet-50 text-violet-600' },
                { Icon: ClipboardCheck, n: '04 · Review', title: 'Accept · Modify · Reject', body: 'Run the same workflow your coders would use. Modify a code with a reason from a curated list, or reject it outright. Your edits stay on the chart.', iconBg: 'bg-emerald-50 text-emerald-600' }
              ].map(({ Icon, n, title, body, iconBg }) => (
                <li key={n} className="bg-white border border-[#E2E8F0] rounded-[14px] p-6 reveal">
                  <div className="flex items-baseline justify-between">
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center ${iconBg}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="mono text-xs text-[#64748B]">{n}</span>
                  </div>
                  <h3 className="display text-lg font-semibold mt-5 text-[#020617]">{title}</h3>
                  <p className="text-sm text-[#334155] mt-2 leading-relaxed">{body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* POSITIONING STRIP */}
        <section className="py-24 md:py-28">
          <Container>
            <div className="max-w-2xl reveal">
              <p className="eyebrow text-[#0369A1]">What you'll see in the trial</p>
              <h2 className="display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.1] text-[#020617] mt-3">
                Three things to look for when you try it.
              </h2>
              <p className="text-lg text-[#334155] leading-relaxed mt-5 max-w-[65ch]">
                These are the parts of the workflow we'd ask you to judge for yourself, not benchmarks we'd ask you to take on faith.
              </p>
            </div>

            <dl className="grid md:grid-cols-3 gap-px mt-12 border border-[#E2E8F0] rounded-xl overflow-hidden bg-[#E2E8F0]">
              {[
                { eyebrow: 'Reasoning', title: 'Read why the model picked each code.', body: 'Every prediction comes with a short reasoning paragraph. For E&M codes, you also see the MDM justification: complexity, diagnoses, data reviewed, and risk.' },
                { eyebrow: 'Coverage', title: 'Six categories, one chart.', body: 'Reason for admit, E&M level, procedures (CPT), primary diagnosis, secondary diagnoses, and modifiers — predicted together from the documents you upload.' },
                { eyebrow: 'Workflow', title: 'Accept, modify, or reject — with a reason.', body: 'When you modify a code, pick from a curated reason list (Specificity Not Achieved, Wrong Code Selection, MUE Edit Failure, and so on). Same workflow your coders would use.' }
              ].map((it) => (
                <div key={it.eyebrow} className="bg-white p-8 md:p-10">
                  <dt className="eyebrow text-[#0369A1]">{it.eyebrow}</dt>
                  <dd className="display text-2xl md:text-[1.75rem] font-semibold text-[#020617] leading-tight mt-4">{it.title}</dd>
                  <p className="text-sm text-[#334155] mt-4 leading-relaxed">{it.body}</p>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        {/* TRIAL TERMS STRIP */}
        <section aria-label="Trial terms" className="py-12 border-y border-[#E2E8F0] bg-white">
          <Container>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[#334155]">
              <span className="eyebrow text-[#64748B]">Trial terms</span>
              <span className="flex items-center gap-2 text-sm font-medium"><Gift className="w-4 h-4 text-[#0369A1]" />5 free uploads per account</span>
              <span className="flex items-center gap-2 text-sm font-medium"><InfinityIcon className="w-4 h-4 text-[#0369A1]" />No time limit</span>
              <span className="flex items-center gap-2 text-sm font-medium"><Phone className="w-4 h-4 text-[#0369A1]" />Pricing by conversation</span>
              <span className="flex items-center gap-2 text-sm font-medium"><BookOpen className="w-4 h-4 text-[#0369A1]" />ICD-10-CM 2025</span>
            </div>
          </Container>
        </section>

        {/* FINAL CTA */}
        <section id="cta" className="py-24 md:py-32 bg-[#0F172A] text-white relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden="true" />
          <Container className="relative">
            <div className="max-w-3xl reveal">
              <p className="eyebrow text-[#38BDF8]">Try it</p>
              <h2 className="display text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.05] mt-4">
                5 free uploads.<br />
                <span className="text-white/70">Email and a password — that's the whole gate.</span>
              </h2>
              <p className="text-lg text-white/70 leading-relaxed mt-6 max-w-[55ch]">
                Create an account, upload a chart, read the model's reasoning. If it's worth a real conversation about your team, you'll know inside the first chart.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center">
                <Link to="/signup" className="inline-flex items-center justify-center gap-2 bg-[#38BDF8] hover:bg-white text-[#0F172A] font-semibold px-6 py-3.5 rounded-md transition-colors shadow-cta whitespace-nowrap">
                  Create free account
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login" className="inline-flex items-center gap-1.5 text-base font-medium text-[#38BDF8] hover:text-white transition-colors">
                  <span className="border-b border-transparent hover:border-white">Already have an account? Sign in</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="mt-10 grid sm:grid-cols-3 gap-x-8 gap-y-3 max-w-2xl text-sm text-white/70">
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" />5 free document uploads</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" />No time limit</span>
                <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" />No card required</span>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <footer className="bg-[#0F172A] text-white/70 border-t border-white/5">
        <Container className="py-14 grid md:grid-cols-12 gap-10 items-start">
          <div className="md:col-span-6">
            <Link to="/" className="flex items-baseline gap-0.5">
              <span className="display text-2xl font-semibold text-white">MedCode</span>
              <span className="text-base font-semibold text-[#38BDF8]">.AI</span>
            </Link>
            <p className="text-sm leading-relaxed mt-4 max-w-md">
              A trial of our medical coding prediction AI. Create a free account, upload a chart, read the reasoning, and decide for yourself. 5 free uploads.
            </p>
          </div>
          <div className="md:col-span-3">
            <div className="eyebrow text-white/50">On this page</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><a href="#product" className="hover:text-white transition-colors">Inside the trial</a></li>
              <li><a href="#how" className="hover:text-white transition-colors">How it works</a></li>
              <li><a href="#cta" className="hover:text-white transition-colors">Talk to us</a></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <div className="eyebrow text-white/50">Get started</div>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/signup" className="hover:text-white transition-colors">Create account</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign in</Link></li>
              <li><a href="mailto:hello@medcode.ai" className="hover:text-white transition-colors">hello@medcode.ai</a></li>
            </ul>
          </div>
        </Container>
        <div className="border-t border-white/5">
          <Container className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/40">
            <span>© 2026 MedCode AI · Trial site</span>
            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </Container>
        </div>
      </footer>
    </div>
  );
}

function CodeRow({ category, code, title, active, extra, reasoning }) {
  const btn = (kind, Icon, ariaLabel) => {
    const baseHover = {
      accept: 'hover:bg-emerald-50 hover:text-emerald-600',
      modify: 'hover:bg-blue-50 hover:text-blue-600',
      reject: 'hover:bg-red-50 hover:text-red-600',
      reset: 'hover:bg-slate-100'
    }[kind];
    const activeStyle = {
      accept: 'bg-emerald-100 text-emerald-600 ring-2 ring-emerald-200',
      modify: 'bg-blue-100 text-blue-600 ring-2 ring-blue-200',
      reject: 'bg-red-100 text-red-600 ring-2 ring-red-200'
    }[kind];
    const isActive = active === kind;
    return (
      <button
        className={`p-1.5 rounded-lg transition-all ${isActive ? activeStyle : `text-slate-400 ${baseHover}`}`}
        aria-label={ariaLabel}
        title={ariaLabel}
        type="button"
      >
        <Icon className="w-4 h-4" />
      </button>
    );
  };
  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${category.cls} text-[10px] font-semibold uppercase tracking-wider ring-1`}>{category.label}</span>
          <span className="mono text-[15px] font-bold text-slate-900">{code}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {btn('accept', Check, 'Accept')}
          {btn('modify', Edit3, 'Modify')}
          {btn('reject', X, 'Reject')}
          {btn('reset', RotateCcw, 'Reset')}
        </div>
      </div>
      <p className="text-sm text-slate-700 mb-2">{title}</p>
      {extra}
      <div className="bg-violet-50 rounded-lg p-2.5 border border-violet-100">
        <p className="text-xs text-violet-700">
          <span className="font-semibold">AI Reasoning:</span> {reasoning}
        </p>
      </div>
    </div>
  );
}
