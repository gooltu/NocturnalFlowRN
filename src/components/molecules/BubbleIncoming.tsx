import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export interface BubbleIncomingProps {
  text: string;
  timestamp: string;
}

/** Incoming message bubble: `surface-container` fill, `on-surface` text.
 * The corner pointing to the sender (bottom-left) is tight (4px); the other
 * three corners use the softer 16px radius. */
export function BubbleIncoming({ text, timestamp }: BubbleIncomingProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bubble}>
        <Text style={[typography.bodyLg, styles.text]}>{text}</Text>
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
  bubble: {
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
    marginTop: 4,
    marginLeft: 4,
  },
});
