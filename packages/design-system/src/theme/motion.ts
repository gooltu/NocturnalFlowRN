import { Easing } from 'react-native-reanimated';

export const duration = {
  instant: 100,
  fast: 150,
  standard: 250,
  slow: 400,
} as const;

/** Bezier curves mirroring the design tokens for use with Reanimated's withTiming. */
export const easing = {
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),
  decelerate: Easing.bezier(0.0, 0.0, 0.2, 1),
  accelerate: Easing.bezier(0.4, 0.0, 1, 1),
} as const;
