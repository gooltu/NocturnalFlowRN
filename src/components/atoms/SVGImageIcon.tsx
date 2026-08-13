import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, states } from '../../theme';
import Coin from './jsx_svg_icons/Coin';
import Diamond from './jsx_svg_icons/Diamond';
import J3 from './jsx_svg_icons/J3';
import J4 from './jsx_svg_icons/J4';
import J5 from './jsx_svg_icons/J5';
import J6 from './jsx_svg_icons/J6';
import J7 from './jsx_svg_icons/J7';
import J8 from './jsx_svg_icons/J8';
import J9 from './jsx_svg_icons/J9';
import J10 from './jsx_svg_icons/J10';
import J11 from './jsx_svg_icons/J11';
import J12 from './jsx_svg_icons/J12';
import J13 from './jsx_svg_icons/J13';
import J14 from './jsx_svg_icons/J14';
import J15 from './jsx_svg_icons/J15';
import J16 from './jsx_svg_icons/J16';
import J17 from './jsx_svg_icons/J17';
import Logo from './jsx_svg_icons/Logo';
import XP from './jsx_svg_icons/XP';

export const svgIcons = {
  coin: Coin,
  diamond: Diamond,
  j3: J3,
  j4: J4,
  j5: J5,
  j6: J6,
  j7: J7,
  j8: J8,
  j9: J9,
  j10: J10,
  j11: J11,
  j12: J12,
  j13: J13,
  j14: J14,
  j15: J15,
  j16: J16,
  j17: J17,
  logo: Logo,
  xp: XP,
} as const;

export type SVGIconName = keyof typeof svgIcons;

export interface SVGImageIconProps {
  icon: SVGIconName;
  size?: number;
  /** Sits the art on a rounded `surface-container` tile, per the design spec. */
  tile?: boolean;
  onPress?: () => void;
  /** Required when pressable, so the control is reachable by screen readers. */
  label?: string;
  disabled?: boolean;
}

/** Vector counterpart to `ImageIcon`, for full-colour game and reward art
 * shipped as `react-native-svg` components instead of raster assets. Scales
 * to any size without quality loss — never for functional UI glyphs, use
 * the lucide icon set for those. */
export function SVGImageIcon({
  icon,
  size = 40,
  tile = false,
  onPress,
  label,
  disabled = false,
}: SVGImageIconProps) {
  const Icon = svgIcons[icon];
  const box = tile ? { width: size, height: size, padding: size * 0.16 } : { width: size, height: size };
  const content = (
    <View style={[styles.base, box, tile && styles.tile, disabled && { opacity: states.disabledOpacity }]}>
      <Icon width="100%" height="100%" />
    </View>
  );

  if (!onPress) return content;

  const hitSlopValue = Math.max(0, (44 - size) / 2);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlopValue}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => (!disabled && pressed ? { opacity: states.pressedOpacity } : null)}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: 16,
    elevation: 0,
  },
});
