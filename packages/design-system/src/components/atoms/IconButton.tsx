import React from 'react';
import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';
import { iconTokens, states, useThemeColors, useStyles, ThemeColors } from '../../theme';

export type IconButtonVariant = 'plain' | 'filled';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps {
  icon: LucideIcon;
  onPress?: () => void;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  active?: boolean;
  disabled?: boolean;
}

const sizeMap = {
  sm: iconTokens.sizeSm,
  md: iconTokens.sizeMd,
  lg: iconTokens.sizeLg,
} as const;

/** lucide-react-native icon at a fixed stroke weight, always with a 44x44
 * minimum hit area via hitSlop regardless of the visual icon size. */
export function IconButton({
  icon: Icon,
  onPress,
  variant = 'plain',
  size = 'md',
  active = false,
  disabled = false,
}: IconButtonProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const iconSize = sizeMap[size];
  const hitSlopValue = Math.max(0, (44 - iconSize) / 2);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlopValue}
      style={({ pressed }) => [
        styles.base,
        variant === 'filled' && styles.filled,
        disabled && { opacity: states.disabledOpacity },
        !disabled && pressed && { opacity: states.pressedOpacity },
      ]}
    >
      <Icon
        size={iconSize}
        strokeWidth={iconTokens.strokeWidth}
        color={active ? colors.primary : colors.onSurface}
      />
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 9999,
    width: 40,
    height: 40,
    elevation: 0,
  },
});
