import React from 'react';
import {
  Film,
  Image as ImageGlyph,
  Images,
  Mic,
  Play,
  Sticker as StickerGlyph,
  Video as VideoGlyph,
} from 'lucide-react-native';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { iconTokens, radius, spacing, states, typography, useThemeColors, useStyles, ThemeColors } from '../../../../theme';
import { bubbleSkin, GRID_GUTTER, SCRIM_OPACITY } from '../bubbleTheme';
import { MessageDirection, QuotedContent, QuotedMessage } from '../types';

export interface QuoteBlockProps {
  direction: MessageDirection;
  quote: QuotedMessage;
}

const THUMB_SIZE = 40;
const GLYPH_SIZE = 13;

const absoluteFill = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

/** Nested quote at the top of a reply bubble: a 2px accent left rule, the
 * quoted sender, a one-line snippet and a 40pt artefact of whatever was
 * quoted. Incoming quotes sit on `surface-container-high`; outgoing ones on
 * `primary`, since `surface-container-high` would vanish into the orange
 * bubble. */
export function QuoteBlock({ direction, quote }: QuoteBlockProps) {
  const colors = useThemeColors();
  const skin = bubbleSkin(colors, direction);
  const styles = useStyles(makeStyles);
  const { label, Glyph } = describeQuotedContent(quote.content);

  const body = (
    <View
      style={[
        styles.block,
        { backgroundColor: skin.quoteFill, borderLeftColor: skin.quoteAccent },
      ]}
    >
      <View style={styles.text}>
        <Text style={[typography.labelLg, { color: skin.quoteAccent }]} numberOfLines={1}>
          {quote.senderName}
        </Text>
        <View style={styles.snippetRow}>
          {Glyph && (
            <Glyph
              size={GLYPH_SIZE}
              strokeWidth={iconTokens.strokeWidth}
              color={skin.quoteSnippet}
              opacity={skin.quoteSnippetOpacity}
            />
          )}
          <Text
            style={[
              typography.bodyMd,
              styles.snippet,
              { color: skin.quoteSnippet, opacity: skin.quoteSnippetOpacity },
            ]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </View>
      </View>
      <QuoteArtefact direction={direction} content={quote.content} />
    </View>
  );

  if (!quote.onPress) return body;

  return (
    <Pressable
      onPress={quote.onPress}
      accessibilityRole="button"
      accessibilityLabel={`Reply to ${quote.senderName}: ${label}. Go to message.`}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
    >
      {body}
    </Pressable>
  );
}

/** Snippet copy and leading glyph per quoted kind. Media quotes name their
 * type because there is no text to show. Exported so other reply-preview UI
 * (e.g. `ChatInputBar`'s reply bar) can describe a `QuotedContent` the same
 * way this in-bubble quote does. */
export function describeQuotedContent(content: QuotedContent): {
  label: string;
  Glyph?: typeof ImageGlyph;
} {
  switch (content.kind) {
    case 'text':
      return { label: content.snippet };
    case 'image':
      return { label: 'Photo', Glyph: ImageGlyph };
    case 'video':
      return {
        label: content.duration ? `Video · ${content.duration}` : 'Video',
        Glyph: VideoGlyph,
      };
    case 'sticker':
      return { label: 'Sticker', Glyph: StickerGlyph };
    case 'gif':
      return { label: 'GIF', Glyph: Film };
    case 'imageGroup':
      return {
        label: `${content.count ?? content.thumbnails.length} photos`,
        Glyph: Images,
      };
    case 'voice':
      return { label: `Voice message · ${content.duration}`, Glyph: Mic };
  }
}

function QuoteArtefact({
  direction,
  content,
}: {
  direction: MessageDirection;
  content: QuotedContent;
}) {
  const colors = useThemeColors();
  const skin = bubbleSkin(colors, direction);
  const styles = useStyles(makeStyles);

  switch (content.kind) {
    case 'text':
      return null;

    case 'image':
    case 'gif':
      return (
        <Image source={content.thumbnail} style={styles.thumb} resizeMode="cover" />
      );

    case 'video':
      return (
        <View style={styles.thumb}>
          <Image source={content.thumbnail} style={styles.thumbImage} resizeMode="cover" />
          <View style={styles.miniPlayWrap} pointerEvents="none">
            <View style={styles.miniHalo} />
            <Play
              size={10}
              strokeWidth={iconTokens.strokeWidth}
              color={skin.text}
              fill={skin.text}
            />
          </View>
        </View>
      );

    case 'sticker':
      return <Image source={content.source} style={styles.sticker} resizeMode="contain" />;

    case 'imageGroup':
      return (
        <View style={styles.miniGrid}>
          {content.thumbnails.slice(0, 4).map((source, index) => (
            <Image key={index} source={source} style={styles.miniTile} resizeMode="cover" />
          ))}
        </View>
      );

    case 'voice':
      return (
        <View style={[styles.tile, { backgroundColor: skin.quoteTileFill }]}>
          <Mic
            size={iconTokens.sizeSm}
            strokeWidth={iconTokens.strokeWidth}
            color={skin.quoteSnippet}
          />
        </View>
      );
  }
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  block: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.DEFAULT,
    borderLeftWidth: 2,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
  },
  pressed: {
    opacity: states.pressedOpacity,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  snippetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  snippet: {
    flexShrink: 1,
    fontSize: 13,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  miniPlayWrap: {
    ...absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniHalo: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.surfaceContainerLowest,
    opacity: SCRIM_OPACITY,
  },
  sticker: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  miniGrid: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GUTTER,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  miniTile: {
    width: (THUMB_SIZE - GRID_GUTTER) / 2,
    height: (THUMB_SIZE - GRID_GUTTER) / 2,
  },
  tile: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
