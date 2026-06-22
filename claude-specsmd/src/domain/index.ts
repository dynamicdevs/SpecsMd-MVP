/**
 * Public API of the pure ticketing domain.
 *
 * The command layer imports from here only; it must not reach into individual
 * domain modules' internals. Nothing in this folder performs I/O or imports a
 * framework.
 */
export * from './types';
export * from './errors';
export * from './pricing';
export * from './discount';
export * from './seats';
export * from './confirmation';
