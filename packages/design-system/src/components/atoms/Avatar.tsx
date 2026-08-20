import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { typography, useThemeColors, useStyles, ThemeColors } from '../../theme';

export type PresenceState = 'online' | 'offline' | 'none';

export interface AvatarProps {
  source?: ImageSourcePropType;
  initials?: string;
  size?: number;
  presence?: PresenceState;
}

/** Circular avatar with an optional presence dot, bottom-right, per design spec:
 * 8px dot with a 1.5px surface border so it reads against any avatar image. */
export function Avatar({ source, initials, size = 48, presence = 'none' }: AvatarProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const dotSize = Math.round(size / 6);
  return (
    <View style={{ width: size, height: size }}>
      {source ? (
        <Image
          source={source}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[typography.labelLg, styles.initials]}>{initials}</Text>
        </View>
      )}
      {presence !== 'none' && (
        <View
          style={[
            styles.presenceDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor:
                presence === 'online' ? colors.presenceOnline : colors.presenceOffline,
              borderWidth: 1.5,
              borderColor: colors.surface,
            },
          ]}
        />
      )}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  fallback: {
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: colors.onPrimaryContainer,
  },
  presenceDot: {
    position: 'absolute',
    right: -1,
    bottom: -1,
  },
});
