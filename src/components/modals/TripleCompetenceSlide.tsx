import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, CheckCircle2, ArrowRight, Eye, Hammer, Share2, 
  Users, Award, Lightbulb, Compass, Code, GraduationCap, ExternalLink,
  ShieldCheck, Cpu, Database
} from 'lucide-react';
import { ZenikaLogo } from '../brand/ZenikaLogo';
import { ZenikaMonogram } from '../brand/ZenikaMonogram';

interface TripleCompetenceSlideProps {
  lang: 'fr' | 'en';
  onOpenContact?: () => void;
  onExploreSolutions?: () => void;
  compact?: boolean;
}

type StageId = 'all' | 'vision' | 'build' | 'share';

export const TripleCompetenceSlide: React.FC<TripleCompetenceSlideProps> = ({
  lang,
  onOpenContact,
  onExploreSolutions,
  compact = false
}) => {
  const [activeStage, setActiveStage] = useState<StageId>('all');
  const [hoveredPhoto, setHoveredPhoto] = useState<string | null>(null);

  const stages = [
    {
      id: 'vision' as const,
      label: 'Vision',
      titleFr: 'Analyse & Vision Produit',
      titleEn: 'Product Analysis & Vision',
      descFr: 'Audit, stratégie IT, alignement des solutions sur les besoins métiers (incluant design, tech, et data).',
      descEn: 'Audit, IT strategy, alignment of solutions with business priorities (including design, tech, and data).',
      deliverablesFr: ['Schémas directeurs & audits d\'architecture', 'Cadrage stratégique IA & Cloud', 'Product Management & Discovery'],
      deliverablesEn: ['Masterplans & Architecture Audits', 'Strategic AI & Cloud Scoping', 'Product Management & Discovery'],
      icon: Eye,
      color: '#E60039',
      role: 'Consultant-Architecte & Strategic Advisor'
    },
    {
      id: 'build' as const,
      label: 'Build',
      titleFr: 'Conception & Exécution',
      titleEn: 'Design & Execution',
      descFr: 'Prototyper, tester. Développer et déployer des solutions concrètes.',
      descEn: 'Prototype, test. Develop and deploy production-grade concrete solutions.',
      deliverablesFr: ['Squads pluridisciplinaires agiles', 'Architectures distribuées & Modern Software', 'Ingénierie Data, LLMOps & DevOps'],
      deliverablesEn: ['Agile Cross-Functional Squads', 'Distributed & Modern Software Arch', 'Data Engineering, LLMOps & DevOps'],
      icon: Hammer,
      color: '#FF2E56',
      role: 'Tech Lead & Senior Software Craftsman'
    },
    {
      id: 'share' as const,
      label: 'Share',
      titleFr: 'Transmission & Accompagnement',
      titleEn: 'Knowledge Sharing & Upskilling',
      descFr: 'Partager les savoirs pour rendre les équipes autonomes.',
      descEn: 'Share expertise and know-how to empower internal teams towards full autonomy.',
      deliverablesFr: ['Zenika Training (catalogue de 100+ formations)', 'Coaching d\'équipe & mentorat technique', 'Conférences tech & Open Source'],
      deliverablesEn: ['Zenika Training (100+ course catalog)', 'Team Coaching & Technical Mentoring', 'Tech Conferences & Open Source'],
      icon: Share2,
      color: '#D40033',
      role: 'Certified Trainer & Agile Coach'
    }
  ];

  // Pôles d'expertise et pratiques d'ingénierie Zenika
  const practiceHubs = [
    {
      id: 'h1',
      name: 'Pôle Stratégie & Architecture SI',
      role: 'Urbanisation, Cloud Hybride & Cadrage',
      stage: 'vision',
      icon: Compass,
      color: '#5090F4',
      pos: 'top-[3%] left-[25%]',
      size: 'w-14 h-14 sm:w-16 sm:h-16',
      caption: 'Stratégie IT & Cadrage'
    },
    {
      id: 'h2',
      name: 'Pôle Sécurité & Cloud Souverain',
      role: 'SecNumCloud, Zero-Trust & FinOps',
      stage: 'vision',
      icon: ShieldCheck,
      color: '#5090F4',
      pos: 'top-[44%] left-[4%]',
      size: 'w-14 h-14 sm:w-16 sm:h-16',
      caption: 'Audit & Urbanisation'
    },
    {
      id: 'h3',
      name: 'Pôle Product Strategy & UX',
      role: 'Discovery, Impact Mapping & Design System',
      stage: 'vision',
      icon: Lightbulb,
      color: '#5090F4',
      pos: 'bottom-[12%] left-[14%]',
      size: 'w-14 h-14 sm:w-16 sm:h-16',
      caption: 'Discovery & Design'
    },
    {
      id: 'h4',
      name: 'Pôle GenAI & Agents Intelligents',
      role: 'Architecture LLM, RAG & Agents IA',
      stage: 'build',
      icon: Cpu,
      color: '#E60039',
      pos: 'top-[3%] right-[25%]',
      size: 'w-14 h-14 sm:w-16 sm:h-16',
      caption: 'Prototypage & Déploiement IA'
    },
    {
      id: 'h5',
      name: 'Pôle Software Craftsmanship',
      role: 'TDD, Clean Code, Pair Programming & DDD',
      stage: 'build',
      icon: Code,
      color: '#E60039',
      pos: 'top-[22%] right-[24%]',
      size: 'w-14 h-14 sm:w-16 sm:h-16',
      caption: 'Craftsmanship & Qualité'
    },
    {
      id: 'h6',
      name: 'Pôle Data Platform & LLMOps',
      role: 'Pipelines temps réel, Streaming & MLOps',
      stage: 'build',
      icon: Database,
      color: '#E60039',
      pos: 'bottom-[42%] right-[8%]',
      size: 'w-14 h-14 sm:w-16 sm:h-16',
      caption: 'Ingénierie Data & Squads'
    },
    {
      id: 'h7',
      name: 'Zenika Training Academy',
      role: '100+ Formations certifiantes & Acculturation IA',
      stage: 'share',
      icon: GraduationCap,
      color: '#F59E0B',
      pos: 'bottom-[16%] right-[30%]',
      size: 'w-14 h-14 sm:w-16 sm:h-16',
      caption: 'Conférences & Training'
    },
    {
      id: 'h8',
      name: 'Dojo d\'Accélération & Coaching',
      role: 'Mentorat d’équipes & Autonomie agile',
      stage: 'share',
      icon: Users,
      color: '#F59E0B',
      pos: 'bottom-[6%] left-[32%]',
      size: 'w-14 h-14 sm:w-16 sm:h-16',
      caption: 'Transmission & Autonomie'
    }
  ];

  return (
    <section 
      id="triple-competence" 
      className="relative w-full py-16 sm:py-24 bg-slate-50 dark:bg-[#0A0D14] text-slate-900 dark:text-white overflow-hidden border-y border-slate-200 dark:border-white/10 transition-colors duration-200"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#E60039]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E60039]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Watermark sidebar on right as in original slide */}
      <div className="hidden 2xl:block absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 origin-right text-[11px] font-mono tracking-widest text-slate-400 dark:text-white/20 select-none pointer-events-none whitespace-nowrap">
        © ZENIKA 2026 All rights reserved - Proprietary & confidential
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header matching slide */}
        <div className="flex items-start justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-3xl">
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E60039] animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-widest text-slate-700 dark:text-white/80 font-bold">
                ZENIKA
              </span>
              <span className="text-slate-300 dark:text-white/30 font-mono text-xs">·</span>
              <span className="text-[#E60039] text-xs font-mono font-semibold">
                {lang === 'fr' ? 'Triple Compétence' : 'Triple Expertise'}
              </span>
            </div>

            {/* Slide Title */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight leading-tight">
              {lang === 'fr'
                ? 'Une triple compétence au service de vos enjeux IT'
                : 'A triple capability tailored to your strategic IT stakes'}
            </h2>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-white/70 leading-relaxed max-w-2xl font-normal">
              {lang === 'fr'
                ? 'Nos consultants sont des professionnels expérimentés et acteurs de la révolution numérique qui alternent entre ces 3 engagements.'
                : 'Our consultants are seasoned practitioners and drivers of the digital revolution who actively alternate across these 3 engagements.'}
            </p>
          </div>

          {/* Top Right Zenika Badge */}
          <div className="shrink-0 hidden md:block">
            <ZenikaMonogram size={48} variant="color" glow />
          </div>
        </div>

        {/* Interactive Selector Tabs to explore the 3 stages */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-200 dark:border-white/10">
          <span className="text-xs font-mono text-slate-500 dark:text-white/50 mr-2">
            {lang === 'fr' ? 'Explorer l\'alternance :' : 'Explore alternation:'}
          </span>
          <button
            onClick={() => setActiveStage('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
              activeStage === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-md'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:bg-white/5 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10'
            }`}
          >
            {lang === 'fr' ? 'Les 3 engagements réunis' : 'All 3 commitments unified'}
          </button>
          {stages.map((st) => (
            <button
              key={st.id}
              onClick={() => setActiveStage(st.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                activeStage === st.id
                  ? 'bg-[#E60039] text-white font-bold shadow-lg shadow-[#E60039]/30'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 dark:bg-white/5 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10'
              }`}
            >
              <st.icon size={13} />
              <span>{st.label} · {lang === 'fr' ? st.titleFr : st.titleEn}</span>
            </button>
          ))}
        </div>

        {/* MAIN STAGE COMPOSITION: CENTER CIRCULAR "Z" EMBLEM + CIRCULAR PHOTOS + SURROUNDING TEXT BLOCKS */}
        <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center">

          {/* ======================================================== */}
          {/* THE 3 OVERLAPPING STRATEGIC CIRCLES & CENTER SPIROGRAPH Z */}
          {/* Authentic Graphic (Fichier 5.svg & Fichier 3.svg)          */}
          {/* ======================================================== */}
          <div className="relative z-20 flex items-center justify-center my-10 lg:my-0">
            <motion.div
              animate={{
                scale: activeStage !== 'all' ? [1, 1.02, 1] : 1
              }}
              transition={{ duration: 0.5 }}
              className="w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[540px] lg:h-[540px] relative flex items-center justify-center select-none"
            >
              <svg
                viewBox="0 0 800 800"
                className="w-full h-full overflow-visible drop-shadow-2xl"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Circle 1: Vision / Conseil - Warm Amber/Orange */}
                  <radialGradient id="slide-grad-vision" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.88" />
                    <stop offset="100%" stopColor="#EA580C" stopOpacity="0.82" />
                  </radialGradient>

                  {/* Circle 2: Build / Réalisation - Crimson Red */}
                  <radialGradient id="slide-grad-build" cx="45%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FF4D6D" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#E60039" stopOpacity="0.90" />
                    <stop offset="100%" stopColor="#BA0046" stopOpacity="0.85" />
                  </radialGradient>

                  {/* Circle 3: Share / Formation - Indigo / Violet */}
                  <radialGradient id="slide-grad-share" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#818CF8" stopOpacity="0.92" />
                    <stop offset="60%" stopColor="#6366F1" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.80" />
                  </radialGradient>

                  {/* Official Zenika Red to Carmine Gradient */}
                  <linearGradient id="slide-grad-zenika-brand" x1="5%" y1="15%" x2="95%" y2="85%">
                    <stop offset="0%" stopColor="#EE1C25" />
                    <stop offset="40%" stopColor="#E60039" />
                    <stop offset="100%" stopColor="#BA0046" />
                  </linearGradient>

                  <clipPath id="slide-zenika-center-clip">
                    <circle cx="250" cy="250" r="250" />
                  </clipPath>

                  {/* Arrow marker */}
                  <marker
                    id="arrow-red"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#E60039" />
                  </marker>
                </defs>

                {/* Outer wireframe guilloché mesh */}
                <g opacity="0.4" strokeWidth="0.75" fill="none">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const angle = (i * 15 * Math.PI) / 180;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);
                    return (
                      <ellipse
                        key={`slide-mesh-${i}`}
                        cx={400 + cos * 40}
                        cy={370 + sin * 40}
                        rx={330}
                        ry={270}
                        transform={`rotate(${i * 15}, 400, 370)`}
                        stroke={i % 2 === 0 ? '#F59E0B' : '#FF6B8B'}
                        opacity={0.3 + (i % 3) * 0.15}
                      />
                    );
                  })}
                </g>

                {/* 1. TOP-LEFT CIRCLE: VISION */}
                <g
                  onClick={() => setActiveStage('vision')}
                  className="cursor-pointer transition-all duration-300 group/vision"
                  style={{
                    transform: activeStage === 'vision' ? 'scale(1.03)' : 'scale(1)',
                    transformOrigin: '290px 280px'
                  }}
                >
                  <circle
                    cx="290"
                    cy="280"
                    r="215"
                    fill="url(#slide-grad-vision)"
                    className="transition-opacity duration-300"
                    opacity={activeStage === 'vision' || activeStage === 'all' ? 0.90 : 0.35}
                  />
                  <circle
                    cx="290"
                    cy="280"
                    r="215"
                    fill="none"
                    stroke={activeStage === 'vision' ? '#F59E0B' : 'rgba(255,255,255,0.45)'}
                    strokeWidth={activeStage === 'vision' ? 4 : 1.5}
                  />
                  <text x="210" y="240" fill="#FFFFFF" fontSize="22" fontWeight="bold" fontFamily="Montserrat, sans-serif" textAnchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
                    Vision
                  </text>
                  <text x="210" y="264" fill="#FFFFFF" opacity="0.9" fontSize="12" fontFamily="Nunito, sans-serif" textAnchor="middle">
                    [ CONSEIL ]
                  </text>
                </g>

                {/* 2. TOP-RIGHT CIRCLE: BUILD */}
                <g
                  onClick={() => setActiveStage('build')}
                  className="cursor-pointer transition-all duration-300 group/build"
                  style={{
                    transform: activeStage === 'build' ? 'scale(1.03)' : 'scale(1)',
                    transformOrigin: '510px 280px'
                  }}
                >
                  <circle
                    cx="510"
                    cy="280"
                    r="215"
                    fill="url(#slide-grad-build)"
                    className="transition-opacity duration-300"
                    opacity={activeStage === 'build' || activeStage === 'all' ? 0.90 : 0.35}
                  />
                  <circle
                    cx="510"
                    cy="280"
                    r="215"
                    fill="none"
                    stroke={activeStage === 'build' ? '#E60039' : 'rgba(255,255,255,0.45)'}
                    strokeWidth={activeStage === 'build' ? 4 : 1.5}
                  />
                  <text x="590" y="240" fill="#FFFFFF" fontSize="22" fontWeight="bold" fontFamily="Montserrat, sans-serif" textAnchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
                    Build
                  </text>
                  <text x="590" y="264" fill="#FFFFFF" opacity="0.9" fontSize="12" fontFamily="Nunito, sans-serif" textAnchor="middle">
                    [ RÉALISATION ]
                  </text>
                </g>

                {/* 3. BOTTOM CIRCLE: SHARE */}
                <g
                  onClick={() => setActiveStage('share')}
                  className="cursor-pointer transition-all duration-300 group/share"
                  style={{
                    transform: activeStage === 'share' ? 'scale(1.03)' : 'scale(1)',
                    transformOrigin: '400px 485px'
                  }}
                >
                  <circle
                    cx="400"
                    cy="485"
                    r="215"
                    fill="url(#slide-grad-share)"
                    className="transition-opacity duration-300"
                    opacity={activeStage === 'share' || activeStage === 'all' ? 0.90 : 0.35}
                  />
                  <circle
                    cx="400"
                    cy="485"
                    r="215"
                    fill="none"
                    stroke={activeStage === 'share' ? '#6366F1' : 'rgba(255,255,255,0.45)'}
                    strokeWidth={activeStage === 'share' ? 4 : 1.5}
                  />
                  <text x="400" y="580" fill="#FFFFFF" fontSize="22" fontWeight="bold" fontFamily="Montserrat, sans-serif" textAnchor="middle" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
                    Share
                  </text>
                  <text x="400" y="604" fill="#FFFFFF" opacity="0.9" fontSize="12" fontFamily="Nunito, sans-serif" textAnchor="middle">
                    [ FORMATION ]
                  </text>
                </g>

                {/* ========================================================== */}
                {/* CENTER CONVERGENCE: ZENIKA LOGO ONLY                      */}
                {/* ========================================================== */}
                <g
                  onClick={() => setActiveStage('all')}
                  className="cursor-pointer transition-transform duration-300 hover:scale-105"
                  style={{
                    transform: activeStage === 'all' ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: '400px 365px'
                  }}
                >
                  {/* Official Zenika Logo */}
                  <g transform="translate(400, 365)">
                    <circle
                      cx="0"
                      cy="0"
                      r="82"
                      fill="none"
                      stroke={activeStage === 'all' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.45)'}
                      strokeWidth={activeStage === 'all' ? 2.5 : 1.5}
                      className="transition-all duration-300"
                    />

                    {/* Scaled Official Zenika Logo Badge */}
                    <g transform="scale(0.32) translate(-250, -250)">
                      <g clipPath="url(#slide-zenika-center-clip)">
                        <rect width="500" height="500" fill="url(#slide-grad-zenika-brand)" />
                        <path
                          d="M -20 168
                             L 340 124
                             C 368 121 392 138 392 162
                             C 392 178 382 192 368 204
                             L 214 318
                             L 520 280
                             L 520 346
                             L 160 376
                             C 132 379 108 362 108 338
                             C 108 322 118 308 132 296
                             L 286 182
                             L -20 234
                             Z"
                          fill="#FFFFFF"
                        />
                      </g>
                    </g>
                  </g>
                </g>
              </svg>

              {/* Pulsing Hint Badge */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-wider uppercase text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                {lang === 'fr' ? 'Vision · Build · Share · Triple Compétence' : 'Vision · Build · Share · Triple Capability'}
              </div>
            </motion.div>
          </div>

          {/* ======================================================== */}
          {/* ORBITING CIRCULAR PRACTICE HUBS (Visible on md/lg/xl)      */}
          {/* ======================================================== */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            {practiceHubs.map((hub) => {
              const isDimmed = activeStage !== 'all' && activeStage !== hub.stage;
              const isHighlighted = activeStage === hub.stage;
              const HubIcon = hub.icon;

              return (
                <div
                  key={hub.id}
                  className={`absolute ${hub.pos} pointer-events-auto transition-all duration-300 ${
                    isDimmed ? 'opacity-25 scale-90 grayscale' : 'opacity-100 scale-100'
                  }`}
                  onMouseEnter={() => setHoveredPhoto(hub.id)}
                  onMouseLeave={() => setHoveredPhoto(null)}
                >
                  <div className="relative group">
                    <div
                      className={`${hub.size} rounded-full flex items-center justify-center border-2 sm:border-[2.5px] ${
                        isHighlighted 
                          ? 'border-[#E60039] bg-white dark:bg-[#111622] text-[#E60039] ring-4 ring-[#E60039]/40 shadow-xl shadow-[#E60039]/40' 
                          : 'border-slate-300 dark:border-white/20 bg-white/95 dark:bg-[#121622]/95 text-slate-800 dark:text-white hover:border-[#E60039] hover:text-[#E60039] shadow-lg'
                      } transition-all duration-300 hover:scale-110 cursor-pointer backdrop-blur-md`}
                    >
                      <HubIcon size={24} style={{ color: isHighlighted ? '#E60039' : hub.color }} className="transition-transform group-hover:scale-110" />
                    </div>

                    {/* Popover badge on hover */}
                    <AnimatePresence>
                      {hoveredPhoto === hub.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.95 }}
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-3 rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white text-left shadow-2xl z-40 pointer-events-none"
                        >
                          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hub.color }} />
                            <span>{hub.name}</span>
                          </div>
                          <div className="text-[10px] text-[#E60039] font-mono font-semibold mt-0.5">{hub.role}</div>
                          <div className="text-[10px] text-slate-500 dark:text-white/60 mt-1">{hub.caption}</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ======================================================== */}
          {/* THE 3 CORNER DESCRIPTIVE CONTENT BLOCKS (Matching slide layout) */}
          {/* ======================================================== */}

          {/* 1. LEFT: Analyse & Vision Produit */}
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={lang === 'fr' ? 'Pilier 01 : Analyse & Vision Produit' : 'Pillar 01: Product Analysis & Vision'}
            animate={{
              opacity: activeStage === 'all' || activeStage === 'vision' ? 1 : 0.35,
              x: activeStage === 'vision' ? 10 : 0
            }}
            onClick={() => setActiveStage('vision')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveStage('vision');
              }
            }}
            className={`w-full lg:w-80 lg:absolute lg:top-8 lg:left-0 z-30 p-5 rounded-2xl backdrop-blur-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E60039]/50 ${
              activeStage === 'vision'
                ? 'bg-white dark:bg-white/10 border-[#E60039] shadow-xl shadow-[#E60039]/15 text-slate-900 dark:text-white'
                : 'bg-white/90 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 hover:bg-white text-slate-800 dark:text-white shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-[#E60039]">
              <Eye size={18} />
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase">01 · VISION</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display mb-2">
              {lang === 'fr' ? 'Analyse & Vision Produit' : 'Product Analysis & Vision'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed">
              {lang === 'fr'
                ? 'Audit, stratégie IT, alignement des solutions sur les besoins métiers (incluant design, tech, et data).'
                : 'Audit, IT strategy, alignment of solutions with business priorities (including design, tech, and data).'}
            </p>
            {activeStage === 'vision' && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5">
                {stages[0].deliverablesFr.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-white/90">
                    <CheckCircle2 size={12} className="text-[#E60039] shrink-0" />
                    <span>{lang === 'fr' ? d : stages[0].deliverablesEn[i]}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* 2. TOP RIGHT: Conception & Exécution (Build) */}
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={lang === 'fr' ? 'Pilier 02 : Conception & Exécution' : 'Pillar 02: Design & Execution'}
            animate={{
              opacity: activeStage === 'all' || activeStage === 'build' ? 1 : 0.35,
              x: activeStage === 'build' ? -10 : 0
            }}
            onClick={() => setActiveStage('build')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveStage('build');
              }
            }}
            className={`w-full lg:w-80 lg:absolute lg:top-8 lg:right-0 z-30 p-5 rounded-2xl backdrop-blur-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E60039]/50 ${
              activeStage === 'build'
                ? 'bg-white dark:bg-white/10 border-[#E60039] shadow-xl shadow-[#E60039]/15 text-slate-900 dark:text-white'
                : 'bg-white/90 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 hover:bg-white text-slate-800 dark:text-white shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-[#E60039]">
              <Hammer size={18} />
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase">02 · BUILD</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display mb-2">
              {lang === 'fr' ? 'Conception & Exécution' : 'Design & Execution'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed">
              {lang === 'fr'
                ? 'Prototyper, tester. Développer et déployer des solutions concrètes.'
                : 'Prototype, test. Develop and deploy production-grade concrete solutions.'}
            </p>
            {activeStage === 'build' && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 space-y-1.5">
                {stages[1].deliverablesFr.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-white/90">
                    <CheckCircle2 size={12} className="text-[#E60039] shrink-0" />
                    <span>{lang === 'fr' ? d : stages[1].deliverablesEn[i]}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* 3. BOTTOM RIGHT: Transmission & Accompagnement (Share) */}
          <motion.div
            role="button"
            tabIndex={0}
            aria-label={lang === 'fr' ? 'Pilier 03 : Transmission & Accompagnement' : 'Pillar 03: Knowledge Sharing & Upskilling'}
            animate={{
              opacity: activeStage === 'all' || activeStage === 'share' ? 1 : 0.35,
              x: activeStage === 'share' ? -10 : 0
            }}
            onClick={() => setActiveStage('share')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveStage('share');
              }
            }}
            className={`w-full lg:w-80 lg:absolute lg:bottom-4 lg:right-0 z-30 p-5 rounded-2xl backdrop-blur-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E60039]/50 ${
              activeStage === 'share'
                ? 'bg-white dark:bg-white/10 border-[#E60039] shadow-xl shadow-[#E60039]/15 text-slate-900 dark:text-white'
                : 'bg-white/90 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/25 hover:bg-white text-slate-800 dark:text-white shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 mb-2 text-[#E60039]">
              <Share2 size={18} />
              <span className="font-mono text-[11px] font-bold tracking-wider uppercase">03 · SHARE</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-display mb-2">
              {lang === 'fr' ? 'Transmission & Accompagnement' : 'Knowledge Sharing & Upskilling'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-white/70 leading-relaxed">
              {lang === 'fr'
                ? 'Partager les savoirs pour rendre les équipes autonomes.'
                : 'Share expertise and know-how to empower internal teams towards full autonomy.'}
            </p>
            {activeStage === 'share' && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 space-y-2">
                <a
                  href={lang === 'fr' ? 'https://training.zenika.com/fr' : 'https://training.zenika.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E60039]/10 text-[#E60039] font-mono text-xs font-bold hover:bg-[#E60039]/20 transition-colors"
                >
                  <GraduationCap size={13} />
                  <span>{lang === 'fr' ? 'Consulter le catalogue Zenika Training' : 'Browse Zenika Training catalog'}</span>
                  <ExternalLink size={11} />
                </a>
                {stages[2].deliverablesFr.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-800 dark:text-white/90">
                    <CheckCircle2 size={12} className="text-[#E60039] shrink-0" />
                    <span>{lang === 'fr' ? d : stages[2].deliverablesEn[i]}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* BOTTOM CALLOUT CARD (Exact wording from the slide with the red-pink gradient line) */}
        <div className="mt-14 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm sm:text-base lg:text-lg font-medium text-slate-900 dark:text-white/90 leading-relaxed">
              {lang === 'fr'
                ? 'Cette triple compétence est la garantie de savoir s’adapter à toutes les situations et maximiser la valeur livrée à nos clients.'
                : 'This triple capability guarantees seamless adaptability to every strategic context, maximizing concrete business value delivered to our clients.'}
            </p>

            {/* The signature red-to-pink gradient line from the slide */}
            <div className="w-48 sm:w-64 h-1.5 rounded-full bg-gradient-to-r from-[#E60039] via-[#FF2E56] to-[#D40033]" />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onOpenContact && (
              <button
                onClick={onOpenContact}
                className="px-6 py-3 rounded-xl bg-[#E60039] hover:bg-[#FF2E56] text-white text-xs font-mono font-bold shadow-lg shadow-[#E60039]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles size={14} />
                <span>{lang === 'fr' ? 'Échanger avec un consultant' : 'Consult an expert'}</span>
              </button>
            )}

            {onExploreSolutions && (
              <button
                onClick={onExploreSolutions}
                className="px-5 py-3 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-800 dark:text-white text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <span>{lang === 'fr' ? 'Découvrir nos offres' : 'Explore solution blocks'}</span>
                <ArrowRight size={14} className="text-slate-400 dark:text-white/60" />
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
