import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { subTestID } from '../../../../utils';
import { spacing, typography, useThemeColors, useStyles, ThemeColors } from '../../../../theme';
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
  /** E2E ID for the meta row; timestamp/ticks derive `.timestamp` / `.status`
   * from the bubble ID (the meta row's parent), not from this one. */
  testID?: string;
  /** Bubble-level ID the timestamp/status IDs derive from. */
  bubbleTestID?: string;
}

/** Timestamp plus, on outgoing messages, the delivery glyph.
 *
 * Pending, sent and delivered all draw in `on-primary-container` at 70% and
 * differ by glyph (clock / single check / double check) — the spec's
 * `on-surface-variant` for delivered has too little contrast on
 * `primary-container`. Seen keeps the `read-receipt` tint. State is never
 * carried by colour alone. */
export function MessageMeta({ direction, timestamp, status, align = 'right', testID, bubbleTestID }: MessageMetaProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const skin = bubbleSkin(colors, direction);
  const showTicks = direction === 'outgoing' && status != null;

  return (
    <View testID={testID} style={[styles.row, styles.justifyRight]}>
      <Text testID={subTestID(bubbleTestID, 'timestamp')} style={[typography.labelSm, { color: skin.meta }]}>{timestamp}</Text>
      {showTicks && (
        <View style={status === 'seen' ? undefined : styles.muted}>
          <DeliveryStatus status={status!} tone="onAccent" testID={subTestID(bubbleTestID, 'status')} />
        </View>
      )}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  justifyRight: {
    justifyContent: 'flex-end',
  },
  justifyLeft: {
    justifyContent: 'flex-start',
  },
  muted: {
    opacity: 0.7,
  },
});
