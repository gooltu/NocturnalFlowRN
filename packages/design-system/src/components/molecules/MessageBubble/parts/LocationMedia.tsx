import React from 'react';
import { MapPin } from 'lucide-react-native';
import { Image, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../../../../theme';
import { LocationMessageContent } from '../types';

const DEFAULT_ASPECT = 4 / 3;

export interface LocationMediaProps {
  content: LocationMessageContent;
}

/** The map area of a location bubble: the supplied static-map image, or a
 * generic tinted placeholder tile when there isn't one yet (e.g. still
 * generating a real preview). */
export function LocationMedia({ content }: LocationMediaProps) {
  const colors = useThemeColors();

  if (content.mapImage) {
    return <Image source={content.mapImage} style={styles.image} resizeMode="cover" />;
  }

  return (
    <View style={[styles.placeholder, { backgroundColor: colors.surfaceContainerHigh }]}>
      <MapPin size={28} strokeWidth={2} color={colors.onSurfaceVariant} />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: DEFAULT_ASPECT,
  },
  placeholder: {
    width: '100%',
    aspectRatio: DEFAULT_ASPECT,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
