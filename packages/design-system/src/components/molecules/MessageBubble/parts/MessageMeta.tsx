import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography, useThemeColors } from '../../../../theme';
import { DeliveryState, DeliveryStatus } from '../../../atoms/DeliveryStatus';
import { bubbleSkin } from '../bubbleTheme';
import { MessageDirection } from '../types';

export interface MessageMetaProps {
  direction: MessageDirection;
  timestamp: string;
  status?: DeliveryState;
  /** Sticker bubbles have no fill to sit the meta inside, so it aligns to the
   * message's own side instead of the bubble's right edge. */
  align?: 'left' | 'right';
}

/** Timestamp plus, on outgoing messages, the delivery ticks.
 *
 * Sent and delivered both draw in `on-primary-container` at 70% and differ by
 * glyph — the spec's `on-surface-variant` for delivered has too little
 * contrast on `primary-container`. Seen keeps the `read-receipt` tint. State
 * is never carried by colour alone. */
export function MessageMeta({ direction, timestamp, status, align = 'right' }: MessageMetaProps) {
  const colors = useThemeColors();
  const skin = bubbleSkin(colors, direction);
  const showTicks = direction === 'outgoing' && status != null;

  return (
    <View style={[styles.row, align === 'right' ? styles.alignRight : styles.alignLeft]}>
      <Text style={[typography.labelSm, { color: skin.meta }]} numberOfLines={1}>
        {timestamp}
      </Text>
      {showTicks && (
        <View style={status === 'seen' ? undefined : styles.muted}>
          <DeliveryStatus status={status!} tone="onAccent" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alignRight: {
    alignSelf: 'flex-end',
  },
  alignLeft: {
    alignSelf: 'flex-start',
  },
  muted: {
    opacity: 0.7,
  },
});
