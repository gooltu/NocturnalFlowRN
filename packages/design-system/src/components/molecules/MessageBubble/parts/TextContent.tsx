import React from 'react';
import { Text } from 'react-native';
import { typography, useThemeColors } from '../../../../theme';
import { bubbleSkin } from '../bubbleTheme';
import { MessageDirection, TextMessageContent } from '../types';

export interface TextContentProps {
  direction: MessageDirection;
  content: TextMessageContent;
  /** E2E ID, derived by the parent bubble. */
  testID?: string;
}

/** Plain message body text. */
export function TextContent({ direction, content, testID }: TextContentProps) {
  const colors = useThemeColors();
  const skin = bubbleSkin(colors, direction);

  return <Text testID={testID} style={[typography.bodyLg, { color: skin.text }]}>{content.text}</Text>;
}
