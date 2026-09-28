import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  ExternalLink, 
  MapPin, 
  ArrowRight, 
  Sparkles,
  Video,
  Play,
  Users,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { Language } from '../../types';

interface EcosystemLiveSectionProps {
  lang: Language;
}

interface JobOffer {
  id: string;
  title: string;
  location: string;
  contract: string;
  tags: string[];
  url: string;
}

interface TrainingCourse {
  id: string;
  title: string;
  nextDate: string;
  duration: string;
  format: string;
  badge: string;
  url: string;
}

interface ZenikaEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  description: string;
  url: string;
  badge: string;
}

export const EcosystemLiveSection: React.FC<EcosystemLiveSectionProps> = ({ lang }) => {
  // Video IDs from the user request
  const EVENT_VIDEO_ID = '18x7M4ZbN8E';
  const TRAINING_VIDEO_ID = '4w_jRfk70rg';
  const JOBS_VIDEO_ID = 'SWHK2MkU_xE';

  // 3 Recrutements (jobs.zenika.com)
  const jobOffers: JobOffer[] = [
    {
      id: 'job-1',
      title: lang === 'fr' 
        ? 'Lead Développeur·se Craft & Fullstack (Java / React)' 
        : 'Lead Software Craft & Fullstack Developer (Java / React)',
      location: 'Paris, Lyon, Nantes · Hybride',
      contract: 'CDI',
      tags: ['Java 21', 'React', 'TDD', 'Clean Architecture'],
      url: 'https://jobs.zenika.com',
    },
    {
      id: 'job-2',
      title: lang === 'fr' 
        ? 'Consultant·e Cloud, DevOps & Platform Engineering' 
        : 'Cloud, DevOps & Platform Engineering Consultant',
      location: 'Lille, Rennes, Bordeaux · Hybride',
      contract: 'CDI',
      tags: ['Kubernetes', 'Terraform', 'AWS/GCP', 'GitOps'],
      url: 'https://jobs.zenika.com',
    },
    {
      id: 'job-3',
      title: lang === 'fr' 
        ? 'Consultant·e / Tech Lead IA Générative & Data' 
        : 'Tech Lead / Consultant GenAI & Data Systems',
      location: 'Paris, Toulouse, Casablanca · Hybride',
      contract: 'CDI',
      tags: ['Python', 'LLMs', 'RAG / LangChain', 'SecNumCloud'],
      url: 'https://jobs.zenika.com',
    },
  ];

  // 3 Formations (training.zenika.com)
  const upcomingTrainings: TrainingCourse[] = [
    {
      id: 'train-1',
      title: lang === 'fr' 
        ? 'Kubernetes : Déploiement et Administration de Clusters' 
        : 'Kubernetes: Deployment & Cluster Administration',
      nextDate: lang === 'fr' ? '24 - 26 Mars 2026' : 'March 24 - 26, 2026',
      duration: '3 jours (21h)',
      format: lang === 'fr' ? 'Distanciel & Présentiel' : 'Remote & In-person',
      badge: 'Qualiopi · Certifiant',
      url: 'https://training.zenika.com/fr',
    },
    {
      id: 'train-2',
      title: lang === 'fr' 
        ? 'IA Générative & LLMs : De la Conception au Déploiement' 
        : 'Generative AI & LLMs: From Engineering to Production',
      nextDate: lang === 'fr' ? '07 - 09 Avril 2026' : 'April 07 - 09, 2026',
      duration: '3 jours (21h)',
      format: lang === 'fr' ? 'Distanciel Interactif' : 'Interactive Remote',
      badge: 'Nouveau · Lab Pratique',
      url: 'https://training.zenika.com/fr',
    },
    {
      id: 'train-3',
      title: lang === 'fr' 
        ? 'Software Craftsmanship, TDD & Clean Code' 
        : 'Software Craftsmanship, TDD & Clean Code',
      nextDate: lang === 'fr' ? '14 - 16 Avril 2026' : 'April 14 - 16, 2026',
      duration: '3 jours (21h)',
      format: lang === 'fr' ? 'Distanciel ou Agences' : 'Remote or Agency',
      badge: 'Signature Zenika',
      url: 'https://training.zenika.com/fr',
    },
  ];

  // Événements & Conférences (Agile en Seine, Meetups Zenika)
  const upcomingEvents: ZenikaEvent[] = [
    {
      id: 'event-1',
      title: 'Agile en Seine 2026',
      type: lang === 'fr' ? 'Grande Conférence Annuelle' : 'Major Annual Conference',
      date: lang === 'fr' ? 'Octobre 2026' : 'October 2026',
      location: 'Paris & Streaming Live',
      description: lang === 'fr' 
        ? 'Le rendez-vous incontournable de l’Agilité, du Lean et de l’IA. Zenika y intervient comme sponsor historique et conférencier.' 
        : 'The flagship conference for Agile, Lean, and AI. Zenika joins as long-time sponsor and keynote speaker.',
      url: 'https://www.agileenseine.com',
      badge: 'Conférence Phare',
    },
    {
      id: 'event-2',
      title: 'Zenika Night Club · Meetup Tech & Craft',
      type: lang === 'fr' ? 'Meetup Mensuel Communautaire' : 'Monthly Community Meetup',
      date: lang === 'fr' ? 'Chaque 3ème mardi du mois' : 'Every 3rd Tuesday',
      location: 'Agences Zenika & Visio',
      description: lang === 'fr' 
        ? 'Tech talks, retours d’expérience sans langue de bois et démonstrations live autour du Cloud-Native, Rust, IA et Architecture.' 
        : 'Hands-on tech talks, architecture deep-dives and live coding sessions on Cloud-Native, Rust, AI and Craftsmanship.',
      url: 'https://www.meetup.com/pro/zenika',
      badge: 'Meetup Zenika',
    },
    {
      id: 'event-3',
      title: 'Rex & Conférences Tech (Devoxx, MiXiT)',
      type: lang === 'fr' ? 'Talks & Partages d’Expérience' : 'Talks & Engineering Shares',
      date: lang === 'fr' ? 'Toute l’année' : 'Year-round',
      location: 'France & Europe',
      description: lang === 'fr'
        ? 'Nos architectes et consultants prennent la parole dans les plus grands rassemblements techniques pour partager nos pratiques concrètes.'
        : 'Our consultants speak at top European conferences sharing open-source code and real-world architectures.',
      url: 'https://blog.zenika.com',
      badge: 'Partage Craft',
    }
  ];

  return (
    <section 
      id="ecosystem-live"
      className="py-12 sm:py-20 border-t border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-[#07090E] transition-colors duration-200 overflow-hidden"
    >
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* ================================================================= */}
        {/* 1. SECTION EVENT (Conférences, Agile en Seine, Meetups)           */}
        {/* ================================================================= */}
        <div id="section-event" className="space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Calendar size={13} />
                <span>{lang === 'fr' ? 'Section Event · Conférences & Communauté' : 'Event Section · Conferences & Community'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Événements, Conférences & Meetups' : 'Events, Conferences & Meetups'}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-slate-600 dark:text-white/60 max-w-2xl leading-relaxed">
                {lang === 'fr' 
                  ? 'Découvrez nos prises de parole en direct, la grande conférence Agile en Seine et nos meetups réguliers.' 
                  : 'Discover live talks, the Agile en Seine conference, and regular Zenika meetups.'}
              </p>
            </div>

            <a
              href="https://www.agileenseine.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:border-purple-500 text-xs font-bold font-mono text-slate-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 shadow-xs transition-all shrink-0 group"
            >
              <span>{lang === 'fr' ? 'Agile en Seine' : 'Agile en Seine'}</span>
              <ExternalLink size={13} className="text-slate-400 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Body: Left Video (video event) + Right Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Video Player */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black shadow-lg">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${EVENT_VIDEO_ID}`}
                  title="Zenika Event Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-800 dark:text-white/90">
                <div className="flex items-center gap-2">
                  <Video size={14} className="text-purple-500 dark:text-purple-400" />
                  <span className="font-semibold">{lang === 'fr' ? 'Vidéo événement Zenika' : 'Zenika event video'}</span>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${EVENT_VIDEO_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 hover:underline inline-flex items-center gap-1 font-bold"
                >
                  <span>YouTube</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Right: Event Cards (Hidden on mobile) */}
            <div className="lg:col-span-7 hidden lg:grid grid-cols-1 sm:grid-cols-3 gap-4">
              {upcomingEvents.map((evt) => (
                <a
                  key={evt.id}
                  href={evt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200/90 dark:border-white/10 hover:border-purple-500/80 p-5 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        {evt.badge}
                      </span>
                      <ExternalLink size={13} className="text-slate-400 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug mb-2 font-display">
                      {evt.title}
                    </h4>

                    <div className="text-[11px] font-mono text-slate-500 dark:text-white/70 mb-2 space-y-0.5">
                      <div className="font-semibold text-slate-800 dark:text-white/90">{evt.date}</div>
                      <div className="text-slate-500 dark:text-white/50">{evt.location}</div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-white/65 leading-relaxed line-clamp-3">
                      {evt.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/10 text-[11px] font-mono text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 font-semibold flex items-center justify-between">
                    <span>{lang === 'fr' ? 'En savoir plus' : 'Learn more'}</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* ================================================================= */}
        {/* 2. SECTION TRAINING (training.zenika.com)                         */}
        {/* ================================================================= */}
        <div id="section-training" className="space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
                <GraduationCap size={13} />
                <span>{lang === 'fr' ? 'Section Training · Formations & Certifications' : 'Training Section · Courses & Certifications'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Zenika Training & Sessions à venir' : 'Zenika Training & Upcoming Sessions'}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-slate-600 dark:text-white/60">
                {lang === 'fr' 
                  ? 'Plus de 100 modules dispensés par des artisans praticiens, certifiés Qualiopi.' 
                  : 'Over 100 course modules delivered by active practitioners, Qualiopi certified.'}
              </p>
            </div>

            <a
              href="https://training.zenika.com/fr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:border-blue-500 text-xs font-bold font-mono text-slate-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 shadow-xs transition-all shrink-0 group"
            >
              <span>{lang === 'fr' ? 'Catalogue 100+ formations' : 'Catalog 100+ courses'}</span>
              <ExternalLink size={13} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Body: Left Video (video training) + Right Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Video Player */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black shadow-lg">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${TRAINING_VIDEO_ID}`}
                  title="Zenika Training Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-700 dark:text-white/80">
                  <Video size={14} className="text-blue-500" />
                  <span className="font-semibold">{lang === 'fr' ? 'Vidéo formations Zenika' : 'Zenika training video'}</span>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${TRAINING_VIDEO_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-bold"
                >
                  <span>YouTube</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Right: Training Cards (Hidden on mobile) */}
            <div className="lg:col-span-7 hidden lg:grid grid-cols-1 sm:grid-cols-3 gap-4">
              {upcomingTrainings.map((train) => (
                <a
                  key={train.id}
                  href={train.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200/90 dark:border-white/10 hover:border-blue-500/80 p-5 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all group cursor-pointer"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        {train.badge}
                      </span>
                      <ExternalLink size={13} className="text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-3 font-display">
                      {train.title}
                    </h4>

                    <div className="space-y-1.5 text-[11px] font-mono mb-3">
                      <div className="flex items-center gap-1.5 text-[#E60039] font-semibold">
                        <Calendar size={12} />
                        <span>{train.nextDate}</span>
                      </div>
                      <div className="text-slate-500 dark:text-white/60">
                        {train.duration} · {train.format}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/[0.06] text-[11px] font-mono text-blue-600 dark:text-blue-400 font-semibold flex items-center justify-between">
                    <span>{lang === 'fr' ? 'Réserver une session' : 'Book course'}</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. SECTION CORP / JOBS (jobs.zenika.com)                          */}
        {/* ================================================================= */}
        <div id="section-corp" className="space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E60039]/10 text-[#E60039] text-xs font-mono font-bold uppercase tracking-wider">
                <Briefcase size={13} />
                <span>{lang === 'fr' ? 'Section Corp · Recrutement & Carrières' : 'Corp Section · Careers & Recruitment'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-slate-900 dark:text-white">
                {lang === 'fr' ? 'Zenika Jobs & Recrutement' : 'Zenika Jobs & Careers'}
              </h3>
              <p className="text-xs sm:text-sm font-mono text-slate-600 dark:text-white/60">
                {lang === 'fr' 
                  ? 'Rejoignez une communauté de plus de 550 artisans développeurs, architectes et coachs.' 
                  : 'Join an active community of 550+ developers, architects, and agile coaches.'}
              </p>
            </div>

            <a
              href="https://jobs.zenika.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:border-[#E60039] text-xs font-bold font-mono text-slate-800 dark:text-white hover:text-[#E60039] shadow-xs transition-all shrink-0 group"
            >
              <span>{lang === 'fr' ? 'Voir les 50+ postes (jobs.zenika.com)' : 'View all 50+ jobs (jobs.zenika.com)'}</span>
              <ExternalLink size={13} className="text-slate-400 group-hover:text-[#E60039] group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

          {/* Body: Left Video (video corp) + Right Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Video Player */}
            <div className="lg:col-span-5 space-y-3">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-black shadow-lg">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${JOBS_VIDEO_ID}`}
                  title="Zenika Corp / Jobs Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-700 dark:text-white/80">
                  <Video size={14} className="text-[#E60039]" />
                  <span className="font-semibold">{lang === 'fr' ? 'Vidéo corporate & culture Zenika' : 'Zenika corporate & culture video'}</span>
                </div>
                <a
                  href={`https://www.youtube.com/watch?v=${JOBS_VIDEO_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E60039] hover:underline inline-flex items-center gap-1 font-bold"
                >
                  <span>YouTube</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            {/* Right: Job Cards (Hidden on mobile) */}
            <div className="lg:col-span-7 hidden lg:grid grid-cols-1 sm:grid-cols-3 gap-4">
              {jobOffers.map((job) => (
                <a
                  key={job.id}
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl bg-white dark:bg-[#0E131F] border border-slate-200/90 dark:border-white/10 hover:border-[#E60039]/80 p-5 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-0.5 transition-all group cursor-pointer"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {job.contract} · {lang === 'fr' ? 'Recrutement' : 'Hiring'}
                      </span>
                      <ExternalLink size={13} className="text-slate-400 group-hover:text-[#E60039] group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#E60039] transition-colors leading-snug mb-2 font-display">
                      {job.title}
                    </h4>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-white/60 mb-3">
                      <MapPin size={12} className="text-[#E60039] shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-white/[0.05] text-slate-600 dark:text-white/70 border border-slate-200/60 dark:border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/[0.06] text-[11px] font-mono text-[#E60039] font-semibold flex items-center justify-between">
                    <span>{lang === 'fr' ? 'Postuler en ligne' : 'Apply now'}</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>

          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. SECTION BLOG (blog.zenika.com)                                 */}
        {/* ================================================================= */}
        <div id="section-blog" className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white text-xs font-mono font-bold uppercase tracking-wider">
            <BookOpen size={13} className="text-[#E60039]" />
            <span>{lang === 'fr' ? 'Section Blog · Publications & Retours d’Expérience' : 'Blog Section · Publications & Field Insights'}</span>
          </div>

          <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-[#141A24] to-[#2B0A14] p-8 sm:p-10 lg:p-12 text-white border border-slate-800 dark:border-white/15 shadow-2xl relative overflow-hidden">
            {/* Watermark logo */}
            <div className="absolute -right-8 -bottom-8 text-9xl sm:text-[180px] font-mono font-black text-white/[0.03] select-none pointer-events-none">
              &lt;blog/&gt;
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FF4D6D]">
                  <BookOpen size={14} />
                  <span>blog.zenika.com · {lang === 'fr' ? 'Publications & Retours d’Expérience' : 'Engineering Insights & Tutorials'}</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display tracking-tight text-white">
                  {lang === 'fr' 
                    ? 'Le Blog Technique : Décryptages, Architectures & Craft' 
                    : 'The Technical Blog: Architecture Breakdowns & Craftsmanship'}
                </h3>
                
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
                  {lang === 'fr'
                    ? 'Plus de 1 000 articles rédigés par les consultants et architectes Zenika : Intelligence Artificielle générative, Cloud-Native, Kubernetes, Rust, DDD, Green IT et Agilité d’organisation.'
                    : 'Over 1,000 articles written by Zenika engineers: Generative AI, Cloud-Native, Kubernetes, Rust, Domain-Driven Design, Green IT, and Agile leadership.'}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-4">
                <a
                  href="https://blog.zenika.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#E60039] hover:bg-[#CC0033] text-white font-bold text-xs sm:text-sm font-mono uppercase tracking-wider shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all"
                >
                  <span>{lang === 'fr' ? 'Découvrir tous les articles' : 'Read all articles'}</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
