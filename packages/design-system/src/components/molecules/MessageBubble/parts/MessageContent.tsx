import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { spacing, states, typography, useThemeColors } from '../../../../theme';
import { bubbleSkin } from '../bubbleTheme';
import { MessageContent as MessageContentModel, MessageDirection } from '../types';
import { ImageGrid } from './ImageGrid';
import { MediaBadge, PlayHalo } from './MediaChrome';
import { MessageMeta, MessageMetaProps } from './MessageMeta';
import { VoiceContent } from './VoiceContent';

export interface MessageContentProps {
  direction: MessageDirection;
  content: MessageContentModel;
  meta: MessageMetaProps;
  /** Sender header (group incoming) — placed inside the padding for flow
   * content, or in its own strip above full-bleed media. */
  header?: React.ReactNode;
  /** Quoted reply block, placed the same way as the header. */
  quote?: React.ReactNode;
}

const DEFAULT_ASPECT = 4 / 3;

/** Renders a message body by content kind and positions the meta row, header
 * and quote for that kind. Flow content (text, voice) stacks everything in one
 * padded column; media content keeps the media full-bleed with the header and
 * caption on their own padded strips. Bubble fill and corners are the shell's
 * job; the sticker case has no bubble and is handled by the shell directly. */
export function MessageContent({ direction, content, meta, header, quote }: MessageContentProps) {
  const colors = useThemeColors();
  const skin = bubbleSkin(colors, direction);

  switch (content.kind) {
    case 'text':
      return (
        <View style={styles.flowPad}>
          {header}
          {quote}
          <Text style={[typography.bodyLg, { color: skin.text }]}>{content.text}</Text>
          <MessageMeta {...meta} />
        </View>
      );

    case 'voice':
      return (
        <View style={styles.flowPad}>
          {header}
          {quote}
          <VoiceContent direction={direction} content={content} />
          <MessageMeta {...meta} />
        </View>
      );

    case 'image':
      return (
        <MediaFrame header={header} quote={quote}>
          <Tappable onPress={content.onPress}>
            <MediaImage source={content.source} aspectRatio={content.aspectRatio} />
          </Tappable>
          <CaptionStrip meta={meta} />
        </MediaFrame>
      );

    case 'imageGroup':
      return (
        <MediaFrame header={header} quote={quote}>
          <ImageGrid sources={content.sources} onPressItem={content.onPressItem} />
          <CaptionStrip meta={meta} />
        </MediaFrame>
      );

    case 'textImage':
      return (
        <MediaFrame header={header} quote={quote}>
          <Tappable onPress={content.onPress}>
            <MediaImage source={content.source} aspectRatio={content.aspectRatio} />
          </Tappable>
          <CaptionStrip meta={meta}>
            <Text style={[typography.bodyMd, { color: skin.text }]}>{content.caption}</Text>
          </CaptionStrip>
        </MediaFrame>
      );

    case 'gif':
      return (
        <MediaFrame header={header} quote={quote}>
          <Tappable onPress={content.onPress}>
            <MediaImage source={content.source} aspectRatio={content.aspectRatio} />
            <View style={styles.topLeftBadge} pointerEvents="none">
              <MediaBadge label="GIF" />
            </View>
          </Tappable>
          <CaptionStrip meta={meta} />
        </MediaFrame>
      );

    case 'video':
      return (
        <MediaFrame header={header} quote={quote}>
          <Tappable onPress={content.onPlay} label="Play video">
            <MediaImage source={content.thumbnail} aspectRatio={content.aspectRatio} />
            <PlayHalo />
            <View style={styles.bottomRightBadge} pointerEvents="none">
              <MediaBadge label={content.duration} />
            </View>
          </Tappable>
          <CaptionStrip meta={meta} />
        </MediaFrame>
      );
  }
}

function MediaImage({
  source,
  aspectRatio,
}: {
  source: MediaContentSource;
  aspectRatio?: number;
}) {
  return (
    <Image
      source={source}
      style={{ width: '100%', aspectRatio: aspectRatio ?? DEFAULT_ASPECT }}
      resizeMode="cover"
    />
  );
}

type MediaContentSource = React.ComponentProps<typeof Image>['source'];

/** Media types share a vertical frame with no padding — the media is
 * full-bleed. A group sender header sits in its own padded strip above it. */
function MediaFrame({
  header,
  quote,
  children,
}: {
  header?: React.ReactNode;
  quote?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.mediaFrame}>
      {header && <View style={styles.mediaStrip}>{header}</View>}
      {quote && <View style={styles.mediaStrip}>{quote}</View>}
      {children}
    </View>
  );
}

function CaptionStrip({
  meta,
  children,
}: {
  meta: MessageMetaProps;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.captionStrip}>
      {children}
      <MessageMeta {...meta} />
    </View>
  );
}

/** Wraps tappable media without adding layout when there's no handler. */
function Tappable({
  onPress,
  label,
  children,
}: {
  onPress?: () => void;
  label?: string;
  children: React.ReactNode;
}) {
  if (!onPress) return <View style={styles.mediaLayer}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="imagebutton"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.mediaLayer, pressed && { opacity: states.pressedOpacity }]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flowPad: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: 6,
  },
  mediaFrame: {
    overflow: 'hidden',
  },
  mediaStrip: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  mediaLayer: {
    position: 'relative',
  },
  captionStrip: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm + 2,
    gap: 4,
  },
  topLeftBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  bottomRightBadge: {
    position: 'absolute',
    right: spacing.sm,
    bottom: spacing.sm,
  },
});
