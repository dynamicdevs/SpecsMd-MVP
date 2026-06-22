import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { Purchase } from './loader.js';
import { Confirmation } from '../domain/types.js';

export interface StoredPurchase extends Purchase {
  confirmationId: string;
  customer: string;
  movieTitle: string;
  total: number;
  purchasedAt: string;
}

/**
 * Saves a purchase to purchases.json.
 * Creates the file if it doesn't exist.
 * Appends to existing purchases array.
 */
export function savePurchase(
  dataDir: string,
  confirmation: Confirmation
): void {
  const filePath = join(dataDir, 'purchases.json');
  let purchases: StoredPurchase[] = [];

  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf-8');
    purchases = JSON.parse(content);
  }

  const stored: StoredPurchase = {
    confirmationId: confirmation.confirmationId,
    customer: confirmation.customer,
    movieTitle: confirmation.movieTitle,
    showtimeId: '', // will be set below
    seats: confirmation.seats,
    total: confirmation.total,
    purchasedAt: new Date().toISOString(),
  };

  // We need the showtimeId for seat merging on reload
  // It's not directly on Confirmation, so we derive it from context
  // The caller should pass the showtimeId separately
  purchases.push(stored);
  writeFileSync(filePath, JSON.stringify(purchases, null, 2));
}

/**
 * Saves a purchase with explicit showtimeId for proper seat tracking.
 */
export function savePurchaseWithShowtime(
  dataDir: string,
  confirmation: Confirmation,
  showtimeId: string
): void {
  const filePath = join(dataDir, 'purchases.json');
  let purchases: StoredPurchase[] = [];

  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf-8');
    purchases = JSON.parse(content);
  }

  const stored: StoredPurchase = {
    confirmationId: confirmation.confirmationId,
    customer: confirmation.customer,
    movieTitle: confirmation.movieTitle,
    showtimeId,
    seats: confirmation.seats,
    total: confirmation.total,
    purchasedAt: new Date().toISOString(),
  };

  purchases.push(stored);
  writeFileSync(filePath, JSON.stringify(purchases, null, 2));
}
