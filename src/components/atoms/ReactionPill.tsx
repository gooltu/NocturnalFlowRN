import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, states, typography } from '../../theme';

export interface ReactionPillProps {
  emoji: string;
  count: number;
  active?: boolean;
  onPress?: () => void;
}

/** Small rounded-full chip anchored to a bubble's bottom edge. */
export function ReactionPill({ emoji, count, active, onPress }: ReactionPillProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
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

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    gap: 4,
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
