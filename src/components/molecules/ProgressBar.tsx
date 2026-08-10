import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export interface ProgressBarProps {
  /** 0–1 fraction; clamped to that range. */
  progress: number;
  label?: string;
  value?: string;
}

/** Track + indicator, with an optional label/value row above it (e.g. an
 * upload's name and percentage). Also embedded bare (no label/value) inside
 * GameHeader's gamebar. */
export function ProgressBar({ progress, label, value }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));

  return (
    <View style={styles.base}>
      {(label || value) && (
        <View style={styles.meta}>
          {label && (
            <Text style={[typography.labelLg, styles.label]} numberOfLines={1}>
              {label}
            </Text>
          )}
          {value && (
            <Text style={[typography.labelSm, styles.value]} numberOfLines={1}>
              {value}
            </Text>
          )}
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.indicator, { width: `${clamped * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    gap: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  label: {
    color: colors.onSurface,
    flexShrink: 1,
  },
  value: {
    color: colors.onSurfaceVariant,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
    width: '100%',
  },
  indicator: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
