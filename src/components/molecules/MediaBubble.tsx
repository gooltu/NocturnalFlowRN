import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export interface MediaBubbleProps {
  source: ImageSourcePropType;
  caption?: string;
  timestamp: string;
  variant?: 'incoming' | 'outgoing';
}

/** Image fills the bubble shape; an optional caption sits below on a
 * `surface-container` footer strip, matching the parent bubble's rounding. */
export function MediaBubble({ source, caption, timestamp, variant = 'incoming' }: MediaBubbleProps) {
  const isOutgoing = variant === 'outgoing';

  return (
    <View style={[styles.wrap, isOutgoing && styles.wrapOutgoing]}>
      <View
        style={[
          styles.bubble,
          isOutgoing ? styles.cornersOutgoing : styles.cornersIncoming,
        ]}
      >
        <Image source={source} style={styles.image} resizeMode="cover" />
        {caption && (
          <View style={styles.footer}>
            <Text style={[typography.bodyMd, styles.caption]}>{caption}</Text>
          </View>
        )}
      </View>
      <Text style={[typography.labelSm, styles.timestamp]}>{timestamp}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
    maxWidth: '78%',
  },
  wrapOutgoing: {
    alignSelf: 'flex-end',
  },
  bubble: {
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainer,
  },
  cornersIncoming: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    borderBottomLeftRadius: radius.sm,
  },
  cornersOutgoing: {
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.sm,
  },
  image: {
    width: '100%',
    aspectRatio: 4 / 3,
  },
  footer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  caption: {
    color: colors.onSurface,
  },
  timestamp: {
    color: colors.onSurfaceVariant,
    marginTop: 4,
    marginLeft: 4,
  },
});
