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
import { useLanguage } from '../i18n/LanguageContext';
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
        transition:
          'opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      {children}
    </div>
  );
}

/* ─── static data that doesn't change with language ──────────────────────── */
const coreIcons = [Brain, Zap, Shield, Target];
const coreColors = [
  'from-[#0099FF] to-[#0066CC]',
  'from-[#E5001A] to-red-700',
  'from-emerald-600 to-emerald-800',
  'from-amber-500 to-amber-700',
];

const phaseIcons = [Database, GitBranch, Cpu, BarChart2, Rocket];
const phaseIconClasses = [
  'bg-violet-100 text-violet-700 border border-violet-200',
  'bg-blue-100 text-blue-700 border border-blue-200',
  'bg-emerald-100 text-emerald-700 border border-emerald-200',
  'bg-amber-100 text-amber-700 border border-amber-200',
  'bg-red-100 text-red-700 border border-red-200',
];
const phaseLabelClasses = [
  'text-violet-600',
  'text-blue-600',
  'text-emerald-600',
  'text-amber-600',
  'text-red-600',
];

const metricValues = ['0.8866', '0.6033', '76.3 %', '~23 %'];

const teamMembers = [
  { name: 'EL MOUAQUIT Nada',              initials: 'NE', color: 'from-violet-500 to-violet-700' },
  { name: 'GUIMEFACK Dany Anderson',        initials: 'DA', color: 'from-[#0099FF] to-[#0066CC]' },
  { name: 'NLEND Marie Flora',              initials: 'MF', color: 'from-emerald-500 to-emerald-700' },
  { name: 'OUEDRAOGO Aminata',              initials: 'AO', color: 'from-amber-500 to-amber-700' },
  { name: 'YARGA Tigbialimanu Cynthia',     initials: 'TC', color: 'from-[#E5001A] to-red-700' },
];

const supervisorNames = ['Noureddine SEDKI', 'Asmaa BENZMANE'];
const supervisorInitials = ['NS', 'AB'];

const stackDots = ['bg-[#0099FF]', 'bg-[#E5001A]', 'bg-emerald-500'];

/* ─── component ───────────────────────────────────────────────────────────── */
export default function AboutSection() {
  const { t } = useLanguage();
  const ap = t.aboutPage;

  return (
    <div className="space-y-10">

      {/* ── Hero ── */}
      <FadeUp delay={0}>
        <div className="bg-gradient-to-br from-[#0099FF] via-[#0077DD] to-[#0055BB] rounded-2xl shadow-2xl p-10 text-white overflow-hidden relative">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">
              {ap.badge}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              {ap.heroTitle}
            </h1>
            <p className="text-base opacity-90 leading-relaxed mb-2">{ap.heroDesc1}</p>
            <p className="text-sm opacity-70 leading-relaxed mb-6">{ap.heroDesc2}</p>
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

      {/* ── Problem & Answer ── */}
      <FadeUp delay={80}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-7 border border-gray-100 border-t-4 border-t-[#E5001A]">
            <h2 className="text-base font-bold text-[#2C2C2C] mb-3">{ap.problemTitle}</h2>
            <p className="text-sm text-[#666666] leading-relaxed mb-4">{ap.problemDesc}</p>
            <div className="bg-[#FFE6E9] rounded-xl p-4 border border-[#E5001A]/20">
              <p className="text-sm font-semibold text-[#E5001A] italic">{ap.problemQuote}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-7 border border-gray-100 border-t-4 border-t-[#0099FF]">
            <h2 className="text-base font-bold text-[#2C2C2C] mb-3">{ap.answerTitle}</h2>
            <p className="text-sm text-[#666666] leading-relaxed mb-3">{ap.answerDesc}</p>
            <ul className="space-y-2 text-sm text-[#666666]">
              {ap.answerBullets.map((item) => (
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
          {ap.coreIdeas.map((idea, i) => {
            const Icon = coreIcons[i];
            return (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={`w-11 h-11 bg-gradient-to-br ${coreColors[i]} rounded-xl flex items-center justify-center mb-4 shadow-sm`}>
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
          <h2 className="text-xl font-bold text-[#2C2C2C] mb-7">{ap.phasesTitle}</h2>
          <div className="space-y-0">
            {ap.phases.map((phase, i) => {
              const Icon = phaseIcons[i];
              return (
                <div key={i} className="relative flex space-x-5">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${phaseIconClasses[i]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {i < ap.phases.length - 1 && (
                      <div className="w-px flex-1 my-1 bg-gray-200" />
                    )}
                  </div>
                  <div className={`${i < ap.phases.length - 1 ? 'pb-7' : 'pb-0'}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${phaseLabelClasses[i]}`}>
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
          <h2 className="text-xl font-bold text-[#2C2C2C] mb-1">{ap.metricsTitle}</h2>
          <p className="text-sm text-[#666666] mb-6">{ap.metricsSubtitle}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ap.metrics.map((m, i) => (
              <div key={i} className="bg-[#E6F5FF] rounded-xl p-5 border border-[#0099FF]/20 text-center">
                <p className="text-xs text-[#666666] mb-1">{m.label}</p>
                <p className="text-2xl font-bold text-[#0099FF] mb-1">{metricValues[i]}</p>
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
            <h2 className="text-xl font-bold text-[#2C2C2C]">{ap.teamTitle}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {teamMembers.map((member, i) => {
              const translated = ap.team[i];
              return (
                <div
                  key={member.name}
                  className="rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-11 h-11 bg-gradient-to-br ${member.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <span className="text-white font-bold text-sm">{member.initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2C2C2C] leading-tight">{member.name}</p>
                      <p className="text-xs text-[#666666] mt-0.5">{translated.role}</p>
                    </div>
                  </div>
                  <ul className="space-y-1">
                    {translated.tasks.map((task) => (
                      <li key={task} className="flex items-start space-x-2 text-xs text-[#666666]">
                        <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0 mt-1.5" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#888888] mb-4">
              {ap.supervisorsLabel}
            </p>
            <div className="flex flex-wrap gap-4">
              {supervisorNames.map((name, i) => (
                <div key={name} className="flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <div className="w-9 h-9 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs">{supervisorInitials[i]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2C2C2C]">{name}</p>
                    <p className="text-xs text-[#666666]">{ap.supervisors[i].role}</p>
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
          <h2 className="text-xl font-bold text-[#2C2C2C] mb-6">{ap.stackTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ap.stackCols.map((col, ci) => (
              <div key={ci}>
                <h3 className="text-sm font-semibold text-[#2C2C2C] mb-3">{col.label}</h3>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-center space-x-2 text-sm text-[#666666]">
                      <span className={`w-1.5 h-1.5 ${stackDots[ci]} rounded-full flex-shrink-0`} />
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
