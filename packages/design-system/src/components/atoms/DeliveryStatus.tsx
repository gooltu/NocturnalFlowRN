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
}

/** Clock = pending (not yet submitted to the server), single check = sent,
 * double check in on-surface-variant = delivered, double check in
 * read-receipt = seen. */
export function DeliveryStatus({ status, size = 14, tone = 'default' }: DeliveryStatusProps) {
  const colors = useThemeColors();
  const muted = tone === 'onAccent' ? colors.onPrimaryContainer : colors.onSurfaceVariant;

  if (status === 'pending') {
    return <Clock size={size} strokeWidth={2} color={muted} />;
  }
  if (status === 'sent') {
    return <Check size={size} strokeWidth={2} color={muted} />;
  }
  return (
    <CheckCheck
      size={size}
      strokeWidth={2}
      color={status === 'seen' ? colors.readReceipt : muted}
    />
  );
}
