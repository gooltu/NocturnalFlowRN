import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { colors, states } from '../../theme';

export interface ImageIconProps {
  source: ImageSourcePropType;
  size?: number;
  /** Sits the art on a rounded `surface-container` tile, per the design spec. */
  tile?: boolean;
  onPress?: () => void;
  /** Required when pressable, so the control is reachable by screen readers. */
  label?: string;
  disabled?: boolean;
}

/** Raster (PNG) counterpart to the lucide icon set, for full-colour game and
 * reward art — never for functional UI glyphs, since it cannot be re-tinted.
 * Art is drawn with `contain` so it keeps its aspect ratio at any size. */
export function ImageIcon({
  source,
  size = 40,
  tile = false,
  onPress,
  label,
  disabled = false,
}: ImageIconProps) {
  const box = tile ? { width: size, height: size, padding: size * 0.16 } : { width: size, height: size };
  const content = (
    <View style={[styles.base, box, tile && styles.tile, disabled && { opacity: states.disabledOpacity }]}>
      <Image source={source} style={styles.image} resizeMode="contain" />
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
  image: {
    width: '100%',
    height: '100%',
  },
});
