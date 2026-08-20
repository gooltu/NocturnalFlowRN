import React from 'react';
import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { iconTokens, states, useThemeColors, useStyles, ThemeColors } from '../../theme';

export interface FloatingButtonProps {
  icon: LucideIcon;
  onPress?: () => void;
  /** Required — a FAB carries no visible text, so this is its only accessible label. */
  label: string;
  size?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

/** Circular floating action button: `primary` fill with the same inner-glow
 * treatment as `ButtonPrimary` for a raised look via tonal layering rather
 * than a native shadow. Positioning is the screen's responsibility — this
 * component renders in place, so pass `style` (e.g. `position: 'absolute'`,
 * inset above a floating NavigationBar) from the consumer. */
export function FloatingButton({
  icon: Icon,
  onPress,
  label,
  size = 56,
  disabled = false,
  style,
}: FloatingButtonProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const iconSize = size >= 56 ? iconTokens.sizeLg : iconTokens.sizeMd;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        { width: size, height: size, borderRadius: size / 2 },
        disabled && { opacity: states.disabledOpacity },
        !disabled && pressed && { opacity: states.pressedOpacity, transform: [{ scale: states.pressedScale }] },
        style,
      ]}
    >
      <View pointerEvents="none" style={[styles.innerGlow, { borderRadius: size / 2 }]} />
      <Icon size={iconSize} strokeWidth={iconTokens.strokeWidth} color={colors.onPrimary} />
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
  },
  innerGlow: {
    ...StyleSheet.absoluteFill,
    borderWidth: 0.5,
    borderColor: colors.buttonGlow,
  },
});
