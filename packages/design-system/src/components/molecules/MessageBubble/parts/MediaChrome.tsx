import React from 'react';
import { Play } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { iconTokens, radius, spacing, typography, useThemeColors, useStyles, ThemeColors } from '../../../../theme';
import { SCRIM_OPACITY } from '../bubbleTheme';

const absoluteFill = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export interface MediaBadgeProps {
  label: string;
}

/** Small pill over media — the `GIF` marker and the video duration. Solid
 * `surface-container-lowest` so the label keeps full contrast. */
export function MediaBadge({ label }: MediaBadgeProps) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.badge}>
      <Text style={[typography.labelSm, styles.badgeLabel]}>{label}</Text>
    </View>
  );
}

/** Translucent plate over media, used behind the `+N` count and the play
 * control. Kept as its own layer so the content on top stays fully opaque. */
export function MediaScrim() {
  const styles = useStyles(makeStyles);
  return <View style={styles.scrim} pointerEvents="none" />;
}

/** Centred play halo for video thumbnails. */
export function PlayHalo() {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.haloWrap} pointerEvents="none">
      <View style={styles.halo} />
      <Play
        size={20}
        strokeWidth={iconTokens.strokeWidth}
        color={colors.onSurface}
        fill={colors.onSurface}
      />
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  badge: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeLabel: {
    color: colors.onSurface,
  },
  scrim: {
    ...absoluteFill,
    backgroundColor: colors.surfaceContainerLowest,
    opacity: SCRIM_OPACITY,
  },
  haloWrap: {
    ...absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerLowest,
    opacity: SCRIM_OPACITY,
  },
});
