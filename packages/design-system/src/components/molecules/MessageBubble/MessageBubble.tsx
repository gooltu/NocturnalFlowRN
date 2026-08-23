import React from 'react';
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { states, useThemeColors } from '../../../theme';
import { bubbleSkin, BUBBLE_MAX_WIDTH, MEDIA_BUBBLE_WIDTH_FRACTION, MIN_TEXT_BUBBLE_WIDTH } from './bubbleTheme';
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
]);

/** One message bubble for every content type and layout state in the design
 * system. `direction` picks the side, fill, text colour and corners;
 * `context` adds the sender header on incoming group messages. Neither context
 * renders an avatar — identity comes from the screen Header.
 *
 * Stickers are the one kind with no bubble fill: art plus a timestamp, aligned
 * to the message's own side.
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

  if (content.kind === 'sticker') {
    const size = content.size ?? 132;
    return wrap(
      <View style={[styles.stickerWrap, { alignSelf }, style]}>
        {showHeader && <SenderName name={senderName!} />}
        <Image
          source={content.source}
          style={{ width: size, height: size }}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel={senderName ? `Sticker from ${senderName}` : 'Sticker'}
        />
        <MessageMeta {...meta} align={isOutgoing ? 'right' : 'left'} />
      </View>
    );
  }

  const isMedia = MEDIA_KINDS.has(content.kind);

  const inner = (
    <MessageContent
      direction={direction}
      content={content}
      meta={meta}
      header={showHeader ? <SenderName name={senderName!} /> : undefined}
      quote={replyTo ? <QuoteBlock direction={direction} quote={replyTo} /> : undefined}
    />
  );

  const bubbleStyle = [
    styles.bubble,
    skin.corners,
    { backgroundColor: skin.fill },
    isMedia ? { width: windowWidth * MEDIA_BUBBLE_WIDTH_FRACTION } : { maxWidth: BUBBLE_MAX_WIDTH },
    content.kind === 'text' && { minWidth: MIN_TEXT_BUBBLE_WIDTH },
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

const styles = StyleSheet.create({
  bubble: {
    overflow: 'hidden',
  },
  stickerWrap: {
    maxWidth: BUBBLE_MAX_WIDTH,
    gap: 6,
  },
});
