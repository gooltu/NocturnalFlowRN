import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';
import { DeliveryState, DeliveryStatus } from '../atoms/DeliveryStatus';

export interface BubbleOutgoingProps {
  text: string;
  timestamp: string;
  status: DeliveryState;
}

/** Outgoing message bubble: `primary-container` fill, `on-primary-container`
 * text (a dark brown, not pure black, to stay in the warm-neutral system).
 * The corner pointing to the sender (bottom-right) is tight (4px). Timestamp
 * and delivery ticks sit inside the bubble, bottom-right. */
export function BubbleOutgoing({ text, timestamp, status }: BubbleOutgoingProps) {
  return (
    <View style={styles.bubble}>
      <Text style={[typography.bodyLg, styles.text]}>{text}</Text>
      <View style={styles.meta}>
        <Text style={[typography.labelSm, styles.timestamp]}>{timestamp}</Text>
        <DeliveryStatus status={status} tone="onAccent" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-end',
    maxWidth: '78%',
    backgroundColor: colors.primaryContainer,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  text: {
    color: colors.onPrimaryContainer,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  timestamp: {
    color: colors.onPrimaryContainer,
  },
});
