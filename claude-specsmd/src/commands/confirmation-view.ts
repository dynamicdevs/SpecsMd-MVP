import type { Confirmation, Order } from '../domain';
import { formatMoney } from './format';

/** Render a confirmation (plus its order) as a human-readable receipt. */
export function formatConfirmation(confirmation: Confirmation, order: Order): string {
  return [
    '=== Purchase Confirmed ===',
    `Confirmation ID : ${confirmation.confirmationId}`,
    `Movie           : ${confirmation.movieTitle}`,
    `Showtime        : ${order.showtime.startsAt} · ${order.showtime.format} · ${order.showtime.screen}`,
    `Seats           : ${confirmation.seatCodes.join(', ')}`,
    `Customer        : ${confirmation.customerName}`,
    `Subtotal        : ${formatMoney(order.subtotalCents)}`,
    `Discount        : ${formatMoney(order.discountCents)}`,
    `Total           : ${formatMoney(confirmation.totalCents)}`,
  ].join('\n');
}
