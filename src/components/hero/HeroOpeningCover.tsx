import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  ArrowDown, 
  Sparkles, 
  Code2, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Compass, 
  Search, 
  Star, 
  Heart, 
  Wrench, 
  Hammer,
  Play, 
  Pause,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ZenikaExtrudedMonogram } from '../brand/ZenikaExtrudedMonogram';
import { HeroIntroVideoScroll } from './HeroIntroVideoScroll';
import { useTheme } from '../../context/ThemeContext';
import { Language } from '../../types';

// Code-splitting: Lazy load alternative intros so only V3 is loaded initially
const TrailingCirclesCanvas = lazy(() => import('./TrailingCirclesCanvas').then(m => ({ default: m.TrailingCirclesCanvas })));
const StoryboardCinematicCanvas = lazy(() => import('./StoryboardCinematicCanvas').then(m => ({ default: m.StoryboardCinematicCanvas })));
const HeroIntroVideoMask = lazy(() => import('./HeroIntroVideoMask').then(m => ({ default: m.HeroIntroVideoMask })));

interface HeroOpeningCoverProps {
  lang: Language;
  onDiscover?: () => void;
}

export type IntroVersion = 'v1' | 'v2' | 'v3' | 'v4';

export const HeroOpeningCover: React.FC<HeroOpeningCoverProps> = ({ lang, onDiscover }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Toggle between Intro V1 (Tubes 3D & Traces Néon), V2 (Storyboarded 3-Stage Morphing), V3 (Manifeste Scroll & Mots Monumentaux Réductibles), and V4 (Black & White Video + Chromatic Mask Text)
  // Only V3 (HeroIntroVideoScroll) is shipped: it renders no version switcher,
  // so V1 (this file), V2 (StoryboardCinematicCanvas) and V4 (HeroIntroVideoMask)
  // are unreachable prototypes kept for reference. Change the default to preview them.
  const [introVersion, setIntroVersion] = useState<IntroVersion>('v3');

  // V2 Storyboard Morphing Stages: 1 -> 2 -> 3 -> loop
  const [v2Stage, setV2Stage] = useState<1 | 2 | 3>(1);
  const [isV2Autoplay, setIsV2Autoplay] = useState<boolean>(true);
  const [stageProgress, setStageProgress] = useState<number>(0);

  // Auto-advance V2 stages smoothly if autoplay is enabled
  useEffect(() => {
    if (introVersion !== 'v2' || !isV2Autoplay) return;

    const stageDuration = 4800; // ms per stage
    const updateFreq = 40; // ms
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += updateFreq;
      const pct = Math.min(100, (elapsed / stageDuration) * 100);
      setStageProgress(pct);

      if (elapsed >= stageDuration) {
        elapsed = 0;
        setStageProgress(0);
        setV2Stage((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1));
      }
    }, updateFreq);

    return () => clearInterval(timer);
  }, [introVersion, isV2Autoplay, v2Stage]);

  // V1 Keywords
  const keywords = [
    {
      id: 'craft',
      labelFr: 'Artisanat du Code (Craft)',
      labelEn: 'Software Craftsmanship',
      subFr: 'Excellence algorithmique, TDD & Clean Architecture',
      subEn: 'Algorithmic excellence, TDD & Clean Architecture',
      icon: Code2,
      accent: '#E60039'
    },
    {
      id: 'tech-dir',
      labelFr: 'Direction Technique d’Élite',
      labelEn: 'Elite Technical Leadership',
      subFr: 'CTO Advisory, gouvernance & modernisation SI',
      subEn: 'CTO Advisory, governance & IT modernization',
      icon: ShieldCheck,
      accent: '#8B5CF6'
    },
    {
      id: 'ai',
      labelFr: 'IA Agentique & Souveraine',
      labelEn: 'Agentic & Sovereign AI',
      subFr: 'Modèles ouverts, RAG avancé & SecNumCloud',
      subEn: 'Open models, advanced RAG & SecNumCloud',
      icon: Cpu,
      accent: '#06B6D4'
    },
    {
      id: 'arch',
      labelFr: 'Design & Architecture Distribuée',
      labelEn: 'Distributed System Design',
      subFr: 'Événementiel, Cloud-Native & résilience DORA',
      subEn: 'Event-driven, Cloud-Native & DORA resilience',
      icon: Terminal,
      accent: '#F59E0B'
    },
    {
      id: 'transmission',
      labelFr: 'Transmission & Open Source',
      labelEn: 'Knowledge Sharing & Open Source',
      subFr: '100+ cursus Qualiopi, conférences & Meetups',
      subEn: '100+ certified courses, conferences & Meetups',
      icon: Compass,
      accent: '#EC4899'
    }
  ];

  const [activeKeywordIndex, setActiveKeywordIndex] = useState(0);

  useEffect(() => {
    if (introVersion !== 'v1') return;
    const timer = setInterval(() => {
      setActiveKeywordIndex((prev) => (prev + 1) % keywords.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [keywords.length, introVersion]);

  const handleScrollToContent = () => {
    if (onDiscover) {
      onDiscover();
    } else {
      const target = document.getElementById('main-content') || document.getElementById('why');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    }
  };

  const activeKeyword = keywords[activeKeywordIndex];

  if (introVersion === 'v4') {
    return (
      <HeroIntroVideoMask
        lang={lang}
        onDiscover={handleScrollToContent}
        introVersion={introVersion}
        onVersionChange={setIntroVersion}
      />
    );
  }

  if (introVersion === 'v3') {
    return (
      <HeroIntroVideoScroll
        lang={lang}
        onDiscover={handleScrollToContent}
        introVersion={introVersion}
        onVersionChange={setIntroVersion}
      />
    );
  }

  return (
    <section 
      id="hero-cover"
      className="min-h-screen w-full relative flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 py-5 sm:py-7 overflow-hidden bg-slate-50 dark:bg-[#05070B] text-slate-900 dark:text-white transition-colors duration-300 select-none border-b border-slate-200/80 dark:border-white/10"
    >
      {/* BACKGROUND CANVAS BASED ON VERSION */}
      {introVersion === 'v1' ? (
        <TrailingCirclesCanvas isDark={isDark} />
      ) : (
        <StoryboardCinematicCanvas isDark={isDark} step={v2Stage} />
      )}

      {/* Subtle background gradient to guarantee contrast */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-slate-50/15 dark:via-[#05070B]/25 to-slate-50/85 dark:to-[#05070B]/90"
      />

      {/* TOP FLOATING CONTROLS: Logo Mark, V1 / V2 / V3 Switcher, and Skip Intro CTA */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-30 w-full max-w-[1720px] flex items-center justify-between pointer-events-auto"
      >
        {/* Left spacer to keep center switcher perfectly balanced */}
        <div className="w-24 sm:w-32 hidden sm:block" />

        {/* Center: V1 / V2 / V3 Switcher */}
        <div className="flex items-center p-1 rounded-full backdrop-blur-xl bg-white/80 dark:bg-white/[0.08] border border-slate-300/80 dark:border-white/15 shadow-sm mx-auto sm:mx-0">
          <button
            onClick={() => setIntroVersion('v1')}
            className={`px-3.5 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              introVersion === 'v1'
                ? 'bg-[#E60039] text-white shadow-xs'
                : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>V1 · Tubes 3D & Traces</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </button>
          <button
            onClick={() => setIntroVersion('v2')}
            className={`px-3.5 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              introVersion === 'v2'
                ? 'bg-[#E60039] text-white shadow-xs'
                : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>V2 · Storyboard</span>
          </button>
          <button
            onClick={() => setIntroVersion('v3')}
            className="px-3.5 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white"
          >
            <span>V3 · Spirale Infinie & Tubes</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </button>
          <button
            onClick={() => setIntroVersion('v4')}
            className="px-3.5 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white"
          >
            <span>V4 · Masque N&B / Couleur</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </button>
        </div>

        {/* Enter Direct CTA */}
        <div className="w-24 sm:w-32 flex justify-end">
          <button
            onClick={handleScrollToContent}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-slate-700 dark:text-white/80 hover:text-white bg-white/70 dark:bg-white/[0.06] hover:bg-[#E60039] dark:hover:bg-[#E60039] border border-slate-300/80 dark:border-white/15 hover:border-[#E60039] transition-all cursor-pointer backdrop-blur-md"
          >
            <span className="hidden sm:inline">{lang === 'fr' ? 'Passer l’intro' : 'Skip intro'}</span>
            <ArrowDown size={13} />
          </button>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* INTRO VERSION 1: KINETIC ORBS & ROTATING STRATEGIC PILLARS */}
      {/* ========================================================================= */}
      {introVersion === 'v1' && (
        <div className="relative z-20 w-full max-w-[1380px] my-auto py-6 sm:py-10 flex flex-col items-center text-center pointer-events-none">
          {/* High-Impact Brand Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-4 max-w-5xl mx-auto"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-display tracking-tight text-slate-950 dark:text-white uppercase leading-[0.98]">
              {lang === 'fr' ? (
                <>
                  L’ALLIANCE DE LA HAUTE INGÉNIERIE <br />
                  <span className="text-[#E60039] font-serif italic lowercase font-light">et du design</span> TECHNOLOGIQUE<span className="text-[#E60039]">.</span>
                </>
              ) : (
                <>
                  THE ALLIANCE OF HIGH ENGINEERING <br />
                  <span className="text-[#E60039] font-serif italic lowercase font-light">and technology</span> DESIGN<span className="text-[#E60039]">.</span>
                </>
              )}
            </h1>

            {/* The Official Intro Hook & Signature Proposition */}
            <div className="pt-2 max-w-3xl mx-auto space-y-2">
              <p className="text-sm sm:text-base md:text-lg font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'fr' ? (
                  "À l'ère de l'IA et du Cloud, la tech investit le cœur des stratégies d’entreprises, mais l’IT peine souvent à produire de la valeur au rythme attendu."
                ) : (
                  "In the era of AI and Cloud, tech invests the core of enterprise strategies, yet IT often struggles to deliver value at the expected pace."
                )}
              </p>
              <p className="text-base sm:text-lg md:text-xl font-bold text-slate-950 dark:text-white leading-relaxed">
                {lang === 'fr' ? (
                  <>Zenika est le <span className="text-[#E60039]">partenaire technologique de proximité</span> qui augmente l’impact métier <span className="whitespace-nowrap">de votre SI.</span></>
                ) : (
                  <>Zenika is the <span className="text-[#E60039]">proximity technology partner</span> that amplifies the business impact <span className="whitespace-nowrap">of your IT.</span></>
                )}
              </p>
            </div>
          </motion.div>

          {/* Dynamic Keyword switcher */}
          <div className="mt-6 sm:mt-8 w-full max-w-2xl pointer-events-auto">
            <div className="relative h-18 sm:h-20 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeKeyword.id}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col items-center justify-center px-5 py-3 rounded-2xl bg-white/90 dark:bg-black/60 backdrop-blur-xl border border-slate-200/90 dark:border-white/15 shadow-md"
                >
                  <div className="flex items-center gap-2 text-sm sm:text-lg font-bold font-display text-slate-950 dark:text-white">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeKeyword.accent }} />
                    <span>{lang === 'fr' ? activeKeyword.labelFr : activeKeyword.labelEn}</span>
                  </div>
                  <div className="text-xs sm:text-xs font-mono text-slate-600 dark:text-slate-300 mt-0.5">
                    {lang === 'fr' ? activeKeyword.subFr : activeKeyword.subEn}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Keyword Pills */}
            <div className="flex flex-wrap justify-center items-center gap-1.5 mt-3">
              {keywords.map((kw, index) => {
                const isActive = index === activeKeywordIndex;
                const Icon = kw.icon;
                return (
                  <button
                    key={kw.id}
                    onClick={() => setActiveKeywordIndex(index)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold shadow-xs scale-105'
                        : 'bg-white/70 dark:bg-white/[0.05] text-slate-700 dark:text-white/70 hover:bg-white dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    <Icon size={11} style={{ color: isActive ? '#E60039' : kw.accent }} />
                    <span>{lang === 'fr' ? kw.labelFr.split(' ')[0] : kw.labelEn.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTRO VERSION 2: STORYBOARD MORPHING AVEC GRANDES ICÔNES & TEXTES SYNCHRONES */}
      {/* ========================================================================= */}
      {introVersion === 'v2' && (
        <div className="relative z-20 w-full max-w-[1400px] my-auto py-2 sm:py-6 flex flex-col items-center justify-center text-center">
          
          {/* CENTRAL CANVAS STAGE OVERLAY WITH LARGE ICONS */}
          <div className="relative w-full max-w-[840px] h-[360px] sm:h-[440px] flex items-center justify-center pointer-events-none">
            
            {/* =================================================================== */}
            {/* STAGE 1: SPIROGRAPHE / HARMONIE & GRANDES ICÔNES D'ARTISANAT */}
            {/* =================================================================== */}
            {v2Stage === 1 && (
              <motion.div
                key="stage-1"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center pointer-events-auto"
              >
                {/* Top: Large Star (Excellence & Vision) - No square box or border */}
                <motion.div 
                  initial={{ y: -25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="absolute top-1 sm:top-3 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-default transition-transform hover:scale-110"
                >
                  <div className="p-1 filter drop-shadow-[0_0_20px_rgba(251,191,36,0.65)]">
                    <Star size={54} className="text-amber-400 fill-amber-400/30 animate-pulse stroke-[2.2]" />
                  </div>
                  <div className="mt-1.5 px-3.5 py-1 rounded-full bg-black/70 dark:bg-black/80 backdrop-blur-md text-amber-300 dark:text-amber-200 font-mono text-xs font-bold tracking-wider uppercase shadow-lg">
                    Excellence & Vision
                  </div>
                </motion.div>

                {/* Left: Large Loupe & Heart (Recherche & Passion) - No square box or border */}
                <motion.div 
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-default transition-transform hover:scale-110"
                >
                  <div className="flex items-center -space-x-2 p-1 filter drop-shadow-[0_0_20px_rgba(244,63,94,0.65)]">
                    <Heart size={48} className="text-rose-500 fill-rose-500/30 stroke-[2.2]" />
                    <Search size={40} className="text-indigo-400 stroke-[2.2]" />
                  </div>
                  <div className="mt-1.5 px-3.5 py-1 rounded-full bg-black/70 dark:bg-black/80 backdrop-blur-md text-rose-300 dark:text-rose-200 font-mono text-xs font-bold tracking-wider uppercase shadow-lg">
                    Recherche & Cœur
                  </div>
                </motion.div>

                {/* Right: Large Hammer, Wrench & Craft (Artisanat du Code) - No square box or border */}
                <motion.div 
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-default transition-transform hover:scale-110"
                >
                  <div className="flex items-center -space-x-2 p-1 filter drop-shadow-[0_0_20px_rgba(230,0,57,0.65)]">
                    <Wrench size={50} className="text-[#E60039] stroke-[2.2]" />
                    <Hammer size={38} className="text-amber-400 stroke-[2.2]" />
                  </div>
                  <div className="mt-1.5 px-3.5 py-1 rounded-full bg-black/70 dark:bg-black/80 backdrop-blur-md text-red-300 dark:text-red-200 font-mono text-xs font-bold tracking-wider uppercase shadow-lg">
                    Artisanat (Craft)
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* =================================================================== */}
            {/* STAGE 2: 3 SPHÈRES VENN (CONVERGENCE DES FORCES FONDAMENTALES) */}
            {/* =================================================================== */}
            {v2Stage === 2 && (
              <motion.div
                key="stage-2"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center pointer-events-auto"
              >
                {/* Top Sphere: Direction Technique & R&D (Indigo) - Pure floating icon, no box */}
                <motion.div 
                  initial={{ y: -25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="absolute top-1 sm:top-4 left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-default transition-transform hover:scale-110"
                >
                  <div className="p-1 filter drop-shadow-[0_0_22px_rgba(129,140,248,0.85)]">
                    <Search size={54} className="text-indigo-300 dark:text-indigo-200 stroke-[2.3]" />
                  </div>
                  <div className="mt-1.5 px-3.5 py-1 rounded-full bg-indigo-950/80 dark:bg-black/80 backdrop-blur-md text-indigo-200 font-mono text-xs font-bold tracking-wider uppercase shadow-lg">
                    Direction & Vision
                  </div>
                </motion.div>

                {/* Right Sphere: Valeur Métier & Impact (Rouge Carmin) - Pure floating icon, no box */}
                <motion.div 
                  initial={{ x: 30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="absolute right-1 sm:right-6 bottom-4 sm:bottom-8 flex flex-col items-center group cursor-default transition-transform hover:scale-110"
                >
                  <div className="p-1 filter drop-shadow-[0_0_22px_rgba(230,0,57,0.85)]">
                    <Star size={54} className="text-rose-400 dark:text-rose-300 fill-rose-500/30 stroke-[2.3]" />
                  </div>
                  <div className="mt-1.5 px-3.5 py-1 rounded-full bg-rose-950/80 dark:bg-black/80 backdrop-blur-md text-rose-200 font-mono text-xs font-bold tracking-wider uppercase shadow-lg">
                    Impact & Métier
                  </div>
                </motion.div>

                {/* Left Sphere: Craftsmanship & Construction (Ambre) - Pure floating icon, no box */}
                <motion.div 
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="absolute left-1 sm:left-6 bottom-4 sm:bottom-8 flex flex-col items-center group cursor-default transition-transform hover:scale-110"
                >
                  <div className="p-1 filter drop-shadow-[0_0_22px_rgba(245,158,11,0.85)]">
                    <Wrench size={54} className="text-amber-400 dark:text-amber-300 stroke-[2.3]" />
                  </div>
                  <div className="mt-1.5 px-3.5 py-1 rounded-full bg-amber-950/80 dark:bg-black/80 backdrop-blur-md text-amber-200 font-mono text-xs font-bold tracking-wider uppercase shadow-lg">
                    Craft & Architecture
                  </div>
                </motion.div>

                {/* Center Intersection: Luminous Heart Badge */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.4, type: 'spring' }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-auto transition-transform hover:scale-110"
                >
                  <div className="p-1 filter drop-shadow-[0_0_24px_rgba(230,0,57,0.9)]">
                    <Heart size={42} className="text-[#E60039] fill-[#E60039] animate-pulse" />
                  </div>
                  <span className="mt-1 px-3 py-0.5 rounded-full bg-black/85 backdrop-blur-md text-white font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-md">
                    Convergence
                  </span>
                </motion.div>
              </motion.div>
            )}

            {/* =================================================================== */}
            {/* STAGE 3: EXTRUSION 3D DU MONOGRAMME Z (LIGNES RÉPÉTÉES) & SATELLITES */}
            {/* =================================================================== */}
            {v2Stage === 3 && (
              <motion.div
                key="stage-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center pointer-events-auto"
              >
                {/* Centerpiece: The Real 3D Extruded Monogram with Repeating Lines */}
                <div className="relative z-10 flex items-center justify-center">
                  <ZenikaExtrudedMonogram size={270} glow interactive className="sm:w-[320px] sm:h-[320px]" />
                </div>

                {/* Top Satellite: Direction Technique d'Élite */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-xl shadow-xl transition-transform hover:scale-105"
                >
                  <div className="filter drop-shadow-[0_0_12px_rgba(129,140,248,0.7)] text-indigo-400">
                    <ShieldCheck size={22} />
                  </div>
                  <div className="text-left font-mono">
                    <div className="text-[11px] font-bold text-white uppercase tracking-wider">
                      Direction Technique
                    </div>
                  </div>
                </motion.div>

                {/* Left Satellite: Artisanat du Code */}
                <motion.div
                  initial={{ x: -25, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute left-1 sm:left-4 bottom-4 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-black/80 backdrop-blur-xl shadow-xl transition-transform hover:scale-105"
                >
                  <div className="filter drop-shadow-[0_0_12px_rgba(245,158,11,0.7)] text-amber-400">
                    <Code2 size={26} />
                  </div>
                  <div className="text-left font-mono">
                    <div className="text-[11px] font-bold text-white uppercase">
                      Artisanat (Craft)
                    </div>
                    <div className="text-[9px] text-white/60">
                      TDD & Clean Code
                    </div>
                  </div>
                </motion.div>

                {/* Right Satellite: IA Souveraine & Systèmes */}
                <motion.div
                  initial={{ x: 25, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="absolute right-1 sm:right-4 bottom-4 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-black/80 backdrop-blur-xl shadow-xl transition-transform hover:scale-105"
                >
                  <div className="filter drop-shadow-[0_0_12px_rgba(6,182,212,0.7)] text-cyan-400">
                    <Cpu size={26} />
                  </div>
                  <div className="text-left font-mono">
                    <div className="text-[11px] font-bold text-white uppercase">
                      IA Souveraine
                    </div>
                    <div className="text-[9px] text-white/60">
                      Cloud & Plateformes
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* =================================================================== */}
          {/* DYNAMIC TEXT & CONTEXTUAL HEADLINE FOR EACH SECTION */}
          {/* =================================================================== */}
          <div className="w-full max-w-3xl mx-auto px-4 mt-2 sm:mt-4 min-h-[95px] sm:min-h-[110px] flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {v2Stage === 1 && (
                <motion.div
                  key="text-stage-1"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-1.5"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    PHASE 01 / 03 · NOUVELLE ÈRE TECH
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-slate-950 dark:text-white uppercase">
                    À l'ère de l'IA et du Cloud
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    La tech investit le cœur des stratégies d’entreprises, mais l’IT peine souvent à produire de la valeur au rythme attendu.
                  </p>
                </motion.div>
              )}

              {v2Stage === 2 && (
                <motion.div
                  key="text-stage-2"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-1.5"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    PHASE 02 / 03 · PROXIMITÉ & EXPERTISE
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-slate-950 dark:text-white uppercase">
                    Partenaire Technologique de Proximité
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Là où la Direction Technique d'élite croise la Valeur Métier et le Craftsmanship, au service direct de vos équipes.
                  </p>
                </motion.div>
              )}

              {v2Stage === 3 && (
                <motion.div
                  key="text-stage-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-1.5"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-[#E60039]/10 text-[#E60039] border border-[#E60039]/30">
                    PHASE 03 / 03 · VALEUR MÉTIER DÉPLOYÉE
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-slate-950 dark:text-white uppercase">
                    Augmenter l’Impact Métier de Votre SI
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Zenika concentre l'excellence artisanale pour transformer la complexité technologique en levier de croissance métier concret.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* =================================================================== */}
          {/* TIMELINE CONTROLS & LIVE MORPHING PROGRESS BAR */}
          {/* =================================================================== */}
          <div className="mt-4 sm:mt-5 flex flex-col items-center gap-2.5 pointer-events-auto">
            
            {/* Stage Selector Pills */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/90 dark:bg-black/60 backdrop-blur-xl border border-slate-200 dark:border-white/15 shadow-lg">
              {[
                { step: 1 as const, label: '1. Harmonie & Outils', icon: Compass },
                { step: 2 as const, label: '2. Convergence 3 Cercles', icon: Layers },
                { step: 3 as const, label: '3. Monogramme Z 3D', icon: Sparkles },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => {
                    setV2Stage(s.step);
                    setStageProgress(0);
                  }}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-2 ${
                    v2Stage === s.step
                      ? 'bg-[#E60039] text-white shadow-md font-bold scale-102'
                      : 'text-slate-600 dark:text-white/70 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                >
                  <s.icon size={14} />
                  <span>{s.label}</span>
                </button>
              ))}

              {/* Autoplay Play/Pause */}
              <button
                onClick={() => setIsV2Autoplay(!isV2Autoplay)}
                className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono ${
                  isV2Autoplay
                    ? 'text-[#E60039] bg-[#E60039]/10 hover:bg-[#E60039]/20'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5'
                }`}
                title={isV2Autoplay ? 'Mettre en pause' : 'Lecture continue'}
              >
                {isV2Autoplay ? <Pause size={14} /> : <Play size={14} />}
                <span className="hidden md:inline">{isV2Autoplay ? 'Auto' : 'Pause'}</span>
              </button>
            </div>

            {/* Continuous Morphing Timeline Bar */}
            {isV2Autoplay && (
              <div className="w-64 h-1.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#E60039] transition-all duration-75 rounded-full"
                  style={{ width: `${stageProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* BOTTOM BAR: SCROLL INVITATION WITH ANIMATED CUE */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="relative z-20 w-full flex flex-col items-center pb-1 pointer-events-auto"
      >
        <button
          onClick={handleScrollToContent}
          className="group flex flex-col items-center gap-1.5 cursor-pointer focus:outline-none"
          aria-label="Découvrir le site"
        >
          <span className="font-mono text-xs uppercase tracking-[0.26em] text-slate-500 dark:text-white/60 group-hover:text-[#E60039] transition-colors flex items-center gap-1.5">
            <span>{lang === 'fr' ? 'DÉCOUVRIR LE SITE & LA NAVIGATION' : 'EXPLORE SITE & NAVIGATION'}</span>
            <ChevronDown size={13} className="group-hover:translate-y-0.5 transition-transform text-[#E60039]" />
          </span>

          {/* Animated Scroll Mouse / Pill Cue */}
          <div className="w-5 h-8 rounded-full border-2 border-slate-300 dark:border-white/20 group-hover:border-[#E60039] flex justify-center p-1 transition-colors backdrop-blur-xs">
            <motion.div
              animate={{
                y: [0, 10, 0],
                opacity: [1, 0.3, 1]
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="w-1.5 h-1.5 rounded-full bg-[#E60039]"
            />
          </div>
        </button>
      </motion.div>
    </section>
  );
};
