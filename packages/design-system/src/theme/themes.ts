import { colors as darkColors } from './colors';

/** The full set of color tokens. Every theme must define the same keys so
 * components can reference any token and stay theme-agnostic. */
export type ThemeColors = { [K in keyof typeof darkColors]: string };

/** Nocturnal Flow — dark theme (the original, default palette). */
export const dark: ThemeColors = darkColors;

/** Light counterpart. Same token contract as `dark`, tuned for a light surface
 * so components swap over without any per-component changes. */
export const light: ThemeColors = {
  surface: '#faf9f7',
  surfaceDim: '#e3e2df',
  surfaceBright: '#faf9f7',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f4f2ef',
  surfaceContainer: '#eeece9',
  surfaceContainerHigh: '#e8e6e3',
  surfaceContainerHighest: '#e2e0dd',
  onSurface: '#1b1c1c',
  onSurfaceVariant: '#4b453f',
  inverseSurface: '#303131',
  inverseOnSurface: '#f1f0ee',
  outline: '#7c766f',
  outlineVariant: '#cdc6bd',
  surfaceTint: '#8d4f11',
  primary: '#8d4f11',
  onPrimary: '#ffffff',
  primaryContainer: '#ffdcc3',
  onPrimaryContainer: '#2f1500',
  inversePrimary: '#ffb77d',
  secondary: '#5f5e5d',
  onSecondary: '#ffffff',
  secondaryContainer: '#e4e2e1',
  onSecondaryContainer: '#1b1c1c',
  tertiary: '#5e5d5c',
  onTertiary: '#ffffff',
  tertiaryContainer: '#e5e2e1',
  onTertiaryContainer: '#1c1b1b',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#410002',
  primaryFixed: '#ffdcc3',
  primaryFixedDim: '#ffb77d',
  onPrimaryFixed: '#2f1500',
  onPrimaryFixedVariant: '#6e3900',
  secondaryFixed: '#e4e2e1',
  secondaryFixedDim: '#c8c6c6',
  onSecondaryFixed: '#1b1c1c',
  onSecondaryFixedVariant: '#474747',
  tertiaryFixed: '#e5e2e1',
  tertiaryFixedDim: '#c8c6c5',
  onTertiaryFixed: '#1c1b1b',
  onTertiaryFixedVariant: '#474746',
  background: '#faf9f7',
  onBackground: '#1b1c1c',
  surfaceVariant: '#e2e0dd',
  success: '#2e7d32',
  onSuccess: '#ffffff',
  warning: '#8a6100',
  onWarning: '#ffffff',
  presenceOnline: '#2e7d32',
  presenceOffline: '#9a9a9a',
  readReceipt: '#0165faff',
  buttonGlow: '#ffffff0d',
  backdrop: '#00000080',
  headerScrim: '#faf9f7d9',
  navBar: '#e8e6e3cc',
  navActive: '#8d4f1129',
};

/** Registry of all available themes, keyed by name. */
export const themes = { dark, light } as const;

export type ThemeName = keyof typeof themes;
