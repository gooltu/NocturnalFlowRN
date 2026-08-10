import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, states, typography } from '../../theme';

export interface ButtonGhostProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

/** Ghost button: 1px `primary` border, `primary` text, transparent fill. */
export function ButtonGhost({ label, onPress, disabled }: ButtonGhostProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [
        styles.base,
        disabled && { opacity: states.disabledOpacity },
        !disabled && pressed && { opacity: states.pressedOpacity },
      ]}
    >
      <Text style={[typography.labelLg, styles.label]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.DEFAULT,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.primary,
  },
});
