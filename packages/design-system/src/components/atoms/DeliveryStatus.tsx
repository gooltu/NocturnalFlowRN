import React from 'react';
import { Check, CheckCheck } from 'lucide-react-native';
import { useThemeColors } from '../../theme';

export type DeliveryState = 'sent' | 'delivered' | 'seen';

/** `onAccent` is for ticks drawn on a `primary-container` fill (inside an
 * outgoing bubble), where `on-surface-variant` has too little contrast. */
export type DeliveryTone = 'default' | 'onAccent';

export interface DeliveryStatusProps {
  status: DeliveryState;
  size?: number;
  tone?: DeliveryTone;
}

/** Single check = sent, double check in on-surface-variant = delivered,
 * double check in read-receipt = seen. */
export function DeliveryStatus({ status, size = 14, tone = 'default' }: DeliveryStatusProps) {
  const colors = useThemeColors();
  const muted = tone === 'onAccent' ? colors.onPrimaryContainer : colors.onSurfaceVariant;

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
