import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react-native';
import { useThemeColors } from '../../theme';

export type DeliveryState = 'pending' | 'sent' | 'delivered' | 'seen';

/** `onAccent` is for ticks drawn on a `primary-container` fill (inside an
 * outgoing bubble), where `on-surface-variant` has too little contrast. */
export type DeliveryTone = 'default' | 'onAccent';

export interface DeliveryStatusProps {
  status: DeliveryState;
  size?: number;
  tone?: DeliveryTone;
  /** Stable ID for E2E tools (Maestro/Detox); forwarded to the root element. */
  testID?: string;
}

/** Clock = pending (not yet submitted to the server), single check = sent,
 * double check in on-surface-variant = delivered, double check in
 * read-receipt = seen. */
export function DeliveryStatus({ status, size = 14, tone = 'default', testID }: DeliveryStatusProps) {
  const colors = useThemeColors();
  const muted = tone === 'onAccent' ? colors.onPrimaryContainer : colors.onSurfaceVariant;

  if (status === 'pending') {
    return <Clock testID={testID} size={size} strokeWidth={2} color={muted} />;
  }
  if (status === 'sent') {
    return <Check testID={testID} size={size} strokeWidth={2} color={muted} />;
  }
  return (
    <CheckCheck
      testID={testID}
      size={size}
      strokeWidth={2}
      color={status === 'seen' ? colors.readReceipt : muted}
    />
  );
}
