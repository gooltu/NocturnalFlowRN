import { TextStyle } from 'react-native';

/** Headlines use Plus Jakarta Sans; body/labels use Inter. Load both via
 * useFonts() before first render — see theme/useAppFonts.ts. */
export const fontFamilies = {
  jakartaBold: 'PlusJakartaSans_700Bold',
  jakartaSemiBold: 'PlusJakartaSans_600SemiBold',
  interRegular: 'Inter_400Regular',
  interMedium: 'Inter_500Medium',
  interSemiBold: 'Inter_600SemiBold',
} as const;

export type TypographyToken =
  | 'headlineLg'
  | 'headlineLgMobile'
  | 'headlineMd'
  | 'bodyLg'
  | 'bodyMd'
  | 'labelLg'
  | 'labelSm';

export const typography: Record<TypographyToken, TextStyle> = {
  headlineLg: {
    fontFamily: fontFamilies.jakartaBold,
    fontSize: 24,
    lineHeight: 32,
  },
  headlineLgMobile: {
    fontFamily: fontFamilies.jakartaBold,
    fontSize: 22,
    lineHeight: 28,
  },
  headlineMd: {
    fontFamily: fontFamilies.jakartaSemiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  bodyLg: {
    fontFamily: fontFamilies.interRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: fontFamilies.interRegular,
    fontSize: 14,
    lineHeight: 20,
  },
  labelLg: {
    fontFamily: fontFamilies.interSemiBold,
    fontSize: 13,
    lineHeight: 16,
    letterSpacing: 0.26,
  },
  labelSm: {
    fontFamily: fontFamilies.interMedium,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.55,
  },
};
