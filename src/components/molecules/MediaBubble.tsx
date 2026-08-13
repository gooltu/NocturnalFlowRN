import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { SVGIconName, SVGImageIcon } from '../atoms/SVGImageIcon';

export interface MediaBubbleProps {
  source: ImageSourcePropType;
  caption?: string;
  timestamp: string;
  variant?: 'incoming' | 'outgoing';
  icon?: SVGIconName;
}

/** Image fills the bubble shape; an optional caption and the timestamp sit
 * below on a `surface-container` footer strip inside the bubble, matching the
 * parent bubble's rounding.
 * When incoming, a vector `SVGImageIcon` sits outside the bubble to its
 * left, vertically centered, standing in for the sender's avatar. */
export function MediaBubble({ source, caption, timestamp, variant = 'incoming', icon = 'logo' }: MediaBubbleProps) {
  const isOutgoing = variant === 'outgoing';

  const content = (
    <View style={[styles.wrap, isOutgoing && styles.wrapOutgoing]}>
      <View
        style={[
          styles.bubble,
          isOutgoing ? styles.cornersOutgoing : styles.cornersIncoming,
        ]}
      >
        <Image source={source} style={styles.image} resizeMode="cover" />
        <View style={styles.footer}>
          {caption && <Text style={[typography.bodyMd, styles.caption]}>{caption}</Text>}
          <Text style={[typography.labelSm, styles.timestamp]}>{timestamp}</Text>
        </View>
      </View>
    </View>
  );

  if (isOutgoing) return content;

  return (
    <View style={styles.row}>
      <SVGImageIcon icon={icon} size={28} />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    maxWidth: '78%',
  },
  wrap: {
    flexShrink: 1,
  },
  wrapOutgoing: {
    alignSelf: 'flex-end',
    maxWidth: '78%',
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
    gap: 4,
  },
  caption: {
    color: colors.onSurface,
  },
  timestamp: {
    color: colors.onSurfaceVariant,
    alignSelf: 'flex-end',
  },
});
