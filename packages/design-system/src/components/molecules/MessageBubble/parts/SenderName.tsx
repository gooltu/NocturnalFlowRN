import React from 'react';
import { Text } from 'react-native';
import { typography, useThemeColors } from '../../../../theme';
import { senderAccent } from '../bubbleTheme';

export interface SenderNameProps {
  name: string;
}

/** Sender header on incoming group messages. Group threads drop the avatar, so
 * this line is what identifies the sender. */
export function SenderName({ name }: SenderNameProps) {
  const colors = useThemeColors();
  return (
    <Text style={[typography.labelLg, { color: senderAccent(colors) }]} numberOfLines={1}>
      {name}
    </Text>
  );
}
