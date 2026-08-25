import React from 'react';
import { AlertTriangle } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { iconTokens, spacing, states, typography, useThemeColors, useStyles, ThemeColors } from '../../../../theme';
import { scrimColor, SCRIM_OPACITY } from '../bubbleTheme';
import { AttachmentStatus } from '../types';

export interface AttachmentScrimProps {
  status: AttachmentStatus;
  downloadingLabel: string;
  failedLabel: string;
  /** Only wired up for `'failed'` — a downloading transfer has nothing to
   * retry yet. */
  onRetry?: () => void;
}

/** Full-bleed status treatment over media-style attachments (location map,
 * link preview image): a scrim plus a centered spinner or failure glyph and
 * label. The parent only renders this while `status` is set — there's no
 * "ready" case here, that's just the plain media underneath. */
export function AttachmentScrim({ status, downloadingLabel, failedLabel, onRetry }: AttachmentScrimProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const canRetry = status === 'failed' && !!onRetry;

  const body = (
    <>
      <View style={styles.scrim} />
      <View style={styles.content} pointerEvents="none">
        {status === 'downloading' ? (
          <>
            <ActivityIndicator color={colors.onSurface} />
            <Text style={[typography.labelSm, styles.label]}>{downloadingLabel}</Text>
          </>
        ) : (
          <>
            <AlertTriangle size={iconTokens.sizeLg} strokeWidth={iconTokens.strokeWidth} color={colors.error} />
            <Text style={[typography.labelSm, styles.label]}>{failedLabel}</Text>
          </>
        )}
      </View>
    </>
  );

  if (canRetry) {
    return (
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel={`${failedLabel}. Tap to retry.`}
        style={({ pressed }) => [styles.wrap, pressed && { opacity: states.pressedOpacity }]}
      >
        {body}
      </Pressable>
    );
  }

  return (
    <View style={styles.wrap} pointerEvents="none">
      {body}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: scrimColor(colors),
    opacity: SCRIM_OPACITY,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  label: {
    color: colors.onSurface,
  },
});
