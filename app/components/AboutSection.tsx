'use client';

import { useEffect, useState } from 'react';
import {
  Brain,
  Zap,
  Shield,
  Target,
  GitBranch,
  Database,
  Cpu,
  Rocket,
  BarChart2,
  Users,
} from 'lucide-react';
import AboutChatbot from './AboutChatbot';

/* ─── fade-in-up helper ───────────────────────────────────────────────────── */
function FadeUp({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {children}
    </div>
  );
}

/* ─── data ────────────────────────────────────────────────────────────────── */
const team = [
  {
    name: 'EL MOUAQUIT Nada',
    initials: 'NE',
    role: 'Data Science & Feature Engineering',
    tasks: ['Raw → enriched dataset', 'Price & store feature transforms', 'Pearson / Cramér filtering'],
    color: 'from-violet-500 to-violet-700',
  },
  {
    name: 'GUIMEFACK Dany Anderson',
    initials: 'DA',
    role: 'Full-Stack & Platform Lead',
    tasks: ['FastAPI backend & REST API', 'Next.js frontend', 'Railway & Vercel deployment', 'Gemini + Pinecone RAG'],
    color: 'from-[#0099FF] to-[#0066CC]',
  },
  {
    name: 'NLEND Marie Flora',
    initials: 'MF',
    role: 'ML Engineering — Boosting',
    tasks: ['XGBoost & CatBoost models', 'Cold-start sampling strategies', 'SHAP feature selection'],
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    name: 'OUEDRAOGO Aminata',
    initials: 'AO',
    role: 'ML Research & Deep Learning',
    tasks: ['Neural network architectures', 'Model evaluation & benchmarking', 'PCA feature reduction'],
    color: 'from-amber-500 to-amber-700',
  },
  {
    name: 'YARGA Tigbialimanu Cynthia',
    initials: 'TC',
    role: 'Data Analysis & Coordination',
    tasks: ['Exploratory data analysis', 'Linear models (Ridge / Lasso)', 'Project planning & reporting'],
    color: 'from-[#E5001A] to-red-700',
  },
];

const supervisors = [
  { name: 'Noureddine SEDKI', role: 'Academic Supervisor', initials: 'NS' },
  { name: 'Asmaa BENZMANE', role: 'Academic Supervisor', initials: 'AB' },
];

const phases = [
  {
    icon: Database,
    label: 'Phase 1',
    title: 'Framing & Data Exploration',
    desc: 'Problem formulation, exploratory analysis of three Carrefour datasets (products, stores, weekly sales). Identified 6.9 % cold-start ratio and key feature relationships.',
    iconClass: 'bg-violet-100 text-violet-700 border border-violet-200',
    labelClass: 'text-violet-600',
  },
  {
    icon: GitBranch,
    label: 'Phase 2',
    title: 'Feature Engineering',
    desc: 'Built raw (15 vars), enriched (27 vars after Pearson + Cramér filtering), SHAP top-20, and PCA variants. Created demand-proxy features to handle cold-start without historical data.',
    iconClass: 'bg-blue-100 text-blue-700 border border-blue-200',
    labelClass: 'text-blue-600',
  },
  {
    icon: Cpu,
    label: 'Phase 3',
    title: 'Model Development',
    desc: 'Trained 50+ models across 4 families (Linear, XGBoost, CatBoost, Deep Learning) × 4 cold-start strategies (baseline, oversampling, sample weights, cold-start feature). 80/20 stratified split.',
    iconClass: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    labelClass: 'text-emerald-600',
  },
  {
    icon: BarChart2,
    label: 'Phase 4',
    title: 'Evaluation & Selection',
    desc: 'Benchmark across RMSE, MAE, R², MAPE. Best model: XGBoost on SHAP top-20 features (RMSE 0.8866, R² 76.3 %). SHAP analysis confirmed key drivers: family, store size, price.',
    iconClass: 'bg-amber-100 text-amber-700 border border-amber-200',
    labelClass: 'text-amber-600',
  },
  {
    icon: Rocket,
    label: 'Phase 5',
    title: 'Platform & Deployment',
    desc: 'FastAPI prediction engine + Next.js interface. Gemini AI for logistics insights. Pinecone RAG for contextual chat. Deployed on Railway (backend) and Vercel (frontend).',
    iconClass: 'bg-red-100 text-red-700 border border-red-200',
    labelClass: 'text-red-600',
  },
];

const metrics = [
  { label: 'Test RMSE', value: '0.8866', sub: 'XGBoost SHAP' },
  { label: 'Test MAE', value: '0.6033', sub: 'Mean abs. error' },
  { label: 'Test R²', value: '76.3 %', sub: 'Variance explained' },
  { label: 'MAPE', value: '~23 %', sub: 'Cold-start products' },
];

const coreIdeas = [
  {
    icon: Brain,
    title: 'Gradient-boosted trees',
    desc: 'XGBoost on SHAP-selected features outperforms all alternatives. CatBoost handles categoricals natively.',
    color: 'from-[#0099FF] to-[#0066CC]',
  },
  {
    icon: Zap,
    title: 'Cold-start ready',
    desc: 'Predicts sales for products with no history using product and store characteristics as demand proxies.',
    color: 'from-[#E5001A] to-red-700',
  },
  {
    icon: Shield,
    title: 'Honest uncertainty',
    desc: 'Every prediction ships with a confidence score and interval so you size orders around the realistic range.',
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    icon: Target,
    title: 'AI logistics insights',
    desc: 'Gemini generates practical order-quantity guidance based on the prediction, confidence, and N-1 baselines.',
    color: 'from-amber-500 to-amber-700',
  },
];

/* ─── component ───────────────────────────────────────────────────────────── */
export default function AboutSection() {
  return (
    <div className="space-y-10">

      {/* ── Hero ── */}
      <FadeUp delay={0}>
        <div className="bg-gradient-to-br from-[#0099FF] via-[#0077DD] to-[#0055BB] rounded-2xl shadow-2xl p-10 text-white overflow-hidden relative">
          {/* decorative circles */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">
              Centrale Casablanca · IT Project · 2025 – 2026
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              Cold-Start Sales Prediction
            </h1>
            <p className="text-base opacity-90 leading-relaxed mb-2">
              A machine-learning platform that predicts weekly unit sales for grocery products in Carrefour
              stores — including products that have never been sold before.
            </p>
            <p className="text-sm opacity-70 leading-relaxed mb-6">
              Commissioned by Carrefour France in response to the EGAlim 3 law, which tightened
              supplier contracts and made ordering errors far more costly. The model turns product and
              store characteristics into reliable forecasts without requiring any sales history.
            </p>
            <div className="flex flex-wrap gap-2">
              {['XGBoost · CatBoost', 'Cold-Start', 'Gemini AI', 'Pinecone RAG', 'FastAPI · Next.js', 'EGAlim 3'].map(
                (tag) => (
                  <span key={tag} className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium">
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── Problem & Context ── */}
      <FadeUp delay={80}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-7 border border-gray-100 border-t-4 border-t-[#E5001A]">
            <h2 className="text-base font-bold text-[#2C2C2C] mb-3">The problem</h2>
            <p className="text-sm text-[#666666] leading-relaxed mb-4">
              Classical time-series forecasting breaks down when a product has never been sold in a
              given store. Yet Carrefour lists thousands of new products every year — and under EGAlim 3,
              a wrong opening order costs money, shelf space, or supplier goodwill.
            </p>
            <div className="bg-[#FFE6E9] rounded-xl p-4 border border-[#E5001A]/20">
              <p className="text-sm font-semibold text-[#E5001A] italic">
                "How do you predict sales for a product that has never been sold in a store?"
              </p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-7 border border-gray-100 border-t-4 border-t-[#0099FF]">
            <h2 className="text-base font-bold text-[#2C2C2C] mb-3">Our answer</h2>
            <p className="text-sm text-[#666666] leading-relaxed mb-3">
              Train ML models on existing product–store combinations, then generalise to unseen pairs
              using demand-proxy features: price ratios, brand averages, store format, category shares.
            </p>
            <ul className="space-y-2 text-sm text-[#666666]">
              {[
                '261 k product–store pairs from Carrefour France',
                '6.9 % cold-start observations (18 k products)',
                '27 engineered features after correlation filtering',
                '50+ trained model variants benchmarked',
              ].map((item) => (
                <li key={item} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 bg-[#0099FF] rounded-full flex-shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeUp>

      {/* ── Core Ideas ── */}
      <FadeUp delay={140}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {coreIdeas.map((idea) => {
            const Icon = idea.icon;
            return (
              <div
                key={idea.title}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div
                  className={`w-11 h-11 bg-gradient-to-br ${idea.color} rounded-xl flex items-center justify-center mb-4 shadow-sm`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-semibold text-[#2C2C2C] mb-1.5">{idea.title}</h3>
                <p className="text-sm text-[#666666] leading-relaxed">{idea.desc}</p>
              </div>
            );
          })}
        </div>
      </FadeUp>

      {/* ── Project Phases ── */}
      <FadeUp delay={200}>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-[#2C2C2C] mb-7">Project phases</h2>
          <div className="space-y-0">
            {phases.map((phase, i) => {
              const Icon = phase.icon;
              return (
                <div key={i} className="relative flex space-x-5">
                  {/* timeline track */}
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${phase.iconClass}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {i < phases.length - 1 && (
                      <div className="w-px flex-1 my-1 bg-gray-200" />
                    )}
                  </div>
                  {/* content */}
                  <div className={`pb-7 ${i === phases.length - 1 ? 'pb-0' : ''}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${phase.labelClass}`}>
                      {phase.label}
                    </p>
                    <h4 className="text-sm font-semibold text-[#2C2C2C] mb-1">{phase.title}</h4>
                    <p className="text-sm text-[#666666] leading-relaxed">{phase.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FadeUp>

      {/* ── Model Performance ── */}
      <FadeUp delay={260}>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 border-t-4 border-t-[#0099FF]">
          <h2 className="text-xl font-bold text-[#2C2C2C] mb-1">Best model performance</h2>
          <p className="text-sm text-[#666666] mb-6">
            Held-out test set results. Best model: <strong className="text-[#2C2C2C]">XGBoost on SHAP top-20 features</strong>, no resampling.
            A 23 % MAPE on cold-start products is honest — these are hard to forecast without any history.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="bg-[#E6F5FF] rounded-xl p-5 border border-[#0099FF]/20 text-center">
                <p className="text-xs text-[#666666] mb-1">{m.label}</p>
                <p className="text-2xl font-bold text-[#0099FF] mb-1">{m.value}</p>
                <p className="text-xs text-[#888888]">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── Team ── */}
      <FadeUp delay={320}>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-7">
            <div className="w-9 h-9 bg-gradient-to-br from-[#0099FF] to-[#0066CC] rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-[#2C2C2C]">Team</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div
                    className={`w-11 h-11 bg-gradient-to-br ${member.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}
                  >
                    <span className="text-white font-bold text-sm">{member.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2C2C2C] leading-tight">{member.name}</p>
                    <p className="text-xs text-[#666666] mt-0.5">{member.role}</p>
                  </div>
                </div>
                <ul className="space-y-1">
                  {member.tasks.map((t) => (
                    <li key={t} className="flex items-start space-x-2 text-xs text-[#666666]">
                      <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0 mt-1.5" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Supervisors */}
          <div className="border-t border-gray-100 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#888888] mb-4">Supervisors</p>
            <div className="flex flex-wrap gap-4">
              {supervisors.map((s) => (
                <div key={s.name} className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <div className="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">{s.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2C2C2C]">{s.name}</p>
                    <p className="text-xs text-[#666666]">{s.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FadeUp>

      {/* ── Tech Stack ── */}
      <FadeUp delay={380}>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-[#2C2C2C] mb-6">Technology stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                label: 'Backend',
                dot: 'bg-[#0099FF]',
                items: [
                  'Python · FastAPI · Uvicorn',
                  'XGBoost · CatBoost · scikit-learn',
                  'Keras / TensorFlow (neural nets)',
                  'Pandas · NumPy · SciPy',
                  'Gemini AI (google-genai)',
                  'Pinecone (vector RAG index)',
                ],
              },
              {
                label: 'Frontend',
                dot: 'bg-[#E5001A]',
                items: [
                  'Next.js 16 · React 19',
                  'TypeScript · Tailwind CSS 4',
                  'Recharts (performance charts)',
                  'jsPDF + html2canvas (export)',
                  'Axios · react-hot-toast',
                ],
              },
              {
                label: 'ML pipeline',
                dot: 'bg-emerald-500',
                items: [
                  'Pearson + Cramér feature filtering',
                  'SHAP importance-based selection',
                  '4 cold-start sampling strategies',
                  'Optuna hyperparameter tuning',
                  '50+ trained model variants',
                ],
              },
            ].map((col) => (
              <div key={col.label}>
                <h3 className="text-sm font-semibold text-[#2C2C2C] mb-3">{col.label}</h3>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-center space-x-2 text-sm text-[#666666]">
                      <span className={`w-1.5 h-1.5 ${col.dot} rounded-full flex-shrink-0`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── AI Assistant ── */}
      <FadeUp delay={440}>
        <AboutChatbot />
      </FadeUp>

    </div>
  );
}
