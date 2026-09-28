import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Navbar, Footer, ParallaxBackground, Version1Fluid } from './components/layout';
import { EcosystemLiveSection } from './components/sections';
import { HeroOpeningCover } from './components/hero';
import { ZenikaTrainingBotWidget } from './components/modals';
import { Language, SolutionBlock, OperatingModel } from './types';
import { ThemeProvider } from './context/ThemeContext';

// Code-splitting: Lazy load heavy 1300-line scoping modal
const AvantProjetWorkflowModal = lazy(() =>
  import('./components/modals/AvantProjetWorkflowModal').then((m) => ({ default: m.AvantProjetWorkflowModal }))
);

export function AppContent() {
  const [lang, setLang] = useState<Language>('fr');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBotWidgetOpen, setIsBotWidgetOpen] = useState(false);
  const [selectedAssembly, setSelectedAssembly] = useState<SolutionBlock[]>([]);
  const [selectedModel, setSelectedModel] = useState<OperatingModel | null>(null);

  // Synchronize document language with selected language (Accessibility / SEO)
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    // Ensure the page starts at the top so the cinematic intro is always visible
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      if (!window.location.hash) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      }
    }
  }, []);

  const handleOpenContactWithAssembly = (assembly?: SolutionBlock[]) => {
    setSelectedAssembly(assembly || []);
    setSelectedModel(null);
    setIsContactOpen(true);
  };

  const handleOpenContactWithModel = (model: OperatingModel) => {
    setSelectedModel(model);
    setSelectedAssembly([]);
    setIsContactOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07080B] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-[#E60039] selection:text-white transition-colors duration-200 relative">
      {/* Discreet Multi-Layer Parallax Background */}
      <ParallaxBackground />

      {/* Opening Full-Page Cinematic Hero with Zenika Logo */}
      <HeroOpeningCover
        lang={lang}
        onDiscover={() => {
          const target = document.getElementById('why') || document.getElementById('main-content');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Top Navbar */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        onOpenContact={() => handleOpenContactWithAssembly()}
      />

      {/* Main Content: Version 1 (Fluid Minimal Glass) */}
      <main id="main-content" className="flex-1">
        <Version1Fluid
          lang={lang}
          onOpenContact={handleOpenContactWithAssembly}
          onOpenContactModel={handleOpenContactWithModel}
          onOpenBot={() => setIsBotWidgetOpen(true)}
        />

        {/* Live Ecosystem Bar: Jobs, Training, Conferences/Meetups & Blog (before footer) */}
        <EcosystemLiveSection lang={lang} />
      </main>

      {/* Footer */}
      <Footer
        lang={lang}
        onOpenContact={() => handleOpenContactWithAssembly()}
      />

      {/* Floating Zenika Training Bot Widget (inspired by training.zenika.com) */}
      <ZenikaTrainingBotWidget
        lang={lang}
        isOpenExternal={isBotWidgetOpen}
        onCloseExternal={() => setIsBotWidgetOpen(false)}
      />

      {/* Interactive Project Inquiry & Scoping Modal (Code-split) */}
      {isContactOpen && (
        <Suspense fallback={null}>
          <AvantProjetWorkflowModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
            lang={lang}
            preSelectedBlocks={selectedAssembly}
            preSelectedModel={selectedModel}
          />
        </Suspense>
      )}
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
