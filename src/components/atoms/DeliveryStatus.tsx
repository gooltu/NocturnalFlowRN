import React from 'react';
import { Check, CheckCheck } from 'lucide-react-native';
import { colors } from '../../theme';

export type DeliveryState = 'sent' | 'delivered' | 'seen';

export interface DeliveryStatusProps {
  status: DeliveryState;
  size?: number;
}

/** Single check = sent, double check in on-surface-variant = delivered,
 * double check in read-receipt = seen. */
export function DeliveryStatus({ status, size = 14 }: DeliveryStatusProps) {
  if (status === 'sent') {
    return <Check size={size} strokeWidth={2} color={colors.onSurfaceVariant} />;
  }
  return (
    <CheckCheck
      size={size}
      strokeWidth={2}
      color={status === 'seen' ? colors.readReceipt : colors.onSurfaceVariant}
    />
  );
}
