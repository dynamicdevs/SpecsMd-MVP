import type { Cents } from '../domain';

/** Render integer cents as a `$X.XX` string (e.g. 2560 → `$25.60`). */
export function formatMoney(cents: Cents): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(cents);
  const dollars = Math.floor(abs / 100);
  const remainder = (abs % 100).toString().padStart(2, '0');
  return `${sign}$${dollars}.${remainder}`;
}
