import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { EmojiKeyboard } from 'rn-emoji-keyboard';
import { radius, spacing, typography, useThemeColors, useStyles, ThemeColors } from '../../../../theme';
import { MediaSearchState, PickerMediaItem } from '../types';
import { MediaGrid } from './MediaGrid';

/** Maps our tokens onto `rn-emoji-keyboard`'s theme shape — colors only,
 * kept separate from layout (`styles` prop) same as the library's own
 * theme/styles split. Reuses the same tonal choices as this file's own
 * search bar and active-tab indicator, so it reads as one design system. */
function emojiKeyboardTheme(colors: ThemeColors) {
  return {
    container: colors.background,
    header: colors.onSurfaceVariant,
    skinTonesContainer: colors.surfaceContainerHigh,
    category: {
      icon: colors.onSurfaceVariant,
      iconActive: colors.primary,
      container: colors.background,
      containerActive: colors.surfaceContainerHigh,
    },
    search: {
      background: colors.surfaceContainer,
      text: colors.onSurface,
      placeholder: colors.onSurfaceVariant,
      icon: colors.onSurfaceVariant,
    },
  };
}

export interface EmojiGifPanelProps {
  onSelectEmoji: (emoji: string) => void;
  stickers?: MediaSearchState;
  gifs?: MediaSearchState;
  onSelectSticker: (item: PickerMediaItem) => void;
  onSelectGif: (item: PickerMediaItem) => void;
}

type PanelTab = 'emoji' | 'sticker' | 'gif';

const TABS: { key: PanelTab; label: string }[] = [
  { key: 'emoji', label: 'Emoji' },
  { key: 'sticker', label: 'Sticker' },
  { key: 'gif', label: 'GIF' },
];

/** Fixed-height 320px, renders in place of the native keyboard. Three tabs;
 * Sticker/GIF share a search bar and `MediaGrid` — each tab's search text
 * lives on its own `MediaSearchState.query`, so switching tabs and back
 * doesn't lose either search. */
export function EmojiGifPanel({ onSelectEmoji, stickers, gifs, onSelectSticker, onSelectGif }: EmojiGifPanelProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const [tab, setTab] = useState<PanelTab>('emoji');

  const activeState = tab === 'sticker' ? stickers : tab === 'gif' ? gifs : undefined;

  return (
    <View style={styles.wrap}>
      <View style={styles.tabs}>
        {TABS.map(({ key, label }) => {
          const active = tab === key;
          return (
            <Pressable key={key} onPress={() => setTab(key)} style={styles.tabButton}>
              <Text style={[typography.labelLg, { color: active ? colors.primary : colors.onSurfaceVariant }]}>
                {label}
              </Text>
              {active && <View style={styles.tabIndicator} />}
            </Pressable>
          );
        })}
      </View>

      {tab !== 'emoji' && (
        <View style={styles.searchWrap}>
          <TextInput
            value={activeState?.query ?? ''}
            onChangeText={(next) => activeState?.onSearch(next)}
            placeholder={`Search ${tab === 'sticker' ? 'stickers' : 'GIFs'}`}
            placeholderTextColor={colors.onSurfaceVariant}
            editable={!!activeState}
            style={[typography.bodyMd, styles.searchInput]}
          />
        </View>
      )}

      <View style={styles.content}>
        {tab === 'emoji' && (
          <EmojiKeyboard
            onEmojiSelected={(item) => onSelectEmoji(item.emoji)}
            categoryPosition="top"
            theme={emojiKeyboardTheme(colors)}
            styles={{ container: { flex: 1, backgroundColor: 'transparent' } }}
          />
        )}
        {tab === 'sticker' &&
          (stickers ? (
            <MediaGrid state={stickers} onSelect={onSelectSticker} />
          ) : (
            <View style={styles.centered}>
              <Text style={[typography.bodyMd, styles.message]}>Stickers unavailable</Text>
            </View>
          ))}
        {tab === 'gif' &&
          (gifs ? (
            <MediaGrid state={gifs} onSelect={onSelectGif} />
          ) : (
            <View style={styles.centered}>
              <Text style={[typography.bodyMd, styles.message]}>GIFs unavailable</Text>
            </View>
          ))}
      </View>
    </View>
  );
}

export const PANEL_HEIGHT = 320;

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  wrap: {
    height: PANEL_HEIGHT,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.marginMobile,
    gap: spacing.lg,
  },
  tabButton: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  tabIndicator: {
    height: 2,
    width: 20,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  searchWrap: {
    paddingHorizontal: spacing.marginMobile,
    paddingBottom: spacing.sm,
  },
  searchInput: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.DEFAULT,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.onSurface,
  },
  content: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: colors.onSurfaceVariant,
  },
});
