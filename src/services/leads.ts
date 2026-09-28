import { Language } from '../types';

/**
 * Lead capture — single integration point for every contact / scoping form.
 *
 * Callers:
 * - ContactSection            → source 'contact-section'
 * - AvantProjetWorkflowModal  → source 'scoping-modal-form' | 'scoping-modal-bot'
 * - ZenikaTrainingBotWidget   → source 'floating-bot'
 *
 * TODO(backend): replace the stub body of `submitLead` with a real call
 * (CRM, form service, internal API…). Contract expected by the UI:
 * - resolve  → the UI shows the success screen
 * - reject   → the UI shows an error message and lets the user retry
 * Validation, anti-spam (captcha / honeypot / rate limit) and GDPR consent
 * storage must be handled server-side.
 */

export type LeadSource =
  | 'contact-section'
  | 'scoping-modal-form'
  | 'scoping-modal-bot'
  | 'floating-bot';

export interface LeadPayload {
  source: LeadSource;
  lang: Language;

  // Contact details (fullName + email are always collected)
  fullName: string;
  email: string;
  company?: string;
  phone?: string;

  // Classic form fields
  needType?: string;
  agencyCity?: string;
  message?: string;

  // Bot qualification answers (free labels shown to the user)
  objective?: string;
  engagementModel?: string;
  timeline?: string;

  // Pre-selection coming from the offers / operating models sections
  selectedBlockIds?: string[];
  selectedModelId?: string;
}

const SIMULATED_LATENCY_MS = 700;

export async function submitLead(payload: LeadPayload): Promise<void> {
  // TODO(backend): replace this stub, e.g.
  //
  //   const res = await fetch(import.meta.env.VITE_LEADS_ENDPOINT, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload),
  //   });
  //   if (!res.ok) throw new Error(`Lead submission failed: ${res.status}`);
  //
  // Until then nothing leaves the browser: the payload is only logged.
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  console.info('[submitLead] STUB — lead not sent to any backend', payload);
}
