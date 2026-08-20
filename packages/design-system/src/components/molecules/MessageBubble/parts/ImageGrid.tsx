import React from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { states, typography, useStyles, ThemeColors } from '../../../../theme';
import { GRID_GUTTER } from '../bubbleTheme';
import { MediaScrim } from './MediaChrome';

const absoluteFill = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export interface ImageGridProps {
  sources: ImageSourcePropType[];
  onPressItem?: (index: number) => void;
}

const MAX_TILES = 4;

/** Photo grid inside a media bubble. Four or more photos render as a 2×2 with
 * a `+N` badge on the last tile; three render as a row plus a full-width tile;
 * two as a single row. Outer corners come from the bubble's own clipping. */
export function ImageGrid({ sources, onPressItem }: ImageGridProps) {
  const styles = useStyles(makeStyles);
  const visible = sources.slice(0, MAX_TILES);
  const overflow = sources.length - visible.length;
  const rows: ImageSourcePropType[][] =
    visible.length === 3
      ? [visible.slice(0, 2), visible.slice(2)]
      : [visible.slice(0, 2), visible.slice(2, 4)].filter((r) => r.length > 0);

  let index = -1;

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((source) => {
            index += 1;
            const tileIndex = index;
            const isLastVisible = tileIndex === visible.length - 1;
            return (
              <Pressable
                key={tileIndex}
                style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
                onPress={onPressItem ? () => onPressItem(tileIndex) : undefined}
                disabled={!onPressItem}
                accessibilityRole={onPressItem ? 'imagebutton' : 'image'}
                accessibilityLabel={`Photo ${tileIndex + 1} of ${sources.length}`}
              >
                <Image source={source} style={styles.image} resizeMode="cover" />
                {isLastVisible && overflow > 0 && (
                  <>
                    <MediaScrim />
                    <View style={styles.overflowWrap} pointerEvents="none">
                      <Text style={[typography.headlineMd, styles.overflowLabel]}>
                        {`+${overflow}`}
                      </Text>
                    </View>
                  </>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  grid: {
    gap: GRID_GUTTER,
  },
  row: {
    flexDirection: 'row',
    gap: GRID_GUTTER,
  },
  tile: {
    flex: 1,
    aspectRatio: 4 / 3,
    overflow: 'hidden',
  },
  pressed: {
    opacity: states.pressedOpacity,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overflowWrap: {
    ...absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overflowLabel: {
    color: colors.onSurface,
  },
});
