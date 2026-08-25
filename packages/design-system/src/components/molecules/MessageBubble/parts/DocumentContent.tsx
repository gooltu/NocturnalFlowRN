import React from 'react';
import { AlertTriangle, FileText } from 'lucide-react-native';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { iconTokens, spacing, states, typography, useThemeColors, useStyles, ThemeColors } from '../../../../theme';
import { bubbleSkin } from '../bubbleTheme';
import { DocumentMessageContent, MessageDirection } from '../types';

export interface DocumentContentProps {
  direction: MessageDirection;
  content: DocumentMessageContent;
}

const TILE_SIZE = 44;

/** File-share row: a type tile (glyph, or a spinner/failure glyph while
 * `status` is set) plus filename and a secondary line — the file size when
 * ready, otherwise a status message. */
export function DocumentContent({ direction, content }: DocumentContentProps) {
  const colors = useThemeColors();
  const skin = bubbleSkin(colors, direction);
  const styles = useStyles(makeStyles);
  const { fileName, fileSize, fileType, status, onPress } = content;

  const secondary =
    status === 'downloading'
      ? 'Downloading…'
      : status === 'failed'
        ? 'Couldn’t download · Tap to retry'
        : `${fileType.toUpperCase()} · ${fileSize}`;

  const row = (
    <View style={styles.row}>
      <View style={[styles.tile, { backgroundColor: skin.quoteTileFill }]}>
        {status === 'downloading' ? (
          <ActivityIndicator color={skin.text} />
        ) : status === 'failed' ? (
          <AlertTriangle size={iconTokens.sizeMd} strokeWidth={iconTokens.strokeWidth} color={colors.error} />
        ) : (
          <FileText size={iconTokens.sizeMd} strokeWidth={iconTokens.strokeWidth} color={skin.text} />
        )}
      </View>
      <View style={styles.text}>
        <Text style={[typography.bodyLg, { color: skin.text }]} numberOfLines={1}>
          {fileName}
        </Text>
        <Text
          style={[typography.labelSm, { color: status === 'failed' ? colors.error : skin.meta }]}
          numberOfLines={1}
        >
          {secondary}
        </Text>
      </View>
    </View>
  );

  if (!onPress) return row;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${fileName}, ${secondary}`}
      style={({ pressed }) => pressed && { opacity: states.pressedOpacity }}
    >
      {row}
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: TILE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
