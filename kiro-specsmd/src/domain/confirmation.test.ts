import { describe, it, expect } from 'vitest';
import { generateConfirmation } from './confirmation.js';
import { PurchaseInput } from './types.js';

const basePurchase: PurchaseInput = {
  customer: 'Juan Pérez',
  showtimeId: 'st-001',
  movieTitle: 'Inception',
  showtimeDate: '2026-06-23',
  showtimeTime: '18:00',
  format: '3D',
  seats: ['A1', 'A2'],
  subtotal: 14000,
  discountApplied: true,
  discountAmount: 2800,
  total: 11200,
};

describe('generateConfirmation', () => {
  it('returns confirmation with all fields', () => {
    const result = generateConfirmation(basePurchase);
    expect(result.customer).toBe('Juan Pérez');
    expect(result.movieTitle).toBe('Inception');
    expect(result.showtimeDate).toBe('2026-06-23');
    expect(result.showtimeTime).toBe('18:00');
    expect(result.format).toBe('3D');
    expect(result.seats).toEqual(['A1', 'A2']);
    expect(result.subtotal).toBe(14000);
    expect(result.discountApplied).toBe(true);
    expect(result.discountAmount).toBe(2800);
    expect(result.total).toBe(11200);
    expect(result.confirmationId).toHaveLength(8);
  });

  it('produces deterministic confirmation ID', () => {
    const result1 = generateConfirmation(basePurchase);
    const result2 = generateConfirmation(basePurchase);
    expect(result1.confirmationId).toBe(result2.confirmationId);
  });

  it('same seats in different order produce same ID', () => {
    const purchase1 = { ...basePurchase, seats: ['A2', 'A1'] };
    const purchase2 = { ...basePurchase, seats: ['A1', 'A2'] };
    const result1 = generateConfirmation(purchase1);
    const result2 = generateConfirmation(purchase2);
    expect(result1.confirmationId).toBe(result2.confirmationId);
  });

  it('different inputs produce different IDs', () => {
    const otherPurchase = { ...basePurchase, customer: 'María López' };
    const result1 = generateConfirmation(basePurchase);
    const result2 = generateConfirmation(otherPurchase);
    expect(result1.confirmationId).not.toBe(result2.confirmationId);
  });

  it('sorts seats in output', () => {
    const purchase = { ...basePurchase, seats: ['B3', 'A1', 'A2'] };
    const result = generateConfirmation(purchase);
    expect(result.seats).toEqual(['A1', 'A2', 'B3']);
  });
});
