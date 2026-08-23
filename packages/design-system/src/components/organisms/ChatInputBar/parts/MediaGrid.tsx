import React from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, states, typography, useThemeColors, useStyles, ThemeColors } from '../../../../theme';
import { MediaSearchState, PickerMediaItem } from '../types';

export interface MediaGridProps {
  state: MediaSearchState;
  onSelect: (item: PickerMediaItem) => void;
}

const COLUMNS = 3;

/** Shared Sticker/GIF tab body: a square-thumbnail grid over a
 * `MediaSearchState`, with loading/error/empty states. Tap sends. */
export function MediaGrid({ state, onSelect }: MediaGridProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);

  if (state.loading && state.items.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (state.error) {
    return (
      <View style={styles.centered}>
        <Text style={[typography.bodyMd, styles.message]}>{state.error}</Text>
      </View>
    );
  }

  if (state.items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={[typography.bodyMd, styles.message]}>No results</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={state.items}
      keyExtractor={(item) => String(item.id)}
      numColumns={COLUMNS}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onSelect(item)}
          style={({ pressed }) => [styles.cell, pressed && { opacity: states.pressedOpacity }]}
        >
          <Image source={{ uri: item.previewUri }} style={styles.image} resizeMode="cover" />
        </Pressable>
      )}
    />
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  content: {
    padding: spacing.sm,
  },
  cell: {
    flexBasis: `${100 / COLUMNS}%`,
    aspectRatio: 1,
    padding: 4,
  },
  image: {
    flex: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceContainer,
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
