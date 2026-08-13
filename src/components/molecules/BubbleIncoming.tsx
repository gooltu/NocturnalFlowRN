import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { SVGIconName, SVGImageIcon } from '../atoms/SVGImageIcon';

export interface BubbleIncomingProps {
  text: string;
  timestamp: string;
  icon?: SVGIconName;
}

/** Incoming message bubble: `surface-container` fill, `on-surface` text.
 * The corner pointing to the sender (bottom-left) is tight (4px); the other
 * three corners use the softer 16px radius. The timestamp sits inside the
 * bubble, bottom-right. A vector `SVGImageIcon` sits
 * outside the bubble to its left, vertically centered, standing in for the
 * sender's avatar. */
export function BubbleIncoming({ text, timestamp, icon = 'logo' }: BubbleIncomingProps) {
  return (
    <View style={styles.row}>
      <SVGImageIcon icon={icon} size={28} />
      <View style={styles.bubble}>
        <Text style={[typography.bodyLg, styles.text]}>{text}</Text>
        <Text style={[typography.labelSm, styles.timestamp]}>{timestamp}</Text>
      </View>
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
  bubble: {
    flexShrink: 1,
    backgroundColor: colors.surfaceContainer,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    borderBottomLeftRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  text: {
    color: colors.onSurface,
  },
  timestamp: {
    color: colors.onSurfaceVariant,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});
