import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, states, typography, useStyles, ThemeColors } from '../../theme';

export interface ButtonPrimaryProps {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
}

/** Primary CTA: `primary` fill, `on-primary` text, subtle inner glow for a tactile
 * raised look. Pressed/disabled states apply opacity per the states tokens. */
export function ButtonPrimary({ label, onPress, disabled }: ButtonPrimaryProps) {
  const styles = useStyles(makeStyles);
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
      <View pointerEvents="none" style={styles.innerGlow} />
      <Text style={[typography.labelLg, styles.label]}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    borderRadius: radius.DEFAULT,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
  },
  innerGlow: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.DEFAULT,
    borderWidth: 0.5,
    borderColor: colors.buttonGlow,
  },
  label: {
    color: colors.onPrimary,
  },
});
