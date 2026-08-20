import { DimensionValue, ViewStyle } from 'react-native';
import { radius, ThemeColors } from '../../../theme';
import { MessageDirection } from './types';

/** Bubbles are capped rather than sized: the canvas bakes 260pt against a
 * 390pt frame, which is this proportion. */
export const BUBBLE_MAX_WIDTH: DimensionValue = '75%';

/** Media bubbles need a definite width for `aspectRatio` to resolve, so they
 * take the cap as their width instead of maxing out at it. */
export const MEDIA_BUBBLE_WIDTH: DimensionValue = '75%';

/** Scrims and media badges sit on `surface-container-lowest`; translucency
 * comes from opacity, never from an alpha hex. */
export const scrimColor = (colors: ThemeColors) => colors.surfaceContainerLowest;
export const SCRIM_OPACITY = 0.72;

/** Gap between tiles in a photo grid. */
export const GRID_GUTTER = 2;

/** Every colour decision that depends on which side of the thread a bubble is
 * on lives here, so content parts never branch on direction themselves. */
export interface BubbleSkin {
  /** Bubble background. */
  fill: string;
  /** Body copy. */
  text: string;
  /** Timestamp, and any secondary label inside the bubble. */
  meta: string;
  /** Quoted-reply box fill. `surface-container-high` would disappear into the
   * orange outgoing bubble, so outgoing quotes sit on `primary` instead. */
  quoteFill: string;
  /** 2px left rule on the quote block, and the quoted sender's name. */
  quoteAccent: string;
  /** Quoted snippet text. */
  quoteSnippet: string;
  /** Outgoing snippets recede by opacity rather than by changing colour. */
  quoteSnippetOpacity: number;
  /** Voice-note play control. */
  playFill: string;
  playGlyph: string;
  /** Waveform bars, and the quoted-voice mic tile. */
  wave: string;
  quoteTileFill: string;
  corners: ViewStyle;
}

const incoming = (colors: ThemeColors): BubbleSkin => ({
  fill: colors.surfaceContainer,
  text: colors.onSurface,
  meta: colors.onSurfaceVariant,
  quoteFill: colors.surfaceContainerHigh,
  quoteAccent: colors.primary,
  quoteSnippet: colors.onSurfaceVariant,
  quoteSnippetOpacity: 1,
  playFill: colors.primary,
  playGlyph: colors.onPrimary,
  wave: colors.onSurfaceVariant,
  quoteTileFill: colors.surfaceContainer,
  corners: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    borderBottomLeftRadius: radius.sm,
  },
});

const outgoing = (colors: ThemeColors): BubbleSkin => ({
  fill: colors.primaryContainer,
  text: colors.onPrimaryContainer,
  meta: colors.onPrimaryContainer,
  quoteFill: colors.primary,
  quoteAccent: colors.onPrimaryContainer,
  quoteSnippet: colors.onPrimaryContainer,
  quoteSnippetOpacity: 0.8,
  playFill: colors.onPrimaryContainer,
  playGlyph: colors.primaryContainer,
  wave: colors.onPrimaryContainer,
  quoteTileFill: colors.primaryContainer,
  corners: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.sm,
  },
});

export function bubbleSkin(colors: ThemeColors, direction: MessageDirection): BubbleSkin {
  return direction === 'outgoing' ? outgoing(colors) : incoming(colors);
}

/** Group sender names all use one accent — senders are told apart by the name
 * itself, which keeps `presence-online`, `read-receipt` and `warning` reserved
 * for the status meanings they carry elsewhere in the system. */
export const senderAccent = (colors: ThemeColors) => colors.primary;
