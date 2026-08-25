import React from 'react';
import { Link2 } from 'lucide-react-native';
import { Image, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../../../../theme';
import { LinkMessageContent } from '../types';

const DEFAULT_ASPECT = 1.9;

export interface LinkMediaProps {
  content: LinkMessageContent;
}

/** The preview-image area of a link bubble: the unfurled `image`, or a
 * generic tinted placeholder tile when the target page had none (or it
 * hasn't unfurled yet). */
export function LinkMedia({ content }: LinkMediaProps) {
  const colors = useThemeColors();

  if (content.image) {
    return <Image source={content.image} style={styles.image} resizeMode="cover" />;
  }

  return (
    <View style={[styles.placeholder, { backgroundColor: colors.surfaceContainerHigh }]}>
      <Link2 size={28} strokeWidth={2} color={colors.onSurfaceVariant} />
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
