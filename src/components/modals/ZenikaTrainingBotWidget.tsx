import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, ArrowRight, CheckCircle2, RotateCcw, MessageSquare, Sparkles, Building2, ExternalLink } from 'lucide-react';
import { Language } from '../../types';
import { ZenikaMonogram } from '../brand/ZenikaMonogram';
import { submitLead } from '../../services/leads';

interface ZenikaTrainingBotWidgetProps {
  lang: Language;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export const ZenikaTrainingBotWidget: React.FC<ZenikaTrainingBotWidgetProps> = ({
  lang,
  isOpenExternal,
  onCloseExternal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState<{
    objective?: string;
    model?: string;
    timeline?: string;
    contactName?: string;
    contactEmail?: string;
    contactCompany?: string;
  }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync external open trigger (e.g. from Contact section button)
  useEffect(() => {
    if (isOpenExternal !== undefined) {
      setIsOpen(isOpenExternal);
    }
  }, [isOpenExternal]);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step, isSubmitted, isOpen]);

  // Every close path must notify the parent, otherwise App keeps
  // isBotWidgetOpen=true and the next external "open" is a no-op.
  const close = () => {
    setIsOpen(false);
    onCloseExternal?.();
  };

  const handleToggle = () => {
    if (isOpen) close();
    else setIsOpen(true);
  };

  const handleChoice = (field: 'objective' | 'model' | 'timeline', value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    setStep(prev => prev + 1);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      await submitLead({
        source: 'floating-bot',
        lang,
        fullName: answers.contactName || '',
        email: answers.contactEmail || '',
        company: answers.contactCompany,
        objective: answers.objective,
        engagementModel: answers.model,
        timeline: answers.timeline,
      });
      setIsSubmitted(true);
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({});
    setIsSubmitted(false);
    setSubmitError(false);
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 select-none">
      
      {/* Floating Action Launcher Button */}
      <motion.button
        type="button"
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#E60039] hover:bg-[#CC0033] text-white shadow-2xl flex items-center justify-center cursor-pointer relative group focus:outline-none"
        aria-label={isOpen ? "Fermer l'assistant" : "Ouvrir l'assistant Zenika"}
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#07090F] animate-pulse" />
        {isOpen ? (
          <X size={24} className="transition-transform group-hover:rotate-90" />
        ) : (
          <div className="flex items-center justify-center">
            <Bot size={28} className="animate-pulse-subtle" />
          </div>
        )}
      </motion.button>

      {/* Interactive Chat Window Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 bottom-20 sm:bottom-24 sm:right-6 sm:left-auto sm:w-[420px] max-h-[82vh] h-[580px] bg-white dark:bg-[#0E1322] text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col z-50 text-left"
          >
            {/* Bot Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-slate-50 via-white to-red-50/20 dark:from-[#0E1322] dark:via-[#13192B] dark:to-[#1C0E16] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E60039] text-white flex items-center justify-center font-black shadow-md shrink-0">
                  <Bot size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white leading-none">
                      {lang === 'fr' ? 'Assistant Zenika' : 'Zenika Assistant'}
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-[10px] font-display text-slate-500 dark:text-white/60 block mt-0.5">
                    {lang === 'fr' ? 'Expérience interactive Zenika Training' : 'Interactive Zenika Training Bot'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  title={lang === 'fr' ? 'Recommencer' : 'Restart'}
                >
                  <RotateCcw size={15} />
                </button>
                <button
                  type="button"
                  onClick={handleToggle}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  title={lang === 'fr' ? 'Fermer' : 'Close'}
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Chat Body Messages */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {/* Message 1 : Welcome */}
              <div className="flex items-start gap-2.5 max-w-[90%]">
                <div className="w-7 h-7 rounded-full bg-[#E60039] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  Z
                </div>
                <div className="p-3.5 rounded-2xl rounded-tl-xs bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs">
                  {lang === 'fr'
                    ? 'Bonjour ! Je suis l’assistant virtuel de Zenika. Quel est votre enjeu prioritaire aujourd’hui ?'
                    : 'Hello! I am the Zenika virtual assistant. What is your priority goal today?'}
                </div>
              </div>

              {/* Step 1 Options */}
              {step === 1 && (
                <div className="pl-9 space-y-2">
                  {[
                    '🚀 Lancer un produit / projet critique',
                    '⚡ Renforcer nos équipes tech (Craft & DevSecOps)',
                    '🧠 Cadrage IA Native & Plateforme Data',
                    '🎓 Catalogue Formations (Zenika Training)',
                    '🔍 Audit d’architecture & Performance'
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChoice('objective', opt)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#151B2C] hover:bg-red-50/50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 font-semibold text-slate-800 dark:text-white transition-all text-left flex items-center justify-between group cursor-pointer hover:border-[#E60039]/40"
                    >
                      <span className="text-xs leading-snug">{opt}</span>
                      <ArrowRight size={13} className="text-slate-400 group-hover:text-[#E60039] group-hover:translate-x-0.5 transition-transform shrink-0 ml-1.5" />
                    </button>
                  ))}
                </div>
              )}

              {/* Answer 1 & Prompt 2 */}
              {step >= 2 && answers.objective && (
                <>
                  <div className="flex justify-end">
                    <div className="p-3 rounded-2xl rounded-tr-xs bg-[#E60039] text-white font-medium max-w-[85%] shadow-md">
                      {answers.objective}
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 max-w-[90%]">
                    <div className="w-7 h-7 rounded-full bg-[#E60039] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      Z
                    </div>
                    <div className="p-3.5 rounded-2xl rounded-tl-xs bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs">
                      {lang === 'fr'
                        ? 'Parfait. Sous quelle modalité d’intervention envisagez-vous cette collaboration ?'
                        : 'Great. Under what operating model would you envision working together?'}
                    </div>
                  </div>
                </>
              )}

              {/* Step 2 Options */}
              {step === 2 && (
                <div className="pl-9 space-y-2">
                  {[
                    '👥 Squads intégrées en immersion (Régie / Forfait)',
                    '⚡ Strike Team commando (Délivrance rapide en quelques semaines)',
                    '🧭 Direction technique déléguée & Conseil',
                    '📚 Formations certifiantes & Ateliers pratiques sur-mesure'
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChoice('model', opt)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#151B2C] hover:bg-red-50/50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 font-semibold text-slate-800 dark:text-white transition-all text-left flex items-center justify-between group cursor-pointer hover:border-[#E60039]/40"
                    >
                      <span className="text-xs leading-snug">{opt}</span>
                      <ArrowRight size={13} className="text-slate-400 group-hover:text-[#E60039] group-hover:translate-x-0.5 transition-transform shrink-0 ml-1.5" />
                    </button>
                  ))}
                </div>
              )}

              {/* Answer 2 & Prompt 3 */}
              {step >= 3 && answers.model && (
                <>
                  <div className="flex justify-end">
                    <div className="p-3 rounded-2xl rounded-tr-xs bg-[#E60039] text-white font-medium max-w-[85%] shadow-md">
                      {answers.model}
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 max-w-[90%]">
                    <div className="w-7 h-7 rounded-full bg-[#E60039] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      Z
                    </div>
                    <div className="p-3.5 rounded-2xl rounded-tl-xs bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs">
                      {lang === 'fr'
                        ? 'C’est noté. Quel est votre horizon de démarrage souhaité ?'
                        : 'Understood. What is your kickoff target timeline?'}
                    </div>
                  </div>
                </>
              )}

              {/* Step 3 Options */}
              {step === 3 && (
                <div className="pl-9 space-y-2">
                  {[
                    '⚡ Immédiat (Sous 2 à 4 semaines)',
                    '📅 Au cours de ce trimestre',
                    '🔍 Exploration & Cadrage budgétaire'
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChoice('timeline', opt)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#151B2C] hover:bg-red-50/50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 font-semibold text-slate-800 dark:text-white transition-all text-left flex items-center justify-between group cursor-pointer hover:border-[#E60039]/40"
                    >
                      <span className="text-xs leading-snug">{opt}</span>
                      <ArrowRight size={13} className="text-slate-400 group-hover:text-[#E60039] group-hover:translate-x-0.5 transition-transform shrink-0 ml-1.5" />
                    </button>
                  ))}
                </div>
              )}

              {/* Step 4: Final inputs in chat */}
              {step >= 4 && answers.timeline && !isSubmitted && (
                <>
                  <div className="flex justify-end">
                    <div className="p-3 rounded-2xl rounded-tr-xs bg-[#E60039] text-white font-medium max-w-[85%] shadow-md">
                      {answers.timeline}
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 max-w-[90%]">
                    <div className="w-7 h-7 rounded-full bg-[#E60039] text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      Z
                    </div>
                    <div className="p-3.5 rounded-2xl rounded-tl-xs bg-slate-100 dark:bg-white/[0.06] text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs">
                      {lang === 'fr'
                        ? 'Super ! À quelle adresse nos directeurs techniques peuvent-ils vous transmettre les premières recommandations ?'
                        : 'Great! Where should our engineering directors send initial proposals?'}
                    </div>
                  </div>

                  <form onSubmit={handleFinalSubmit} className="pl-9 space-y-2.5 pt-1">
                    <input
                      type="text"
                      required
                      placeholder={lang === 'fr' ? 'Votre nom complet' : 'Your name'}
                      value={answers.contactName || ''}
                      onChange={(e) => setAnswers({ ...answers, contactName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E60039]"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email professionnel"
                      value={answers.contactEmail || ''}
                      onChange={(e) => setAnswers({ ...answers, contactEmail: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E60039]"
                    />
                    <input
                      type="text"
                      required
                      placeholder={lang === 'fr' ? 'Entreprise / Organisation' : 'Company'}
                      value={answers.contactCompany || ''}
                      onChange={(e) => setAnswers({ ...answers, contactCompany: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#E60039]"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-xl bg-[#E60039] hover:bg-[#CC0033] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Send size={13} />
                      <span>{lang === 'fr' ? 'Transmettre mes réponses' : 'Submit answers'}</span>
                    </button>
                    {submitError && (
                      <p role="alert" className="text-xs font-semibold text-[#E60039]">
                        {lang === 'fr'
                          ? "L'envoi a échoué. Merci de réessayer ou de nous écrire directement."
                          : 'Sending failed. Please try again or email us directly.'}
                      </p>
                    )}
                  </form>
                </>
              )}

              {/* Final Success State */}
              {isSubmitted && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 mt-2">
                  <CheckCircle2 size={30} className="text-emerald-500 mx-auto" />
                  <h5 className="font-bold font-display text-slate-900 dark:text-white text-sm">
                    {lang === 'fr' ? 'Demande bien transmise !' : 'Inquiry registered!'}
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {lang === 'fr'
                      ? `Merci ${answers.contactName}. Un responsable technique Zenika vous recontactera sous 24h ouvrées.`
                      : `Thank you ${answers.contactName}. A Zenika leader will reach out within 24h.`}
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-2 text-xs font-bold text-[#E60039] hover:underline cursor-pointer"
                  >
                    {lang === 'fr' ? 'Recommencer une conversation' : 'Start a new conversation'}
                  </button>
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Chat Footer with link to classic form & Zenika Training */}
            <div className="p-3 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] font-display text-slate-500 dark:text-slate-400">
              <a
                href="#contact"
                onClick={close}
                className="hover:text-[#E60039] transition-colors"
              >
                {lang === 'fr' ? '→ Formulaire classique sur la page' : '→ Classic form on page'}
              </a>
              <a
                href="https://training.zenika.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#E60039] transition-colors inline-flex items-center gap-1"
              >
                <span>training.zenika.com</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZenikaTrainingBotWidget;
