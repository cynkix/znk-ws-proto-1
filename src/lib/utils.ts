import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Builds a `tel:` href in E.164 form from a display number.
 * Drops the national trunk prefix: '+33(0)1 45 26 19 15' → 'tel:+33145261915',
 * '+212 06 61 68 02 02' → 'tel:+212661680202'.
 */
export function toTelHref(displayPhone: string) {
  const withoutTrunk = displayPhone
    .replace(/\(0\)/g, '')
    .replace(/^(\+\d{1,3})\s+0/, '$1');
  return `tel:${withoutTrunk.replace(/[^0-9+]/g, '')}`;
}
