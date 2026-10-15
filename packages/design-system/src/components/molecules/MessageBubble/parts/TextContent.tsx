import React from 'react';
import { Text } from 'react-native';
import { typography, useThemeColors } from '../../../../theme';
import { bubbleSkin } from '../bubbleTheme';
import { MessageDirection, TextMessageContent } from '../types';

export interface TextContentProps {
  direction: MessageDirection;
  content: TextMessageContent;
}

/** Plain message body text. */
export function TextContent({ direction, content }: TextContentProps) {
  const colors = useThemeColors();
  const skin = bubbleSkin(colors, direction);

  return <Text style={[typography.bodyLg, { color: skin.text, minWidth: 150 }]}>{content.text}</Text>;
}
