import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import {
  Layers,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Zap,
  Shield,
  Cpu,
  Users,
  Database,
  RefreshCw,
  Server,
  FileCheck,
  Check,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Target,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Language, SolutionBlock } from '../../types';
import { SOLUTION_BLOCKS } from '../../data/zenikaData';

interface StrategicAxesSectionProps {
  lang: Language;
  onOpenContact: (customAssembly?: SolutionBlock[]) => void;
  selectedAssembly?: SolutionBlock[];
  onToggleAssembly?: (block: SolutionBlock) => void;
}

type StrategicAxisId = 'optimiser' | 'innover' | 'transformer';

// -----------------------------------------------------------------------------
// Strategic Axes & Color Gradient System
// Left column (Frictions): Solid left color
// Center column (Pillars): Directional gradient
// Right column (ROI / Value): Solid right color
// -----------------------------------------------------------------------------
const AXIS_COLOR_SYSTEM: Record<
  StrategicAxisId,
  {
    leftSolidColor: string;
    rightSolidColor: string;
    centerGradient: string;
    label: string;
  }
> = {
  optimiser: {
    leftSolidColor: '#CF0537',
    rightSolidColor: '#BF1D67',
    centerGradient: 'linear-gradient(86.23deg, #EE2238 6.17%, rgba(191, 29, 103, 0.867) 93.8%)',
    label: 'OPTIMISER',
  },
  innover: {
    leftSolidColor: '#F39719',
    rightSolidColor: '#E84B58',
    centerGradient: 'linear-gradient(87.05deg, #F39719 6.63%, #E84B58 95.08%)',
    label: 'INNOVER',
  },
  transformer: {
    leftSolidColor: '#5374B4',
    rightSolidColor: '#8B5CF6',
    centerGradient: 'linear-gradient(87.41deg, #5374B4 4.31%, rgba(139, 92, 246, 0.667) 95.67%)',
    label: 'TRANSFORMER',
  },
};

interface AxisOffer {
  id: string;
  titleFr: string;
  titleEn: string;
  typeFr: 'Conseil & Audit' | 'Réalisation' | 'Formation' | 'Architecture';
  typeEn: 'Advisory & Audit' | 'Engineering' | 'Training' | 'Architecture';
  subtitleFr: string;
  subtitleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  pointsFr: string[];
  pointsEn: string[];
  metric: string;
  metricLabelFr: string;
  metricLabelEn: string;
  linkedSolutionBlockId?: string;
  tags: string[];
}

export const StrategicAxesSection: React.FC<StrategicAxesSectionProps> = ({
  lang,
  onOpenContact,
  selectedAssembly = [],
  onToggleAssembly
}) => {
  const [activeAxis, setActiveAxis] = useState<StrategicAxisId>('optimiser');
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [sentenceProgress, setSentenceProgress] = useState<number>(0);
  const [isRunwayActive, setIsRunwayActive] = useState<boolean>(false);
  const [hoveredFriction, setHoveredFriction] = useState<string | null>(null);
  const [hoveredOutcome, setHoveredOutcome] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // PROTOTYPE — desktop layout under team review (mobile always shows the catalogue).
  // 'runway'  = pinned scroll animation (pillars / frictions / ROI)
  // 'catalog' = expandable pillar cards + 12 offers
  // Shareable via ?piliers=catalogue. TODO: once the team has chosen, delete the
  // switcher and the losing variant.
  const [desktopVariant, setDesktopVariant] = useState<'runway' | 'catalog'>(() => {
    if (typeof window === 'undefined') return 'runway';
    return new URLSearchParams(window.location.search).get('piliers') === 'catalogue' ? 'catalog' : 'runway';
  });

  // Set when "Découvrir les offres" switches to version B: scroll once the catalogue is laid out
  const scrollToOffersPendingRef = useRef(false);
  useEffect(() => {
    if (desktopVariant !== 'catalog' || !scrollToOffersPendingRef.current) return;
    scrollToOffersPendingRef.current = false;
    document.getElementById('offers-showcase')?.scrollIntoView({ behavior: 'smooth' });
  }, [desktopVariant]);

  const switchDesktopVariant = (variant: 'runway' | 'catalog') => {
    setDesktopVariant(variant);
    const url = new URL(window.location.href);
    if (variant === 'catalog') url.searchParams.set('piliers', 'catalogue');
    else url.searchParams.delete('piliers');
    window.history.replaceState(null, '', url);
  };
  const [modalOffer, setModalOffer] = useState<{ offer: AxisOffer; axis: StrategicAxisId } | null>(null);
  const [expandedAxes, setExpandedAxes] = useState<Record<StrategicAxisId, boolean>>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return {
        optimiser: false,
        innover: false,
        transformer: false,
      };
    }
    return {
      optimiser: true,
      innover: false,
      transformer: false,
    };
  });

  const toggleAxis = (axisId: StrategicAxisId) => {
    setExpandedAxes(prev => {
      const willBeOpen = !prev[axisId];
      if (isMobile && willBeOpen) {
        return {
          optimiser: axisId === 'optimiser',
          innover: axisId === 'innover',
          transformer: axisId === 'transformer',
        };
      }
      return {
        ...prev,
        [axisId]: willBeOpen,
      };
    });
    setActiveAxis(axisId);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalOffer(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const runwayRef = useRef<HTMLDivElement>(null);
  const sentenceBannerRef = useRef<HTMLDivElement>(null);
  const manualLockUntilRef = useRef<number>(0);

  // Parallaxe douce au début de la section "La valeur ajoutée Zenika" :
  // Le centre (Optimiser, Innover, Transformer) arrive en premier, immédiatement lisible et mis en valeur.
  // Les deux colonnes latérales (Complexités à gauche et Gains/ROI à droite) glissent ensuite en douceur pour compléter le tableau.
  const { scrollYProgress: runwayScrollY } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  const smoothRunway = useSpring(runwayScrollY, {
    stiffness: 70,
    damping: 26,
    mass: 0.8,
    restDelta: 0.0005,
  });

  // Parallaxe douce et orchestrée selon la demande :
  // 1. En premier : la colonne centrale arrive avec un léger parallax
  const centerColOpacity = useTransform(smoothRunway, [0, 0.06], [0, 1]);
  const centerColY = useTransform(smoothRunway, [0, 0.06], [22, 0]);
  const centerColScale = useTransform(smoothRunway, [0, 0.06], [0.97, 1]);

  // 2. Puis les deux titres cards ("Complexité constatée" et "Valeur Métier & ROI")
  const sideHeadersOpacity = useTransform(smoothRunway, [0.04, 0.10], [0, 1]);
  const sideHeadersY = useTransform(smoothRunway, [0.04, 0.10], [14, 0]);

  // 3. Suivis des listes latérales avec un parallax léger
  const leftColX = useTransform(smoothRunway, [0.06, 0.14], [-24, 0]);
  const leftColOpacity = useTransform(smoothRunway, [0.06, 0.14], [0, 1]);
  const leftColY = useTransform(smoothRunway, [0.06, 0.14], [16, 0]);
  const leftColScale = useTransform(smoothRunway, [0.06, 0.14], [0.98, 1]);

  const rightColX = useTransform(smoothRunway, [0.06, 0.14], [24, 0]);
  const rightColOpacity = useTransform(smoothRunway, [0.06, 0.14], [0, 1]);
  const rightColY = useTransform(smoothRunway, [0.06, 0.14], [16, 0]);
  const rightColScale = useTransform(smoothRunway, [0.06, 0.14], [0.98, 1]);

  const titleParallaxY = useTransform(smoothRunway, [0, 0.08], [-12, 0]);
  const titleParallaxOpacity = useTransform(smoothRunway, [0, 0.05], [0.8, 1]);

  const jumpToStep = useCallback((step: 1 | 2 | 3, smoothScroll: boolean = true) => {
    manualLockUntilRef.current = Date.now() + 1500;
    setActiveStep(step);
    const axisId: StrategicAxisId = step === 1 ? 'optimiser' : step === 2 ? 'innover' : 'transformer';
    setActiveAxis(axisId);

    if (smoothScroll && runwayRef.current && window.innerWidth >= 1024) {
      const rect = runwayRef.current.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const runwayTop = currentScrollY + rect.top;
      const runwayHeight = rect.height;
      const viewportHeight = window.innerHeight;
      const scrollableDistance = runwayHeight - viewportHeight;

      if (scrollableDistance > 0) {
        // Step centers: 1 -> ~15%, 2 -> ~50%, 3 -> ~85%
        const targetPct = step === 1 ? 0.15 : step === 2 ? 0.50 : 0.85;
        const targetY = runwayTop + targetPct * scrollableDistance;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  }, []);

  useEffect(() => {
    // Collapse the cards only when crossing into the mobile breakpoint: mobile
    // browsers fire `resize` when the address bar shows/hides during scroll.
    let wasMobile: boolean | null = null;
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      const enteredMobile = mobile && wasMobile === false;
      wasMobile = mobile;
      setIsMobile(mobile);
      if (enteredMobile) {
        setExpandedAxes(prev => {
          // If all are already closed, keep as is
          if (!prev.optimiser && !prev.innover && !prev.transformer) return prev;
          return {
            optimiser: false,
            innover: false,
            transformer: false,
          };
        });
      }
    };
    checkMobile();

    let ticking = false;

    const updateScrollMetrics = () => {
      // 1. Calculate scroll-driven word-by-word illumination for the Grand Value Statement
      // Locks right in the center of the screen, and STAYS locked and centered
      // until BOTH phrases are completely revealed and read!
      if (sentenceBannerRef.current) {
        const sRect = sentenceBannerRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const scrollableDist = sRect.height - vh;

        if (scrollableDist > 0) {
          const scrolled = -sRect.top;
          if (scrolled <= 0) {
            // Sticky section is still entering or at rest: start instantly at 0
            setSentenceProgress(0);
          } else {
            // Immediate, responsive progression without any deadzone or delay
            const animProgress = Math.min(1, scrolled / (scrollableDist * 0.70));
            setSentenceProgress(Math.max(0, animProgress));
          }
        }
      }

      // On mobile screens (< 1024px), skip desktop sticky runway scroll hijacking
      // Touch tabs and direct actions provide an ergonomic, native mobile experience
      if (window.innerWidth < 1024) return;

      if (!runwayRef.current) return;
      const rect = runwayRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Si l'utilisateur a cliqué manuellement récemment, respecter son choix
      if (Date.now() < manualLockUntilRef.current) {
        return;
      }

      // Synchronisation au scroll sur les 280vh de runway avec position fixe centrée
      const totalScrollable = rect.height - vh;
      if (totalScrollable > 0) {
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
        setScrollProgress(progress);

        if (rect.top <= vh * 0.35 && rect.bottom >= vh * 0.15) {
          setIsRunwayActive(true);

          if (progress < 0.34) {
            setActiveStep(1);
            setActiveAxis('optimiser');
          } else if (progress < 0.68) {
            setActiveStep(2);
            setActiveAxis('innover');
          } else {
            setActiveStep(3);
            setActiveAxis('transformer');
          }
        }
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollMetrics();
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      checkMobile();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    updateScrollMetrics();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 1. Complexités constatées (Left column - from slide)
  const complexityItems = [
    {
      id: 'c-data',
      labelFr: 'Données fragmentées',
      labelEn: 'Fragmented Data',
      detailFr: 'Données en silos, référentiels dispersés et inexploitables pour l’IA agentique.',
      detailEn: 'Siloed data repositories unprepared for real-time and agentic processing.',
      resolvedBy: 'innover' as StrategicAxisId,
      yieldsOutcome: 'o-pertinence'
    },
    {
      id: 'c-legacy',
      labelFr: 'Systèmes legacy',
      labelEn: 'Legacy Systems',
      detailFr: 'Monolithes vieillissants générant dette technique et lenteurs d’évolution.',
      detailEn: 'Monolithic legacy architectures accumulating technical debt and slowness.',
      resolvedBy: 'optimiser' as StrategicAxisId,
      yieldsOutcome: 'o-securite'
    },
    {
      id: 'c-millefeuille',
      labelFr: 'Architecture mille-feuilles',
      labelEn: 'Sprawling Layered Architecture',
      detailFr: 'Empilement hétérogène de briques sans gouvernance globale unifiée.',
      detailEn: 'Heterogeneous tool sprawl and overlapping architectural components.',
      resolvedBy: 'optimiser' as StrategicAxisId,
      yieldsOutcome: 'o-ttm'
    },
    {
      id: 'c-silos',
      labelFr: 'Silos organisationnels',
      labelEn: 'Organizational Silos',
      detailFr: 'Ruptures entre équipes métier, produit, dev et exploitation IT.',
      detailEn: 'Frictions between business units, product, dev and ops teams.',
      resolvedBy: 'transformer' as StrategicAxisId,
      yieldsOutcome: 'o-alignement'
    },
    {
      id: 'c-transfo',
      labelFr: 'Transformation permanente',
      labelEn: 'Continuous Transformation',
      detailFr: 'Multiplication des ruptures technologiques provoquant fatigue et perte de cap.',
      detailEn: 'Fast-paced tech shifts creating team fatigue and loss of strategic clarity.',
      resolvedBy: 'transformer' as StrategicAxisId,
      yieldsOutcome: 'o-innovation'
    },
    {
      id: 'c-complexite',
      labelFr: 'Complexité croissante',
      labelEn: 'Growing Complexity',
      detailFr: 'Prolifération du Cloud, des microservices et des nouveaux modèles d’IA.',
      detailEn: 'Unchecked sprawl across Cloud, microservices, and AI models.',
      resolvedBy: 'innover' as StrategicAxisId,
      yieldsOutcome: 'o-ia'
    },
    {
      id: 'c-couts',
      labelFr: 'Pression sur les coûts',
      labelEn: 'Cost Pressures & FinOps',
      detailFr: 'Flambée des factures Cloud et coûts d’inférence LLM non maîtrisés.',
      detailEn: 'Runaway cloud bills and unmonitored AI token inference costs.',
      resolvedBy: 'optimiser' as StrategicAxisId,
      yieldsOutcome: 'o-alignement'
    }
  ];

  // 2. Les 3 Axes Stratégiques (Center column - from slide)
  const axesConfig: Record<
    StrategicAxisId,
    {
      title: string;
      titleEn: string;
      taglineFr: string;
      taglineEn: string;
      color: string;
      accentBg: string;
      borderActive: string;
      textActive: string;
      number: string;
      headlineFr: string;
      headlineEn: string;
      statsBadgeFr: string;
      statsBadgeEn: string;
      offers: AxisOffer[];
    }
  > = {
    optimiser: {
      title: 'OPTIMISER',
      titleEn: 'OPTIMIZE',
      taglineFr: 'les actifs logiciels, les process, la valeur du SI',
      taglineEn: 'software assets, processes, and IT value',
      color: '#EE2238',
      accentBg: 'bg-[#CF0537]',
      borderActive: 'border-[#CF0537]',
      textActive: 'text-[#CF0537]',
      number: '01',
      headlineFr: 'Sécuriser le socle, résorber la dette technique et démultiplier la vélocité de delivery.',
      headlineEn: 'Hardening the core, curbing tech debt, and accelerating delivery throughput.',
      statsBadgeFr: '-40% Dette · x2.5 Vélocité · FinOps maîtrisé',
      statsBadgeEn: '-40% Debt · 2.5x Velocity · Controlled FinOps',
      offers: [
        {
          id: 'off-legacy-modernization',
          titleFr: 'Modernisation & Découplage du Legacy',
          titleEn: 'Legacy Modernization & Decoupling',
          typeFr: 'Réalisation',
          typeEn: 'Engineering',
          subtitleFr: 'Passez du monolithe rigide à une architecture modulaire fluide',
          subtitleEn: 'Transition from rigid monoliths to a resilient modular architecture',
          descriptionFr: 'Sécurisation des flux critiques existants, refactoring incrémental guidé par le Domaine (DDD), pattern étrangleur (Strangler Fig) et suppression des goulets d’étranglement sans interruption de service.',
          descriptionEn: 'Hardening existing critical flows, incremental Domain-Driven Design (DDD) refactoring, strangler fig patterns, and removing bottlenecks without service disruption.',
          pointsFr: [
            'Cartographie exhaustive des dépendances et flux métiers critiques',
            'Refactoring chirurgical assisté par l’IA et documentation vivante',
            'Découplage en APIs / micro-services et tests d’architecture automatisés'
          ],
          pointsEn: [
            'Exhaustive dependency mapping and mission-critical business flow auditing',
            'AI-assisted surgical refactoring and living documentation',
            'API decoupling, microservices migration, and automated architecture tests'
          ],
          metric: '-40%',
          metricLabelFr: 'Dette technique critique résorbée',
          metricLabelEn: 'Critical technical debt reduced',
          linkedSolutionBlockId: 'sol-legacy-value',
          tags: ['Legacy', 'Strangler Pattern', 'DDD', 'Résilience']
        },
        {
          id: 'off-ai-sdlc',
          titleFr: 'AI for IT : SDLC & Ops Augmentés',
          titleEn: 'AI for IT: Augmented SDLC & Ops',
          typeFr: 'Réalisation',
          typeEn: 'Engineering',
          subtitleFr: 'Intégration d’agents IA dans vos chaînes de conception et d’exploitation',
          subtitleEn: 'Embedding AI developer agents across coding and runtime operations',
          descriptionFr: 'Outillage de l’ensemble du cycle logiciel : génération et maintenance de tests unitaires, revue de code automatisée, détection de régressions et diagnostic prédictif des incidents de production.',
          descriptionEn: 'Turbocharge engineering cycles: automated test suite generation, PR reviews with AI agents, regression detection, and predictive incident telemetry.',
          pointsFr: [
            'Assistants et agents de code intégrés dans les IDEs et pipelines CI/CD',
            'Automatisation de la couverture de tests et assainissement du code',
            'Augmented Ops : Diagnostic automatisé et réduction du MTTR'
          ],
          pointsEn: [
            'Coding agents embedded directly in team IDEs and CI/CD pipelines',
            'Automated test coverage generation and code quality guardrails',
            'Augmented Ops: Fast telemetry root-cause analysis and lower MTTR'
          ],
          metric: 'x2.5',
          metricLabelFr: 'Vélocité de delivery d’ingénierie',
          metricLabelEn: 'Engineering delivery velocity',
          linkedSolutionBlockId: 'sol-ai-sdlc',
          tags: ['AI SDLC', 'Copilotes', 'CI/CD', 'Qualité Logicielle']
        },
        {
          id: 'off-finops-token',
          titleFr: 'FinOps Cloud & Gouvernance Token IA',
          titleEn: 'Cloud FinOps & GenAI Token Management',
          typeFr: 'Conseil & Audit',
          typeEn: 'Advisory & Audit',
          subtitleFr: 'Maîtrise fine des dépenses Cloud et optimisation du coût d’inférence LLM',
          subtitleEn: 'Fine-tuned cloud spend control and LLM inference cost optimization',
          descriptionFr: 'Audit et rationalisation de vos consommations Cloud, suppression du surdimensionnement (rightsizing), mise en place de politiques de caching sémantique et de sélection frugale des modèles IA.',
          descriptionEn: 'Rigorous audit of cloud infrastructure, compute rightsizing, semantic caching strategies, and cost-efficient LLM routing policies.',
          pointsFr: [
            'Audit complet des consommations AWS / GCP / Azure et licences',
            'Optimisation du coût d’inférence : prompts frugaux, SLMs et caching',
            'Tableaux de bord de pilotage unifié DSI & Finance en temps réel'
          ],
          pointsEn: [
            'Full cloud cost audit across AWS, GCP, Azure, and third-party SaaS',
            'Inference optimization: prompt compaction, SLM routing, semantic caching',
            'Unified C-Level & FinOps real-time monitoring dashboards'
          ],
          metric: '-30%',
          metricLabelFr: 'Facture Cloud & inférence optimisée',
          metricLabelEn: 'Optimized cloud & token spend',
          linkedSolutionBlockId: 'sol-cloud-forge',
          tags: ['FinOps', 'Token Management', 'Frugalité', 'Cloud Sovereignty']
        },
        {
          id: 'off-audit-perf',
          titleFr: 'Audit Architectural & Résilience Haute Dispo',
          titleEn: 'Architecture Review & High-Availability Resilience',
          typeFr: 'Architecture',
          typeEn: 'Architecture',
          subtitleFr: 'Fiabiliser les systèmes sous forte charge et éliminer les SPOF',
          subtitleEn: 'Eliminate single points of failure and sustain massive traffic peaks',
          descriptionFr: 'Diagnostic approfondi de votre architecture pour identifier les goulets d’étranglement, renforcer la sécurité applicative (DevSecOps) et garantir un SLA 99.99% sur vos services cœur de métier.',
          descriptionEn: 'Deep architectural health check to spot bottlenecks, inject DevSecOps guardrails, and secure 99.99% SLA across enterprise mission-critical core engines.',
          pointsFr: [
            'Analyse d’impact et de vulnérabilités sur les flux névralgiques',
            'Architecture événementielle résiliente (Kafka, RabbitMQ, EventMesh)',
            'Chaos Engineering et validation rigoureuse de la reprise d’activité'
          ],
          pointsEn: [
            'Impact and vulnerability diagnostics on core transaction paths',
            'Resilient event-driven architectures (Kafka, RabbitMQ, EventMesh)',
            'Chaos engineering drills and proven disaster recovery playbooks'
          ],
          metric: '99.99%',
          metricLabelFr: 'Disponibilité & zéro régression',
          metricLabelEn: 'Uptime and zero production regression',
          linkedSolutionBlockId: 'sol-legacy-value',
          tags: ['Architecture', 'Résilience', 'DevSecOps', 'Event-Driven']
        }
      ]
    },
    innover: {
      title: 'INNOVER',
      titleEn: 'INNOVATE',
      taglineFr: 'dans les solutions, les technologies, les méthodes',
      taglineEn: 'in solutions, emerging technologies, and methods',
      color: '#F39719',
      accentBg: 'bg-[#F39719]',
      borderActive: 'border-[#F39719]',
      textActive: 'text-[#F39719]',
      number: '02',
      headlineFr: 'Transformer l’IA et les technologies émergentes en nouveaux produits logiciels générateurs de revenus.',
      headlineEn: 'Harnessing AI and frontier technologies into software engines that drive revenue.',
      statsBadgeFr: 'x3 Time-to-Market · IA Agentique · POCs < 6 sem.',
      statsBadgeEn: '3x Time-to-Market · Agentic AI · POCs < 6 wks',
      offers: [
        {
          id: 'off-ai-biz-native',
          titleFr: 'Applications AI-Native & Expériences Métier',
          titleEn: 'AI-Native Applications & Business Experiences',
          typeFr: 'Réalisation',
          typeEn: 'Engineering',
          subtitleFr: 'Développement sur-mesure d’applications dopées à l’IA générative et agentique',
          subtitleEn: 'Bespoke development of generative and agentic AI-powered applications',
          descriptionFr: 'Conception de produits logiciels intégrant des systèmes multi-agents, de la recherche sémantique multimodale, du RAG d’entreprise sécurisé et des interfaces conversationnelles intuitives pour vos métiers.',
          descriptionEn: 'Designing full-stack software products with multi-agent orchestration, multimodal semantic search, enterprise-grade secure RAG, and fluid conversational interfaces.',
          pointsFr: [
            'Framework AI Multiplier : SHAPE (idéation), SHIP (craft), SYNC (industrialisation)',
            'RAG d’entreprise souverain connecté à vos données internes sensibles',
            'Agents autonomes réalisant des tâches complexes de validation métier'
          ],
          pointsEn: [
            'AI Multiplier Framework: SHAPE (discovery), SHIP (craft), SYNC (industrialization)',
            'Sovereign enterprise RAG securely linked to internal proprietary data',
            'Autonomous agents executing multi-step business approval workflows'
          ],
          metric: 'x3',
          metricLabelFr: 'Time-to-market produit raccourci',
          metricLabelEn: 'Faster product time-to-market',
          linkedSolutionBlockId: 'sol-ai-biz',
          tags: ['AI-Native', 'Multi-Agents', 'RAG Souverain', 'SHAPE x SHIP']
        },
        {
          id: 'off-agentic-platform',
          titleFr: 'Platform Engineering & Socles Agentiques',
          titleEn: 'Agentic Platform Engineering & DevEx',
          typeFr: 'Architecture',
          typeEn: 'Architecture',
          subtitleFr: 'Internal Developer Platforms prêtes pour l’orchestration multi-agents',
          subtitleEn: 'Internal Developer Platforms designed for multi-agent orchestration',
          descriptionFr: 'Bâtir des plateformes internes (IDP) en libre-service avec des guardrails de sécurité stricts, permettant aux équipes de prototyper et déployer des agents en production en quelques heures.',
          descriptionEn: 'Engineering self-service Internal Developer Platforms (IDP) with embedded security policies, empowering delivery squads to deploy AI agents in hours.',
          pointsFr: [
            'Portails développeurs (Backstage, Port) et catalogues de briques standardisées',
            'Infrastructure as Code (IaC) et déploiement continu d’environnements de test',
            'Monitoring des agents : traçabilité des prompts, latence et garde-fous éthiques'
          ],
          pointsEn: [
            'Internal developer portals and standardized service catalogs',
            'Infrastructure as Code (IaC) with instant test environment provisioning',
            'Agent observability: prompt tracing, latency budgets, and guardrail enforcement'
          ],
          metric: '< 6 sem.',
          metricLabelFr: 'Du prototype à l’échelle industrielle',
          metricLabelEn: 'From initial prototype to production scale',
          linkedSolutionBlockId: 'sol-platform-eng',
          tags: ['Platform Engineering', 'IDP', 'IaC', 'Agent Ops']
        },
        {
          id: 'off-data-readiness',
          titleFr: 'Data for Agentic AI Readiness',
          titleEn: 'Data for Agentic AI Readiness',
          typeFr: 'Architecture',
          typeEn: 'Architecture',
          subtitleFr: 'Données en temps réel, qualifiées et de confiance pour vos agents',
          subtitleEn: 'High-quality, real-time and trusted data pipelines for AI agents',
          descriptionFr: 'Modernisation des flux de données : streaming temps réel avec Kafka, vectorisation haute fidélité, lignage de données et modélisation Master Data pour alimenter fidèlement vos modèles.',
          descriptionEn: 'Modernizing data pipelines: real-time streaming via Kafka, vector indexing, robust data lineage, and Master Data governance to reliably feed AI models.',
          pointsFr: [
            'Master Data : Gouvernance et modélisation unifiée des référentiels métier',
            'Fresh Data : Pipelines temps réel pour décisions instantanées',
            'Trusted Data : Sécurité, conformité RGPD et auditabilité des sources'
          ],
          pointsEn: [
            'Master Data: Unified business domain modeling and clean registries',
            'Fresh Data: Real-time event streaming for zero-latency decisions',
            'Trusted Data: Security, GDPR compliance, and verifiable data lineage'
          ],
          metric: '100%',
          metricLabelFr: 'Données fiabilisées & traçables',
          metricLabelEn: 'Trusted & verifiable data assets',
          linkedSolutionBlockId: 'sol-data-agentic',
          tags: ['Data Readiness', 'Streaming Kafka', 'Vector DB', 'Trusted Data']
        },
        {
          id: 'off-poc-frontiers',
          titleFr: 'Strike Teams & Prototypage Industriel',
          titleEn: 'Strike Teams & Industrial Prototyping',
          typeFr: 'Réalisation',
          typeEn: 'Engineering',
          subtitleFr: 'Squads seniors dédiées pour valider vos cas d’usage à fort enjeu',
          subtitleEn: 'Senior squads dedicated to proving high-stakes technological hypotheses',
          descriptionFr: 'Dérisquez vos investissements grâce à des squads resserrées d’artisans logiciels et d’experts IA. Nous concevons des MVPs testés en conditions réelles auprès de vos utilisateurs métiers.',
          descriptionEn: 'De-risk bold investments through elite squads of software craftsmen and AI specialists, delivering production-grade MVPs tested directly with real users.',
          pointsFr: [
            'Validation rapide de la faisabilité technique et de la valeur économique',
            'Architecture propre dès le premier jour (pas de jetable, prêt pour la prod)',
            'Engagement au résultat sur les jalons critiques (skin in the game)'
          ],
          pointsEn: [
            'Fast verification of technical feasibility and measurable business ROI',
            'Clean architecture from day one (zero throwaway code, production-ready)',
            'Skin in the game contractual alignment on mission milestones'
          ],
          metric: '100%',
          metricLabelFr: 'Adoption métier démontrée',
          metricLabelEn: 'Validated user adoption rate',
          linkedSolutionBlockId: 'sol-custom-case',
          tags: ['Strike Teams', 'Prototypage', 'MVP', 'Craftsmanship']
        }
      ]
    },
    transformer: {
      title: 'TRANSFORMER',
      titleEn: 'TRANSFORM',
      taglineFr: 'l’organisation et sa culture, les compétences',
      taglineEn: 'organization, culture, and team competencies',
      color: '#5374B4',
      accentBg: 'bg-[#5374B4]',
      borderActive: 'border-[#5374B4]',
      textActive: 'text-[#5374B4]',
      number: '03',
      headlineFr: 'Diffuser l’excellence Craft, moderniser les modèles opérationnels et former les équipes à l’ère de l’IA.',
      headlineEn: 'Spreading Software Craftsmanship, modernizing operating models, and upskilling teams for AI.',
      statsBadgeFr: '1000+ Formés / an · DORA Elite · Team Topologies',
      statsBadgeEn: '1000+ Trained / yr · DORA Elite · Team Topologies',
      offers: [
        {
          id: 'off-operating-model',
          titleFr: 'Target Operating Model & Team Topologies',
          titleEn: 'Target Operating Model & Team Topologies',
          typeFr: 'Conseil & Audit',
          typeEn: 'Advisory & Audit',
          subtitleFr: 'Aligner la structure organisationnelle sur les flux de valeur métier',
          subtitleEn: 'Align organizational topology directly with business value streams',
          descriptionFr: 'Suppression des silos fonctionnels, mise en place des Team Topologies (Stream-aligned, Platform, Enabling), adoption des métriques DORA et clarification des rôles à l’ère de l’ingénierie augmentée.',
          descriptionEn: 'Breaking functional silos, establishing Team Topologies (Stream-aligned, Platform, Enabling), deploying DORA metrics, and redefining roles for augmented engineering.',
          pointsFr: [
            'Diagnostic de fluidité organisationnelle et cartographie des value streams',
            'Déploiement des Team Topologies pour responsabiliser les squads de delivery',
            'Mise en place des indicateurs DORA et pilotage par les résultats concrets'
          ],
          pointsEn: [
            'Organizational friction diagnostics and value stream flow mapping',
            'Team Topologies implementation to empower autonomous stream-aligned squads',
            'DORA metrics tracking and outcome-driven C-level governance'
          ],
          metric: 'Elite',
          metricLabelFr: 'Statut maturité DORA & agilité',
          metricLabelEn: 'DORA Elite maturity status',
          linkedSolutionBlockId: 'sol-team-topologies',
          tags: ['Team Topologies', 'DORA Metrics', 'Value Streams', 'Agilité']
        },
        {
          id: 'off-zenika-training',
          titleFr: 'Zenika Training : Académies & Upskilling IA',
          titleEn: 'Zenika Training: Academies & AI Upskilling',
          typeFr: 'Formation',
          typeEn: 'Training',
          subtitleFr: 'Parcours certifiants pour développeurs, architectes, data et leaders',
          subtitleEn: 'Certified curriculum for developers, architects, data engineers, and leaders',
          descriptionFr: 'Organisme de formation de référence depuis 2006. Des dizaines de cursus animés par nos consultants du terrain : IA générative pratique, architectures Cloud, Spring Boot, React, DevOps et Craftsmanship.',
          descriptionEn: 'Industry-leading certified training provider since 2006. Dozens of hands-on courses led by active practitioners: generative AI, cloud platforms, Spring, React, DevOps, and Craftsmanship.',
          pointsFr: [
            'Parcours C-Level & Managers : Décider et piloter des projets tech & IA',
            'Académies d’ingénieurs : Maîtriser le code augmenté, les tests et l’IA agentique',
            'Formations certifiantes partenaires : Google Cloud, AWS, GitHub, Confluent'
          ],
          pointsEn: [
            'Executive tracks: Leading and governing AI & modern software initiatives',
            'Engineering bootcamps: Mastering augmented coding, TDD, and agentic workflows',
            'Certified partner training: Google Cloud, AWS, GitHub, Confluent'
          ],
          metric: '1000+',
          metricLabelFr: 'Professionnels formés chaque année',
          metricLabelEn: 'Engineers trained each year',
          linkedSolutionBlockId: 'sol-zenika-training',
          tags: ['Zenika Training', 'Certifications', 'Upskilling IA', 'Qualiopi']
        },
        {
          id: 'off-craft-excellence',
          titleFr: 'Engineering Craftsmanship & Pratiques XP',
          titleEn: 'Engineering Craftsmanship & XP Practices',
          typeFr: 'Conseil & Audit',
          typeEn: 'Advisory & Audit',
          subtitleFr: 'Accompagner vos équipes vers une autonomie et une qualité de code sans compromis',
          subtitleEn: 'Mentoring in-house squads toward full autonomy and uncompromising code health',
          descriptionFr: 'Coaching technique et immersion en pair-programming au cœur de vos équipes. Diffusion des pratiques fondamentales : Test-Driven Development (TDD), Domain-Driven Design (DDD), Clean Architecture et revues collaboratives.',
          descriptionEn: 'Hands-on technical mentoring and pair-programming embedded within your squads. Instilling core engineering disciplines: TDD, DDD, Clean Architecture, and collaborative reviews.',
          pointsFr: [
            'Immersion de Tech Leads & Craftsmen Zenika dans vos squads',
            'DoJos de code réguliers, Katas d’architecture et ateliers d’acculturation',
            'Amélioration pérenne de la qualité logicielle et rétention des talents tech'
          ],
          pointsEn: [
            'Embedding Zenika Tech Leads and Craftsmen within internal delivery squads',
            'Regular coding dojos, architecture katas, and culture-sharing workshops',
            'Sustained software quality boost and higher engineering talent retention'
          ],
          metric: '98%',
          metricLabelFr: 'Rétention et satisfaction des développeurs',
          metricLabelEn: 'Developer retention and satisfaction',
          linkedSolutionBlockId: 'sol-lean-strike',
          tags: ['Craftsmanship', 'TDD', 'DDD', 'Pair Programming']
        },
        {
          id: 'off-governance-compliance',
          titleFr: 'Gouvernance IA Responsable & Conformité Souveraine',
          titleEn: 'Responsible AI Governance & Sovereign Compliance',
          typeFr: 'Conseil & Audit',
          typeEn: 'Advisory & Audit',
          subtitleFr: 'Anticiper l’IA Act, DORA, NIS2 et garantir la sécurité by design',
          subtitleEn: 'Comply with the EU AI Act, DORA, NIS2 and enforce security by design',
          descriptionFr: 'Mise en place d’un cadre d’audit et de gouvernance pour déployer l’IA et le Cloud en toute sérénité : classification des risques réglementaires, audit d’explicabilité, protection des données et souveraineté.',
          descriptionEn: 'Comprehensive governance framework to roll out AI and cloud solutions with confidence: regulatory risk classification, explainability audits, data sovereignty, and compliance guardrails.',
          pointsFr: [
            'Audit de conformité IA Act européen et classification des cas d’usage',
            'Sécurisation des architectures cloud et respect des normes DORA / NIS2',
            'Charte éthique, audit d’explicabilité et protection de la propriété intellectuelle'
          ],
          pointsEn: [
            'European AI Act compliance auditing and risk tier classification',
            'Cloud security hardening aligning with DORA and NIS2 mandates',
            'Ethical guidelines, explainability audits, and IP protection guardrails'
          ],
          metric: '100%',
          metricLabelFr: 'Conformité réglementaire garantie',
          metricLabelEn: 'Guaranteed regulatory compliance',
          linkedSolutionBlockId: 'sol-gov-compliance',
          tags: ['IA Act', 'DORA', 'NIS2', 'Souveraineté', 'Éthique']
        }
      ]
    }
  };

  // 3. Valeur Métier Mesurable (Right column - from slide)
  const roiOutcomes = [
    {
      id: 'o-alignement',
      labelFr: 'Alignement avec la stratégie d’entreprise',
      labelEn: 'Alignment with Corporate Strategy',
      metric: '100%',
      subFr: 'Chaque euro IT investi sert directement les objectifs stratégiques prioritaires.',
      subEn: 'Every IT dollar directly serves priority enterprise business targets.',
      linkedAxis: 'transformer' as StrategicAxisId
    },
    {
      id: 'o-securite',
      labelFr: 'Sécurité, conformité, durabilité',
      labelEn: 'Security, Compliance, Sustainability',
      metric: 'By Design',
      subFr: 'Respect strict de l’IA Act, DORA, NIS2 et empreinte carbone maîtrisée.',
      subEn: 'Strict compliance with AI Act, DORA, NIS2, and sustainable computing.',
      linkedAxis: 'optimiser' as StrategicAxisId
    },
    {
      id: 'o-pertinence',
      labelFr: 'Pertinence des logiciels pour les métiers',
      labelEn: 'Software Relevance for Business Users',
      metric: '+65%',
      subFr: 'Adoption immédiate par les équipes grâce au Product Discovery et au Craft.',
      subEn: 'Immediate adoption by operational teams through Product Discovery & Craft.',
      linkedAxis: 'innover' as StrategicAxisId
    },
    {
      id: 'o-ia',
      labelFr: 'Bénéfices tangibles de l’IA',
      labelEn: 'Tangible AI Business Benefits',
      metric: '< 6 sem.',
      subFr: 'Du cas d’usage au ROI opérationnel mesuré sans effets de mode sans lendemain.',
      subEn: 'From use-case discovery to measured ROI without throwaway hype.',
      linkedAxis: 'innover' as StrategicAxisId
    },
    {
      id: 'o-ttm',
      labelFr: 'Réduction du time-to-market',
      labelEn: 'Accelerated Time-to-Market',
      metric: 'x3',
      subFr: 'Livraisons continues et sécurisées grâce aux Strike Teams et au SDLC augmenté.',
      subEn: 'Continuous and secured releases powered by Strike Teams & augmented pipelines.',
      linkedAxis: 'optimiser' as StrategicAxisId
    },
    {
      id: 'o-innovation',
      labelFr: 'Innovation continue',
      labelEn: 'Continuous Innovation Engine',
      metric: '99.99%',
      subFr: 'Capacité à tester de nouveaux modèles tout en garantissant la résilience du SI.',
      subEn: 'Ability to experiment with frontier paradigms while securing core operations.',
      linkedAxis: 'transformer' as StrategicAxisId
    }
  ];

  const currentAxisData = axesConfig[activeAxis];

  const handleOpenContactWithOffer = (offer: AxisOffer) => {
    // Look up or synthesize a SolutionBlock
    const existingBlock = SOLUTION_BLOCKS.find(b => b.id === offer.linkedSolutionBlockId);
    if (existingBlock) {
      onOpenContact([existingBlock]);
    } else {
      const syntheticBlock: SolutionBlock = {
        id: offer.id,
        category: activeAxis === 'optimiser' ? 'core-expertise' : activeAxis === 'innover' ? 'business-impact' : 'methodology',
        tier: activeAxis === 'optimiser' ? 1 : activeAxis === 'innover' ? 1 : 2,
        title: offer.titleFr,
        titleEn: offer.titleEn,
        subtitle: offer.subtitleFr,
        subtitleEn: offer.subtitleEn,
        description: offer.descriptionFr,
        descriptionEn: offer.descriptionEn,
        bulletPoints: offer.pointsFr,
        bulletPointsEn: offer.pointsEn,
        color: currentAxisData.color,
        iconName: activeAxis === 'optimiser' ? 'Cpu' : activeAxis === 'innover' ? 'Sparkles' : 'Users',
        tags: offer.tags
      };
      onOpenContact([syntheticBlock]);
    }
  };

  const handleToggleAssemblyForOffer = (offer: AxisOffer) => {
    if (!onToggleAssembly) return;
    const existingBlock = SOLUTION_BLOCKS.find(b => b.id === offer.linkedSolutionBlockId);
    if (existingBlock) {
      onToggleAssembly(existingBlock);
    } else {
      const syntheticBlock: SolutionBlock = {
        id: offer.id,
        category: activeAxis === 'optimiser' ? 'core-expertise' : activeAxis === 'innover' ? 'business-impact' : 'methodology',
        tier: 1,
        title: offer.titleFr,
        titleEn: offer.titleEn,
        subtitle: offer.subtitleFr,
        subtitleEn: offer.subtitleEn,
        description: offer.descriptionFr,
        descriptionEn: offer.descriptionEn,
        bulletPoints: offer.pointsFr,
        bulletPointsEn: offer.pointsEn,
        color: currentAxisData.color,
        iconName: activeAxis === 'optimiser' ? 'Cpu' : activeAxis === 'innover' ? 'Sparkles' : 'Users',
        tags: offer.tags
      };
      onToggleAssembly(syntheticBlock);
    }
  };

interface GrandSentenceWord {
  fr: string;
  en: string;
  highlight?: 'red' | 'emerald';
}

interface SentenceLine {
  highlightLine?: 'red' | 'emerald';
  words: GrandSentenceWord[];
}

const LEFT_PHRASE_LINES: SentenceLine[] = [
  {
    highlightLine: 'red',
    words: [
      { fr: 'Maîtriser', en: 'Mastering', highlight: 'red' },
      { fr: 'la', en: 'the', highlight: 'red' },
      { fr: 'complexité', en: 'complexity', highlight: 'red' },
    ],
  },
  {
    words: [
      { fr: 'des', en: 'of' },
      { fr: 'systèmes', en: 'information' },
    ],
  },
  {
    words: [
      { fr: 'd’information', en: 'systems' },
      { fr: 'et', en: 'and' },
      { fr: 'des', en: 'the' },
    ],
  },
  {
    words: [
      { fr: 'organisations...', en: 'organizations...' },
    ],
  },
];

const RIGHT_PHRASE_LINES: SentenceLine[] = [
  {
    words: [
      { fr: '...', en: '...' },
      { fr: 'pour', en: 'to' },
      { fr: 'traduire', en: 'translate' },
      { fr: 'les', en: 'the' },
    ],
  },
  {
    words: [
      { fr: 'investissements', en: 'IT' },
      { fr: 'IT', en: 'investments' },
      { fr: 'en', en: 'into' },
    ],
  },
  {
    highlightLine: 'red',
    words: [
      { fr: 'valeur', en: 'measurable', highlight: 'red' },
      { fr: 'métier', en: 'business', highlight: 'red' },
      { fr: 'mesurable', en: 'value', highlight: 'red' },
    ],
  },
];

  // Helper to count total characters for precise letter-by-letter reveal
  const countLettersInLines = (lines: SentenceLine[], currentLang: Language) => {
    let count = 0;
    for (const line of lines) {
      for (const w of line.words) {
        const text = currentLang === 'fr' ? w.fr : w.en;
        count += text ? Array.from(text).length : 0;
      }
    }
    return Math.max(1, count);
  };

  const totalLeftLetters = countLettersInLines(LEFT_PHRASE_LINES, lang);
  const totalRightLetters = countLettersInLines(RIGHT_PHRASE_LINES, lang);

  const renderSentenceWord = (
    word: GrandSentenceWord,
    letterOffset: number,
    totalLetters: number,
    isRightSide: boolean
  ) => {
    const text = lang === 'fr' ? word.fr : word.en;
    if (!text) return null;

    const chars = Array.from(text);

    return (
      <span
        key={`${isRightSide ? 'r-word' : 'l-word'}-${letterOffset}`}
        className="inline-block mr-2 sm:mr-3 lg:mr-3.5 mb-1 whitespace-nowrap will-change-transform"
      >
        {chars.map((char, cIdx) => {
          const charIndex = letterOffset + cIdx;
          let startThreshold = 0;

          if (!isRightSide) {
            // First phrase reveals immediately from 0.00 to 0.45 with zero deadzone or start lag
            startThreshold = (charIndex / totalLetters) * 0.45;
          } else {
            // Second phrase follows seamlessly from 0.48 to 0.93 with identical brisk cadence
            startThreshold = 0.48 + (charIndex / totalLetters) * 0.45;
          }

          const isRevealed = sentenceProgress >= startThreshold;
          // Progress inside this character's reveal window with responsive transition
          const rawFactor = Math.max(0, Math.min(1, (sentenceProgress - startThreshold) / 0.012));
          const factor = rawFactor * rawFactor * (3 - 2 * rawFactor);
          // Active tip of the typing/revealing wave
          const isCurrentChar = isRevealed && factor < 1;

          let colorClasses = '';
          if (!isRevealed) {
            colorClasses = 'text-slate-400/20 dark:text-white/10 select-none';
          } else if (word.highlight === 'red') {
            colorClasses = isCurrentChar
              ? 'text-[#FF1744] font-black drop-shadow-[0_0_24px_rgba(255,23,68,0.9)]'
              : 'text-[#E60039] font-black drop-shadow-[0_0_18px_rgba(230,0,57,0.75)]';
          } else if (word.highlight === 'emerald') {
            colorClasses = isCurrentChar
              ? 'text-emerald-300 font-black drop-shadow-[0_0_24px_rgba(110,231,183,0.9)]'
              : 'text-emerald-400 font-black drop-shadow-[0_0_18px_rgba(52,211,153,0.75)]';
          } else {
            colorClasses = isCurrentChar
              ? 'text-slate-900 dark:text-white font-black'
              : 'text-slate-900 dark:text-white font-extrabold';
          }

          // Crisp, direct transition without sluggish 300ms delay or blur filter overhead
          const scale = isRevealed ? (isCurrentChar ? 1.03 : 1) : 0.98;
          const translateY = isRevealed ? (isCurrentChar ? -1 : 0) : 1;

          return (
            <span
              key={`${isRightSide ? 'r-char' : 'l-char'}-${letterOffset}-${cIdx}`}
              className={`inline-block transition-[color,opacity,transform] duration-150 ease-out will-change-transform ${colorClasses}`}
              style={{
                transform: `scale(${scale}) translateY(${translateY}px)`,
                opacity: isRevealed ? 1 : 0.14,
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <section
      id="value-stream"
      className="relative z-10 w-full pt-2 sm:pt-4 pb-12 sm:pb-20 border-t border-slate-200 dark:border-white/10 overflow-x-clip scroll-mt-20 bg-slate-50/60 dark:bg-[#07090E]/80 transition-colors"
    >
      {/* Background ambient lighting accents */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#E60039]/5 dark:bg-[#E60039]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1720px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* GRAND VALUE STATEMENT: TITRE ET DIALOGUE VISUEL GAUCHE -> DROITE PINNÉS AU CENTRE */}
        {/* ========================================================================= */}
        <div
          ref={sentenceBannerRef}
          id="value-stream-grand-sentence"
          className="relative w-full"
          style={{ height: isMobile ? '130vh' : '240vh' }}
        >
          {/* STICKY VIEWPORT CONTAINER: Centered in mobile viewport */}
          <div className="sticky top-0 min-h-screen h-screen w-full flex flex-col justify-center items-center py-6 sm:py-14 lg:py-20 overflow-hidden z-20">
            <div className="w-full max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center my-auto relative">
              
              {/* Titre : Notre valeur */}
              <div className="text-center w-full max-w-4xl mx-auto mb-5 sm:mb-6 lg:mb-8">
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#E60039] font-display tracking-tight text-center">
                  {lang === 'fr' ? 'Notre valeur' : 'Our Value'}
                </h2>
              </div>

              {/* Subtle ambient glows behind each phrase */}
              <div className="absolute top-10 left-0 w-80 h-80 bg-[#E60039]/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-10 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

              <div className="relative z-10 w-full space-y-6 sm:space-y-6 lg:space-y-6 flex flex-col justify-center">
                
                {/* 1. LEFT PHRASE: ORIGINE & CONSTAT (Centered on mobile, text-left on md+) */}
                <div className="text-center md:text-left max-w-3xl mx-auto md:mx-0 space-y-1.5 sm:space-y-2 w-full">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[48px] 2xl:text-[54px] font-extrabold font-display leading-[1.18] sm:leading-[1.14] tracking-tight">
                    {LEFT_PHRASE_LINES.map((line, lineIdx) => {
                      let lineLetterOffset = 0;
                      for (let i = 0; i < lineIdx; i++) {
                        for (const w of LEFT_PHRASE_LINES[i].words) {
                          const t = lang === 'fr' ? w.fr : w.en;
                          lineLetterOffset += t ? Array.from(t).length : 0;
                        }
                      }
                      let wordLetterCursor = lineLetterOffset;

                      return (
                        <div key={lineIdx} className="block leading-[1.18] sm:leading-[1.14]">
                          {line.words.map((w, wIdx) => {
                            const t = lang === 'fr' ? w.fr : w.en;
                            const wordStart = wordLetterCursor;
                            if (t) {
                              wordLetterCursor += Array.from(t).length;
                            }
                            return renderSentenceWord(w, wordStart, totalLeftLetters, false);
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. RIGHT PHRASE: IMPACT & DESTINATION (Centered on mobile, text-right on md+) */}
                <div className="text-center md:text-right max-w-3xl mx-auto md:ml-auto md:mr-0 space-y-1.5 sm:space-y-2 w-full">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[48px] 2xl:text-[54px] font-extrabold font-display leading-[1.18] sm:leading-[1.14] tracking-tight">
                    {RIGHT_PHRASE_LINES.map((line, lineIdx) => {
                      let lineLetterOffset = 0;
                      for (let i = 0; i < lineIdx; i++) {
                        for (const w of RIGHT_PHRASE_LINES[i].words) {
                          const t = lang === 'fr' ? w.fr : w.en;
                          lineLetterOffset += t ? Array.from(t).length : 0;
                        }
                      }
                      let wordLetterCursor = lineLetterOffset;

                      return (
                        <div key={lineIdx} className="block leading-[1.18] sm:leading-[1.14]">
                          {line.words.map((w, wIdx) => {
                            const t = lang === 'fr' ? w.fr : w.en;
                            const wordStart = wordLetterCursor;
                            if (t) {
                              wordLetterCursor += Array.from(t).length;
                            }
                            return renderSentenceWord(w, wordStart, totalRightLetters, true);
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* Subtle Discreet Scroll Progress Line pinned at bottom */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-[130px] sm:max-w-[160px] px-4 pointer-events-none">
              <div className="w-full h-[1px] bg-slate-300/40 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400/70 dark:bg-white/30 transition-all duration-150 rounded-full"
                  style={{ width: `${sentenceProgress * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PROTOTYPE : SÉLECTEUR DE VERSION DESKTOP (À SUPPRIMER APRÈS CHOIX)        */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex justify-center pt-6">
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/90 dark:bg-white/[0.06] border border-dashed border-slate-300 dark:border-white/20 shadow-sm">
            <span className="px-3 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-white/50">
              {lang === 'fr' ? 'Prototype · Version desktop' : 'Prototype · Desktop version'}
            </span>
            {([
              ['runway', lang === 'fr' ? 'A · Animation des piliers' : 'A · Pillars animation'],
              ['catalog', lang === 'fr' ? 'B · Catalogue d’interventions' : 'B · Intervention catalog'],
            ] as const).map(([variant, label]) => (
              <button
                key={variant}
                type="button"
                aria-pressed={desktopVariant === variant}
                onClick={() => switchDesktopVariant(variant)}
                className={`px-3.5 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                  desktopVariant === variant
                    ? 'bg-[#E60039] text-white shadow-xs'
                    : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3 PILIERS STRATÉGIQUES : RUNWAY PINNÉ CENTRÉ LE TEMPS DU SCROLL           */}
        {/* ========================================================================= */}
        <div
          ref={runwayRef}
          className={`relative w-full pt-4 ${desktopVariant === 'catalog' ? 'hidden' : ''}`}
          style={{ height: isMobile ? 'auto' : '280vh' }}
        >
          {/* ========================================================================= */}
          {/* DESKTOP VIEW (lg+): RUNWAY PINNÉ CENTRÉ AU SCROLL (3 COLONNES INTERACTIVES) */}
          {/* ========================================================================= */}
          <div className="hidden lg:flex sticky top-0 min-h-screen lg:h-screen w-full flex-col justify-center items-center z-30 py-4 sm:py-6 lg:py-8 xl:py-10 px-2 sm:px-4 bg-slate-50/95 dark:bg-[#07090E]/95 backdrop-blur-md transition-colors">
            <div className="w-full max-w-[1660px] mx-auto flex flex-col justify-center space-y-4 sm:space-y-5 lg:space-y-6">
              
              {/* Titre unique et descriptif de la valeur ajoutée Zenika & 3 piliers */}
              <motion.div 
                style={{ y: titleParallaxY, opacity: titleParallaxOpacity }}
                className="text-center space-y-2 sm:space-y-2.5 pb-1 max-w-4xl mx-auto"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[46px] font-black text-slate-900 dark:text-white font-display tracking-tight leading-tight">
                  {lang === 'fr' ? (
                    <>
                      La <span className="text-[#E60039] dark:text-[#FF385C]">« valeur ajoutée »</span> Zenika :
                    </>
                  ) : (
                    <>
                      Zenika's <span className="text-[#E60039] dark:text-[#FF385C]">"added value"</span>:
                    </>
                  )}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-200 max-w-3xl mx-auto font-medium leading-relaxed">
                  {lang === 'fr'
                    ? 'Structure et méthode, expertise, expérience pour maîtriser/dépasser cette complexité'
                    : 'Structure and method, expertise, and experience to master and transcend this complexity'}
                </p>
              </motion.div>

              <div className="rounded-3xl lg:rounded-[32px] bg-white dark:bg-[#090C15] border border-slate-200 dark:border-white/10 p-6 sm:p-7 lg:p-8 xl:p-10 shadow-2xl transition-colors overflow-hidden">
                {/* --------------------------------------------------------------------- */}
                {/* 3 COLONNES INTERACTIVES DU SLIDE : GAUCHE (COMPLEXITÉS) | CENTRE (3 PILIERS) | DROITE (ROI) */}
                {/* --------------------------------------------------------------------- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 xl:gap-8 items-stretch">
                  
                  {/* =================================================================== */}
                  {/* COLONNE 1 : COMPLEXITÉ CONSTATÉE (LEFT - 7 POINTS DE FRICTIONS)      */}
                  {/* =================================================================== */}
                  <motion.div 
                    style={{ x: leftColX, y: leftColY, opacity: leftColOpacity, scale: leftColScale, transformOrigin: 'left center' }}
                    className="lg:col-span-4 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Header Colonne Gauche : Titre card "Complexité constatée" */}
                      <motion.div 
                        style={{ opacity: sideHeadersOpacity, y: sideHeadersY }}
                        className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 mb-3 shadow-xs"
                      >
                        <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                          <AlertTriangle size={18} className="stroke-[2.2]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs sm:text-[13px] font-display font-extrabold uppercase tracking-wider text-slate-900 dark:text-white leading-tight">
                            {lang === 'fr' ? 'Complexité constatée' : 'Observed Complexity'}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-white/60 font-medium truncate mt-0.5">
                            {lang === 'fr' ? '7 points de blocage majeurs chez nos clients' : '7 major client friction points'}
                          </p>
                        </div>
                      </motion.div>

                      {/* 7 Frictions dans une colonne verticale fluide avec hauteur respirante */}
                      <div className="space-y-2.5 xl:space-y-3">
                        {complexityItems.map((item) => {
                          const resolvesWithActive = item.resolvedBy === activeAxis;
                          const itemTheme = AXIS_COLOR_SYSTEM[item.resolvedBy];
                          const activeTheme = AXIS_COLOR_SYSTEM[activeAxis];

                          return (
                            <button
                              type="button"
                              key={item.id}
                              onMouseEnter={() => {
                                setHoveredFriction(item.id);
                                setHoveredOutcome(item.yieldsOutcome);
                              }}
                              onMouseLeave={() => {
                                setHoveredFriction(null);
                                setHoveredOutcome(null);
                              }}
                              onClick={() => {
                                manualLockUntilRef.current = Date.now() + 3500;
                                setActiveAxis(item.resolvedBy);
                                setActiveStep(item.resolvedBy === 'optimiser' ? 1 : item.resolvedBy === 'innover' ? 2 : 3);
                              }}
                              className={`w-full p-2.5 sm:p-3 xl:p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                                resolvesWithActive
                                  ? 'text-white border-transparent shadow-md scale-[1.01]'
                                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#121622] dark:hover:bg-[#161c2b] border-slate-200 hover:border-slate-300 dark:border-white/5 dark:hover:border-white/20 text-slate-800 dark:text-slate-200 shadow-2xs'
                              }`}
                              style={
                                resolvesWithActive
                                  ? { backgroundColor: activeTheme.leftSolidColor }
                                  : undefined
                              }
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{
                                      backgroundColor: resolvesWithActive
                                        ? '#FFFFFF'
                                        : itemTheme.leftSolidColor
                                    }}
                                  />
                                  <span className={`text-xs sm:text-[13px] font-bold font-display truncate ${resolvesWithActive ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                    {lang === 'fr' ? item.labelFr : item.labelEn}
                                  </span>
                                </div>
                                <span 
                                  className={`text-[9.5px] font-display font-bold px-1.5 py-0.5 rounded shrink-0 ${resolvesWithActive ? 'bg-white/20 text-white' : ''}`}
                                  style={!resolvesWithActive ? { backgroundColor: `${itemTheme.leftSolidColor}15`, color: itemTheme.leftSolidColor } : undefined}
                                >
                                  → {item.resolvedBy.toUpperCase()}
                                </span>
                              </div>
                              <p className={`text-[11px] sm:text-xs mt-1 pl-3 leading-relaxed line-clamp-2 ${resolvesWithActive ? 'text-white/90 font-normal' : 'text-slate-500 dark:text-white/60 font-light'}`}>
                                {lang === 'fr' ? item.detailFr : item.detailEn}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>

                  {/* =================================================================== */}
                  {/* COLONNE 2 : LES 3 AXES STRATÉGIQUES (CENTER - CŒUR DE L'OFFRE)       */}
                  {/* =================================================================== */}
                  <motion.div 
                    style={{ scale: centerColScale, y: centerColY, opacity: centerColOpacity, transformOrigin: 'center center' }}
                    className="lg:col-span-4 flex flex-col justify-between space-y-3 relative"
                  >
                    {/* Halo d'ambiance doux centré derrière les cartes */}
                    <div 
                      aria-hidden="true" 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-56 rounded-full blur-[100px] pointer-events-none opacity-20 dark:opacity-25 transition-all duration-500"
                      style={{ background: AXIS_COLOR_SYSTEM[activeAxis].centerGradient }}
                    />

                    <div className="relative z-10 space-y-3">
                      {/* Header Colonne Centre */}
                      <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 shadow-xs mb-3">
                        <div className="w-8 h-8 rounded-xl bg-[#E60039]/15 text-[#E60039] flex items-center justify-center shrink-0 shadow-xs">
                          <Layers size={18} className="stroke-[2.2]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs sm:text-[13px] font-display font-extrabold uppercase tracking-wider text-slate-900 dark:text-white leading-tight">
                            {lang === 'fr' ? '3 Piliers Stratégiques' : '3 Strategic Pillars'}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-white/60 font-medium truncate mt-0.5">
                            {lang === 'fr' ? 'La méthode et l’expertise Zenika' : 'Zenika methodology & expertise'}
                          </p>
                        </div>
                      </div>

                      {/* Les 3 Cartes Piliers empilées verticalement avec respiration en hauteur */}
                      <div className="space-y-3 sm:space-y-3.5 xl:space-y-4">
                        {(['optimiser', 'innover', 'transformer'] as StrategicAxisId[]).map((axisKey, idx) => {
                          const conf = axesConfig[axisKey];
                          const isActive = activeAxis === axisKey;
                          const theme = AXIS_COLOR_SYSTEM[axisKey];
                          const axisNum = idx + 1;

                          return (
                            <div
                              key={axisKey}
                              role="button"
                              tabIndex={0}
                              aria-label={`${conf.title} - ${lang === 'fr' ? 'Sélectionner le pilier' : 'Select pillar'}`}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  manualLockUntilRef.current = Date.now() + 3500;
                                  setActiveAxis(axisKey);
                                  setActiveStep(axisNum as 1 | 2 | 3);
                                }
                              }}
                              onClick={() => {
                                manualLockUntilRef.current = Date.now() + 3500;
                                setActiveAxis(axisKey);
                                setActiveStep(axisNum as 1 | 2 | 3);
                              }}
                              className={`rounded-2xl p-4 sm:p-5 xl:p-6 text-center cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col items-center justify-between ${
                                isActive
                                  ? 'shadow-2xl ring-2 ring-white/60 scale-[1.02] opacity-100 z-10 min-h-[155px] sm:min-h-[170px] xl:min-h-[185px]'
                                  : 'opacity-80 hover:opacity-95 hover:scale-[1.01] hover:shadow-lg min-h-[125px] sm:min-h-[135px] xl:min-h-[148px]'
                              }`}
                              style={{
                                background: theme.centerGradient
                              }}
                            >
                              {/* Titre & Sous-titre en italique */}
                              <div className="w-full space-y-1">
                                <div className="flex items-center justify-center gap-2">
                                  <h4 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-white drop-shadow-xs">
                                    {conf.title}
                                  </h4>
                                  {isActive && (
                                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                                  )}
                                </div>
                                <p className="text-sm sm:text-base font-sans font-semibold text-white leading-snug">
                                  {lang === 'fr' ? conf.taglineFr : conf.taglineEn}
                                </p>
                              </div>

                              {/* Ligne stats informative */}
                              <div className="my-1.5 text-xs sm:text-sm font-sans font-medium text-white/80 leading-tight">
                                {lang === 'fr' ? conf.statsBadgeFr : conf.statsBadgeEn}
                              </div>

                              {/* Bouton Découvrir */}
                              {isActive && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    manualLockUntilRef.current = Date.now() + 4000;
                                    setActiveAxis(axisKey);
                                    setActiveStep(axisNum as 1 | 2 | 3);
                                    setExpandedAxes(prev => ({ ...prev, [axisKey]: true }));
                                    // The offers only live in version B: switch, then scroll once rendered
                                    scrollToOffersPendingRef.current = true;
                                    switchDesktopVariant('catalog');
                                  }}
                                  className="mt-1 px-4 py-1.5 rounded-full font-bold text-xs transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5 bg-white text-slate-900 hover:bg-slate-100 hover:scale-105 active:scale-95"
                                >
                                  <span>{lang === 'fr' ? 'Découvrir les offres' : 'Explore offers'}</span>
                                  <span>→</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>

                  {/* =================================================================== */}
                  {/* COLONNE 3 : VALEUR MÉTIER & ROI DÉBLOQUÉ (RIGHT - 6 IMPACTS CHIFFRÉS) */}
                  {/* =================================================================== */}
                  <motion.div 
                    style={{ x: rightColX, y: rightColY, opacity: rightColOpacity, scale: rightColScale, transformOrigin: 'right center' }}
                    className="lg:col-span-4 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      {/* Header Colonne Droite : Titre card "Valeur Métier & ROI" */}
                      <motion.div 
                        style={{ opacity: sideHeadersOpacity, y: sideHeadersY }}
                        className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 mb-3 shadow-xs"
                      >
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
                          <TrendingUp size={18} className="stroke-[2.2]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs sm:text-[13px] font-display font-extrabold uppercase tracking-wider text-slate-900 dark:text-white leading-tight">
                            {lang === 'fr' ? 'Valeur Métier & ROI' : 'Business Value & ROI'}
                          </h3>
                          <p className="text-[11px] text-slate-500 dark:text-white/60 font-medium truncate mt-0.5">
                            {lang === 'fr' ? '6 impacts concrets pour les DSI & Métiers' : '6 concrete impacts for CIOs & Business Units'}
                          </p>
                        </div>
                      </motion.div>

                      {/* 6 Measurable ROI Items dans une colonne verticale fluide avec respiration */}
                      <div className="space-y-2.5 xl:space-y-3">
                        {roiOutcomes.map((item) => {
                          const linkedToActive = item.linkedAxis === activeAxis;
                          const activeTheme = AXIS_COLOR_SYSTEM[activeAxis];

                          return (
                            <button
                              type="button"
                              key={item.id}
                              onClick={() => {
                                manualLockUntilRef.current = Date.now() + 3500;
                                setActiveAxis(item.linkedAxis);
                                setActiveStep(item.linkedAxis === 'optimiser' ? 1 : item.linkedAxis === 'innover' ? 2 : 3);
                              }}
                              className={`w-full p-2.5 sm:p-3 xl:p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                                linkedToActive
                                  ? 'text-white border-transparent shadow-md scale-[1.01]'
                                  : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#121622] dark:hover:bg-[#161c2b] border-slate-200 hover:border-slate-300 dark:border-white/5 dark:hover:border-white/20 text-slate-800 dark:text-white/80 shadow-2xs'
                              }`}
                              style={
                                linkedToActive
                                  ? { backgroundColor: activeTheme.rightSolidColor }
                                  : undefined
                              }
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <CheckCircle2
                                    size={14}
                                    className={`shrink-0 ${linkedToActive ? 'text-white' : 'text-emerald-500'}`}
                                  />
                                  <span className={`text-xs sm:text-[13px] font-bold font-display truncate ${linkedToActive ? 'text-white' : 'text-slate-900 dark:text-slate-200'}`}>
                                    {lang === 'fr' ? item.labelFr : item.labelEn}
                                  </span>
                                </div>
                                <span className={`text-[10px] sm:text-[11px] font-display font-bold shrink-0 ${linkedToActive ? 'bg-white/20 text-white px-2 py-0.5 rounded' : 'text-emerald-600 dark:text-emerald-400 font-extrabold'}`}>
                                  {item.metric}
                                </span>
                              </div>
                              <p className={`text-[11px] sm:text-xs mt-1 pl-4 leading-relaxed line-clamp-2 ${linkedToActive ? 'text-white/90 font-normal' : 'text-slate-500 dark:text-white/60 font-light'}`}>
                                {lang === 'fr' ? item.subFr : item.subEn}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>

            </div>
          </div>

          {/* Indicateur de défilement discret en bas du cadre centré */}
          <div className="hidden lg:flex items-center justify-center gap-2 pt-2 text-[11px] font-mono text-slate-500 dark:text-white/50">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: AXIS_COLOR_SYSTEM[activeAxis].leftSolidColor }}
            />
            <span>
              {lang === 'fr'
                ? `Défilez pour parcourir les 3 piliers · Pilier actif : ${activeStep}/3 (${activeAxis.toUpperCase()})`
                : `Scroll to explore the 3 pillars · Active: ${activeStep}/3 (${activeAxis.toUpperCase()})`}
            </span>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* CATALOGUE DES 3 PILIERS STRATÉGIQUES & 12 OFFRES ACTIVABLES               */}
        {/* ========================================================================= */}
        <div className={`text-center pt-4 sm:pt-6 lg:pt-12 pb-0 max-w-4xl mx-auto space-y-1.5 px-4 ${desktopVariant === 'runway' ? 'lg:hidden' : ''}`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E60039]/10 text-[#E60039] text-xs font-bold font-mono uppercase tracking-wider mb-1">
            <Sparkles size={13} />
            <span>{lang === 'fr' ? 'Catalogue d’interventions' : 'Intervention Catalog'}</span>
          </div>
          <h4 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
            {lang === 'fr' ? 'Nos 3 piliers stratégiques en action :' : 'Our 3 strategic pillars in action:'}
          </h4>
          <p className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-white/90 font-normal leading-relaxed">
            {lang === 'fr'
              ? 'Explorez les 12 offres activables pour relever vos défis technologiques et organisationnels'
              : 'Explore the 12 actionable offerings to tackle your tech and organizational challenges'}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 3. LES 3 CARTES DÉPLIABLES (OPTIMISER, INNOVER, TRANSFORMER)              */}
        {/* ========================================================================= */}
        <div
          id="offers-showcase"
          className={`space-y-6 mt-6 max-w-5xl mx-auto w-full relative scroll-mt-24 ${desktopVariant === 'runway' ? 'lg:hidden' : ''}`}
        >
          {/* Subtle Ambient Glow */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[650px] h-[350px] rounded-full blur-[140px] pointer-events-none opacity-20 dark:opacity-25"
            style={{ background: AXIS_COLOR_SYSTEM[activeAxis].centerGradient }}
          />

          {/* 3 Cartes Piliers Dépliables */}
          {(['optimiser', 'innover', 'transformer'] as StrategicAxisId[]).map((axisKey) => {
            const conf = axesConfig[axisKey];
            const isExpanded = expandedAxes[axisKey];
            const theme = AXIS_COLOR_SYSTEM[axisKey];

            return (
              <div
                key={axisKey}
                className="rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden text-center"
                style={{
                  background: theme.centerGradient,
                }}
              >
                {/* Header cliquable pour déplier/replier */}
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  aria-label={`${conf.title} - ${isExpanded ? (lang === 'fr' ? 'Fermer les offres' : 'Close offers') : (lang === 'fr' ? 'Découvrir les 4 offres' : 'Discover 4 offers')}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleAxis(axisKey);
                    }
                  }}
                  onClick={() => toggleAxis(axisKey)}
                  className="cursor-pointer select-none space-y-2 flex flex-col items-center justify-center"
                >
                  <h4 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display uppercase tracking-tight text-white drop-shadow-sm">
                    {conf.title}
                  </h4>
                  <p className="text-sm sm:text-base lg:text-lg font-sans font-semibold text-white max-w-2xl mx-auto leading-snug">
                    {lang === 'fr' ? conf.taglineFr : conf.taglineEn}
                  </p>

                  {/* Ligne informative / statistiques */}
                  <div className="text-xs sm:text-sm font-sans font-medium text-white/80 leading-tight pt-0.5">
                    {axisKey === 'optimiser' && (
                      lang === 'fr'
                        ? '4 Offres Déployables · -40% Dette · x2.5 Vélocité · FinOps maîtrisé'
                        : '4 Packaged Offers · -40% Debt · 2.5x Velocity · Controlled FinOps'
                    )}
                    {axisKey === 'innover' && (
                      lang === 'fr'
                        ? '4 Offres Déployables · x3 Time-to-Market · IA Native · Frugalité'
                        : '4 Packaged Offers · 3x Time-to-Market · Native AI · Frugality'
                    )}
                    {axisKey === 'transformer' && (
                      lang === 'fr'
                        ? '4 Offres Déployables · 100% Alignement · Acculturation · Delivery Continu'
                        : '4 Packaged Offers · 100% Alignment · Acculturation · Continuous Delivery'
                    )}
                  </div>

                  {/* Bouton Découvrir / Fermer */}
                  <div className="pt-2 sm:pt-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleAxis(axisKey);
                      }}
                      className={`px-6 sm:px-7 py-2 sm:py-2.5 rounded-full font-bold text-xs sm:text-base transition-all shadow-md cursor-pointer inline-flex items-center gap-2 ${
                        isExpanded
                          ? 'bg-white text-slate-900 hover:bg-slate-100 shadow-xl'
                          : axisKey === 'transformer'
                            ? 'bg-white text-slate-900 hover:bg-slate-100 shadow-lg'
                            : 'bg-white/25 hover:bg-white/35 text-white border border-white/25 backdrop-blur-sm'
                      }`}
                    >
                      <span>
                        {isExpanded
                          ? (lang === 'fr' ? 'Fermer' : 'Close')
                          : (lang === 'fr' ? 'Découvrir' : 'Discover')}
                      </span>
                      {isExpanded ? <ChevronUp size={15} /> : <span>→</span>}
                    </button>
                  </div>
                </div>

                {/* Contenu Dépliable : Les 4 offres du pilier */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 mt-6 border-t border-white/20">
                        <div className="mb-4 text-center">
                          <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/80 px-3 py-1 rounded-full bg-black/15 backdrop-blur-sm border border-white/10">
                            {lang === 'fr' ? `4 Offres ${conf.title} — Cliquez pour ouvrir les détails` : `4 ${conf.title} Offers — Click to reveal details`}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                          {conf.offers.map((offer) => {
                            const isInAssembly = selectedAssembly.some(
                              b => b.id === offer.linkedSolutionBlockId || b.id === offer.id
                            );

                            return (
                              <button
                                type="button"
                                key={offer.id}
                                onClick={() => setModalOffer({ offer, axis: axisKey })}
                                className="w-full text-left rounded-2xl bg-white dark:bg-[#0F1422] text-slate-900 dark:text-white p-5 shadow-lg hover:shadow-2xl border border-white/30 dark:border-white/10 flex flex-col justify-between hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
                              >
                                <div className="space-y-3">
                                  {/* Badge type et métrique */}
                                  <div className="flex items-center justify-between gap-1">
                                    <span
                                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded"
                                      style={{
                                        color: conf.color,
                                        backgroundColor: `${conf.color}15`,
                                        border: `1px solid ${conf.color}30`
                                      }}
                                    >
                                      {lang === 'fr' ? offer.typeFr : offer.typeEn}
                                    </span>
                                    <span
                                      className="text-base font-black font-display"
                                      style={{ color: conf.color }}
                                    >
                                      {offer.metric}
                                    </span>
                                  </div>

                                  {/* Titre & Sous-titre */}
                                  <div>
                                    <h5 className="text-sm font-bold font-display group-hover:text-[#E60039] transition-colors leading-snug line-clamp-2">
                                      {lang === 'fr' ? offer.titleFr : offer.titleEn}
                                    </h5>
                                    <p className="text-xs text-slate-600 dark:text-white/60 line-clamp-2 mt-1 leading-snug">
                                      {lang === 'fr' ? offer.subtitleFr : offer.subtitleEn}
                                    </p>
                                  </div>

                                  {/* Nombre de livrables */}
                                  <div className="text-[11px] font-mono text-slate-500 dark:text-white/50 flex items-center gap-1.5 pt-1">
                                    <CheckCircle2 size={13} style={{ color: conf.color }} />
                                    <span>
                                      {(lang === 'fr' ? offer.pointsFr : offer.pointsEn).length} {lang === 'fr' ? 'livrables clés' : 'key deliverables'}
                                    </span>
                                  </div>
                                </div>

                                {/* Bouton pour ouvrir la modal */}
                                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs font-mono font-bold" style={{ color: conf.color }}>
                                  <span>{lang === 'fr' ? 'Voir le détail' : 'View details'}</span>
                                  <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Quick link to modular solution blocks - centered */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col items-center justify-center text-center gap-3.5 text-xs font-mono">
            <span className="text-slate-500 dark:text-white/50">
              {lang === 'fr'
                ? 'Besoin d’assembler des briques sur-mesure de nos 3 axes ?'
                : 'Need a customized composable assembly across our 3 axes?'}
            </span>
            <button
              type="button"
              onClick={() => onOpenContact()}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold transition-all hover:scale-[1.02] cursor-pointer shadow-sm"
            >
              <span>{lang === 'fr' ? 'Composer mon assemblage avec Zenika' : 'Build my assembly with Zenika'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL POUR LES DÉTAILS D'UNE OFFRE                                        */}
        {/* ========================================================================= */}
        <AnimatePresence>
          {modalOffer && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
              role="dialog"
              aria-modal="true"
            >
              {/* Fond semi-transparent avec flou */}
              <motion.div
                role="presentation"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setModalOffer(null)}
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer"
              />

              {/* Conteneur de la Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-2xl bg-white dark:bg-[#0F1420] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-10 my-auto text-left"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header de la Modal avec le dégradé du pilier */}
                <div
                  className="p-6 sm:p-8 text-white relative overflow-hidden"
                  style={{ background: AXIS_COLOR_SYSTEM[modalOffer.axis].centerGradient }}
                >
                  {/* Bouton Fermer */}
                  <button
                    onClick={() => setModalOffer(null)}
                    className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                    aria-label={lang === 'fr' ? 'Fermer la modal' : 'Close modal'}
                  >
                    <X size={18} />
                  </button>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-white">
                      {modalOffer.axis.toUpperCase()} · {lang === 'fr' ? modalOffer.offer.typeFr : modalOffer.offer.typeEn}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-white leading-tight">
                    {lang === 'fr' ? modalOffer.offer.titleFr : modalOffer.offer.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm font-sans font-semibold text-white/90 mt-1">
                    {lang === 'fr' ? modalOffer.offer.subtitleFr : modalOffer.offer.subtitleEn}
                  </p>

                  {/* Badge métrique */}
                  <div className="mt-4 inline-flex items-baseline gap-2 px-3.5 py-1.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/25">
                    <span className="text-xl sm:text-2xl font-black font-display text-white">
                      {modalOffer.offer.metric}
                    </span>
                    <span className="text-xs font-mono text-white/90 font-medium">
                      {lang === 'fr' ? modalOffer.offer.metricLabelFr : modalOffer.offer.metricLabelEn}
                    </span>
                  </div>
                </div>

                {/* Corps de la Modal */}
                <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                  {/* Description complète */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-white/50 mb-2">
                      {lang === 'fr' ? 'Description de l’offre' : 'Offer Overview'}
                    </h4>
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                      {lang === 'fr' ? modalOffer.offer.descriptionFr : modalOffer.offer.descriptionEn}
                    </p>
                  </div>

                  {/* Livrables & Engagements clés */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-white/50 mb-3">
                      {lang === 'fr' ? 'Livrables & Engagements concrets' : 'Key Deliverables & Commitments'}
                    </h4>
                    <div className="space-y-2.5">
                      {(lang === 'fr' ? modalOffer.offer.pointsFr : modalOffer.offer.pointsEn).map((point, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/5"
                        >
                          <CheckCircle2
                            size={16}
                            className="shrink-0 mt-0.5 text-emerald-500"
                          />
                          <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  {modalOffer.offer.tags && modalOffer.offer.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {modalOffer.offer.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/70"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions au bas de la modal */}
                <div className="p-4 sm:p-6 bg-slate-50 dark:bg-[#0A0D16] border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      const off = modalOffer.offer;
                      setModalOffer(null);
                      handleOpenContactWithOffer(off);
                    }}
                    className="w-full sm:w-auto flex-1 py-3 px-5 rounded-xl text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                    style={{ background: AXIS_COLOR_SYSTEM[modalOffer.axis].centerGradient }}
                  >
                    <span>{lang === 'fr' ? 'Cadrer cette offre avec Zenika' : 'Frame this offer with Zenika'}</span>
                    <ArrowRight size={15} />
                  </button>

                  {onToggleAssembly && (
                    <button
                      onClick={() => {
                        handleToggleAssemblyForOffer(modalOffer.offer);
                      }}
                      className={`w-full sm:w-auto py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                        selectedAssembly.some(b => b.id === modalOffer.offer.linkedSolutionBlockId || b.id === modalOffer.offer.id)
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-700 dark:text-emerald-300'
                          : 'bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border-slate-200 dark:border-white/15 text-slate-800 dark:text-white'
                      }`}
                    >
                      {selectedAssembly.some(b => b.id === modalOffer.offer.linkedSolutionBlockId || b.id === modalOffer.offer.id) ? (
                        <>
                          <Check size={14} className="text-emerald-500" />
                          <span>{lang === 'fr' ? 'Dans mon panier' : 'In My Bundle'}</span>
                        </>
                      ) : (
                        <>
                          <span>+ {lang === 'fr' ? 'Ajouter à mon projet' : 'Add to My Scope'}</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => setModalOffer(null)}
                    className="w-full sm:w-auto py-2.5 px-4 text-xs font-mono font-medium text-slate-500 hover:text-slate-800 dark:text-white/60 dark:hover:text-white transition-colors cursor-pointer text-center"
                  >
                    {lang === 'fr' ? 'Fermer' : 'Close'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
