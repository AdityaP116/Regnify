import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { PublicFooter, PublicNav } from '../components/PublicShell';
import { ProcessTracker } from '../components/infographics';
import {
  dashboardTableRows,
  heroRows,
  heroStats,
  intelligenceColumns,
  problemPoints,
  solutionPoints,
  toneClasses,
  workflowSteps,
} from './landingData';

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface">
      <PublicNav />

      {/* HERO */}
      <section id="product" className="relative w-full overflow-hidden bg-surface py-20 px-6 lg:px-12">
        <div className="absolute inset-0 pointer-events-none bg-blueprint opacity-10" />
        <div className="absolute top-12 right-12 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md mb-6 shadow-sm">
            <Icon name="verified_user" className="text-primary" size={16} />
            <span>Statutory Monitoring &amp; Autonomous Compliance Intelligence</span>
          </div>
          <h1 className="font-display font-headline-xl text-headline-xl text-primary tracking-tight max-w-4xl text-balance">
            Know the Change. Take Action.
          </h1>
          <p className="mt-6 font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed text-balance">
            Regnify continuously monitors regulatory updates, synthesizes what changed, maps exact enterprise relevancy, and converts dense government notifications into prioritized compliance tasks.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="px-7 py-3.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary-container transition-all">
              Get Started
            </Link>
            <a href="#how-it-works" className="px-7 py-3.5 rounded-lg bg-surface-container-lowest border border-[#E2E8E5] text-on-surface font-label-md text-label-md hover:border-primary transition-all flex items-center gap-2">
              <Icon name="play_circle" size={18} className="text-primary" /> Explore Platform
            </a>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
            {heroStats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="font-headline-lg text-headline-lg text-primary font-semibold tabular">{s.value}</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE LEDGER PREVIEW */}
      <section className="w-full bg-surface-container-low py-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" /> Live Ingestion Active
              </span>
              <span className="font-label-sm text-label-sm text-outline uppercase">Regulatory Intelligence Stream</span>
            </div>
            <span className="font-body-sm text-body-sm text-outline">Indexed 14,482 gazettes • 48 portals • Sync 14 mins ago</span>
          </div>
          <div className="bg-surface-container-lowest border border-[#E2E8E5] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[820px]">
                <thead>
                  <tr className="border-b border-[#E2E8E5] bg-surface-container-low">
                    {['Authority', 'Requirement', 'Matched Entity', 'Status', 'Deadline'].map((h) => (
                      <th key={h} className="py-3 px-4 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heroRows.map((row) => (
                    <tr key={row.authority} className="border-b border-[#E2E8E5] last:border-0 hover:bg-surface-container-low transition-colors">
                      <td className="py-4 px-4 font-semibold text-primary">
                        {row.authority}
                        <div className="text-xs font-normal text-on-surface-variant">{row.domain}</div>
                      </td>
                      <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface">{row.requirement}</td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary font-semibold">{row.entity}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded text-xs bg-surface-container-high text-on-surface font-semibold">{row.status}</span>
                      </td>
                      <td className={`py-4 px-4 text-right font-code-tabular font-semibold ${row.dueTone}`}>{row.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM / SOLUTION */}
      <section className="w-full bg-surface py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">The Regulatory Reality</span>
            <h2 className="font-display font-headline-lg text-headline-lg text-primary mt-2">Regulatory Change Shouldn't Threaten Business Velocity</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-3">
              Government notifications arrive faster than legal teams can triage them. Regnify closes that gap with autonomous intelligence.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface-container-lowest border border-[#E2E8E5] border-l-[3px] border-l-error rounded-xl p-7">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="error" className="text-error" size={20} />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-error">The Compliance Struggle</span>
              </div>
              <h3 className="font-display font-headline-md text-headline-md text-on-surface mb-3">Scattered filings, 80-page PDFs, and no clear ownership.</h3>
              <ul className="space-y-3">
                {problemPoints.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <Icon name="remove" className="text-error mt-0.5" size={16} />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-container-lowest border border-[#E2E8E5] border-l-[3px] border-l-accent-teal rounded-xl p-7">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="verified_user" className="text-primary" size={20} />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary">The Regnify Approach</span>
              </div>
              <h3 className="font-display font-headline-md text-headline-md text-on-surface mb-3">Continuous intelligence. Prioritized action. Audit-ready evidence.</h3>
              <ul className="space-y-3">
                {solutionPoints.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <Icon name="check_circle" className="text-secondary mt-0.5" size={16} />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 6 intelligence columns */}
      <section id="intelligence" className="w-full bg-surface-container-low py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">The Six-Stage Intelligence Model</span>
            <h2 className="font-display font-headline-lg text-headline-lg text-primary mt-2">From Government Change to Business Action</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {intelligenceColumns.map((col) => (
              <div key={col.code} className="bg-surface-container-lowest border border-[#E2E8E5] rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className={`flex items-center justify-center w-11 h-11 rounded-lg ${toneClasses(col.tone)}`}>
                    <Icon name={col.icon} size={22} />
                  </span>
                  <span className="font-display font-headline-md text-headline-md text-outline">{col.code}</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-3">{col.title}</h3>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Icon name="arrow_right" className="text-outline mt-0.5" size={16} />
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAZETTE DECONSTRUCTION — intelligence pipeline */}
      <section id="how-it-works" className="w-full bg-surface py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">AI Synthesis Engine</span>
            <h2 className="font-display font-headline-lg text-headline-lg text-primary mt-2">Deconstructing Complex Gazettes into Structured Directives</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-surface-container-lowest border border-[#E2E8E5] rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="description" className="text-[#64748B]" size={18} />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#64748B]">Official Gazette Source</span>
              </div>
              <div className="bg-surface-container-low rounded-lg p-4 font-body-sm text-body-sm text-on-surface-variant italic leading-relaxed">
                “...every manufacturing occupancy maintaining more than fifteen operatives within unpartitioned worksheds shall ensure contiguous wireless or looped heat/optical telemetry coupled to a certified auxiliary alerting repeater...”
              </div>
            </div>
            <div className="bg-surface-container-lowest border border-[#E2E8E5] border-l-[3px] border-l-ai-indigo rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="auto_awesome" className="text-ai-indigo" size={18} />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-ai-indigo">Structured AI Directive</span>
              </div>
              <ul className="space-y-3">
                {[
                  { t: 'Applies to', d: 'Fabrication bays with 15+ workers' },
                  { t: 'Required', d: 'Optical/heat telemetry + alert repeater' },
                  { t: 'Deadline', d: '30 October 2025' },
                  { t: 'Evidence', d: 'Certified calibration sign-off' },
                ].map((row) => (
                  <li key={row.t} className="flex items-center gap-3">
                    <span className="font-label-sm text-label-sm uppercase text-outline w-20 shrink-0">{row.t}</span>
                    <span className="font-body-sm text-body-sm text-on-surface">{row.d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-[#E2E8E5] rounded-xl p-6">
            <ProcessTracker activeIndex={7} />
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="w-full bg-surface-container-low py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">Executive Command Center</span>
              <h2 className="font-display font-headline-lg text-headline-lg text-primary mt-2">The Regnify Overview Dashboard</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl">
                Every change, every impact, and every required action in one audit-ready view.
              </p>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-surface-container-lowest border border-[#E2E8E5] font-label-md text-label-md text-primary hover:border-primary transition-colors self-start">
              <Icon name="open_in_new" size={18} /> Explore live dashboard
            </Link>
          </div>
          <div className="bg-surface-container-lowest border border-[#E2E8E5] rounded-xl overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E2E8E5] border-b border-[#E2E8E5]">
              {[
                { v: '12', l: 'New Updates' },
                { v: '7', l: 'Relevant to You' },
                { v: '4', l: 'Action Required' },
                { v: '2', l: 'Due Soon' },
              ].map((m) => (
                <div key={m.l} className="p-5">
                  <span className="font-label-md text-label-md text-on-surface-variant font-semibold">{m.l}</span>
                  <div className="font-headline-xl text-headline-xl text-primary font-medium mt-2">{m.v}</div>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[760px]">
                <tbody>
                  {dashboardTableRows.map((row) => (
                    <tr key={row.authority} className="border-b border-[#E2E8E5] last:border-0">
                      <td className="py-4 px-5 font-semibold text-primary w-40">
                        {row.authority}
                        <div className="text-xs font-normal text-on-surface-variant">{row.domain}</div>
                      </td>
                      <td className="py-4 px-5 font-body-sm text-body-sm text-on-surface">{row.requirement}</td>
                      <td className="py-4 px-5 font-body-sm text-body-sm text-outline">{row.entity}</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold ${toneClasses(row.tone)}`}>{row.status}</span>
                      </td>
                      <td className="py-4 px-5 text-right font-code-tabular text-on-surface-variant">{row.due}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSED-LOOP WORKFLOW */}
      <section id="compliance" className="w-full bg-surface py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary">End-to-End Governance</span>
            <h2 className="font-display font-headline-lg text-headline-lg text-primary mt-2">The Closed-Loop Compliance Workflow</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-3">
              How continuous regulation translates directly into institutional resilience without missing a beat.
            </p>
          </div>
          <div className="relative w-full overflow-x-auto pb-6">
            <div className="min-w-[800px] flex items-center justify-between gap-3">
              {workflowSteps.map((step, i) => (
                <div key={step.n} className="flex items-center gap-3 flex-1">
                  <div className="flex-1 bg-surface-container-lowest border border-[#E2E8E5] p-5 rounded-xl text-center">
                    <div className="w-10 h-10 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                      <Icon name={step.icon} size={20} />
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">{step.n}</span>
                    <p className="font-label-md text-label-md text-primary font-semibold mt-1">{step.label}</p>
                  </div>
                  {i < workflowSteps.length - 1 && <Icon name="arrow_forward" className="text-outline/40" size={20} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="w-full bg-primary py-20 px-6 lg:px-12 text-on-primary relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-blueprint-light opacity-10" />
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-wider mb-6">
            Continuous Regulatory Readiness
          </span>
          <h2 className="font-display font-headline-xl text-headline-xl tracking-tight text-balance max-w-3xl">
            Stay Ahead of Regulatory Change. Protect Your Business Today.
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl mt-4 leading-relaxed text-balance">
            Join leading GCs, Chief Compliance Officers, and corporate risk directors who have eliminated regulatory blindspots with autonomous intelligence.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="px-8 py-3.5 rounded-lg bg-surface-container-lowest text-primary font-label-md text-label-md shadow-lg hover:bg-surface-container-high transition-all">
              Get Started With Regnify
            </Link>
            <a href="#how-it-works" className="px-8 py-3.5 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:bg-primary-container/80 transition-all">
              Explore Platform Architecture
            </a>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-on-primary-container text-sm">
            {['No credit card required', 'Instant jurisdictional profile matching', 'Enterprise SOC-2 ready'].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <Icon name="check_circle" size={16} /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
