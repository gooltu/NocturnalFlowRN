import React from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { states, useThemeColors, useStyles, ThemeColors } from '../../../theme';
import { bubbleSkin, MEDIA_BUBBLE_WIDTH_FRACTION } from './bubbleTheme';
import { MessageContent } from './parts/MessageContent';
import { MessageMeta } from './parts/MessageMeta';
import { QuoteBlock } from './parts/QuoteBlock';
import { SenderName } from './parts/SenderName';
import { SwipeToReply } from './parts/SwipeToReply';
import { MessageBubbleProps, MessageContent as MessageContentModel } from './types';

/** Content kinds whose media is full-bleed, so the bubble takes a definite
 * width (for `aspectRatio` to resolve) rather than merely capping. */
const MEDIA_KINDS: ReadonlySet<MessageContentModel['kind']> = new Set([
  'image',
  'imageGroup',
  'textImage',
  'gif',
  'video',
  'location',
  'link',
]);

/** One message bubble for every content type and layout state in the design
 * system. `direction` picks the side, fill, text colour and corners;
 * `context` adds the sender header on incoming group messages. Neither context
 * renders an avatar — identity comes from the screen Header.
 *
 * Every content kind, including stickers, renders through `MessageContent`;
 * stickers are the one kind with no bubble fill (art plus a timestamp,
 * aligned to the message's own side), which `bubbleStyle` below accounts for
 * by conditionally dropping the fill/corners rather than a separate layout.
 *
 * This is the code counterpart to the 45 `Component / Bubble / *` symbols on
 * the canvas (15 content types × 3 states), collapsed to one component with
 * props instead of 45 baked permutations. */
export function MessageBubble({
  direction,
  context = 'direct',
  senderName,
  content,
  replyTo,
  timestamp,
  status,
  onPress,
  onLongPress,
  onSwipeReply,
  style,
}: MessageBubbleProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const skin = bubbleSkin(colors, direction);
  const { width: windowWidth } = useWindowDimensions();
  const isOutgoing = direction === 'outgoing';
  const showHeader = direction === 'incoming' && context === 'group' && !!senderName;

  const meta = { direction, timestamp, status } as const;

  const alignSelf: 'flex-end' | 'flex-start' = isOutgoing ? 'flex-end' : 'flex-start';

  const wrap = (element: React.ReactNode) =>
    onSwipeReply ? (
      <SwipeToReply direction={direction} onReply={onSwipeReply}>
        {element}
      </SwipeToReply>
    ) : (
      element
    );

  const isMedia = MEDIA_KINDS.has(content.kind);
  const isSticker = content.kind === 'sticker';

  const inner = (
    <MessageContent
      direction={direction}
      content={content}
      meta={meta}
      header={showHeader ? <SenderName name={senderName!} /> : undefined}
      quote={replyTo ? <QuoteBlock direction={direction} quote={replyTo} /> : undefined}
      senderName={senderName}
    />
  );

  const bubbleStyle = [
    styles.bubble,
    // Stickers render with no container fill — art plus a timestamp, not a
    // coloured/rounded box — so the shell's fill and corners are conditional
    // on content kind rather than a separate code path.
    !isSticker && skin.corners,
    !isSticker && { backgroundColor: skin.fill },
    isMedia && { width: windowWidth * MEDIA_BUBBLE_WIDTH_FRACTION },
    { alignSelf },
    style,
  ];

  if (!onPress && !onLongPress) {
    return wrap(<View style={bubbleStyle}>{inner}</View>);
  }

  return wrap(
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [...bubbleStyle, pressed && { opacity: states.pressedOpacity }]}
    >
      {inner}
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  bubble: {
    overflow: 'hidden',
  },
});
