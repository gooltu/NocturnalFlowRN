import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { radius, spacing, states, typography, useStyles, ThemeColors } from '../../theme';

export interface ReactionPillProps {
  emoji: string;
  count: number;
  active?: boolean;
  onPress?: () => void;
}

/** Small rounded-full chip anchored to a bubble's bottom edge. */
export function ReactionPill({ emoji, count, active, onPress }: ReactionPillProps) {
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => [
        styles.base,
        active && styles.active,
        pressed && { opacity: states.pressedOpacity },
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[typography.labelSm, styles.count]}>{count}</Text>
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    gap: spacing.xs,
  },
  active: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: 12,
  },
  count: {
    color: colors.onSurfaceVariant,
  },
});
