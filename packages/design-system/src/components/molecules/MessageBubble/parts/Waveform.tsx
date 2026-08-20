import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface WaveformProps {
  /** Relative bar heights, 0-1. */
  bars: number[];
  color: string;
  /** 0-1 playback position; bars before it stay fully opaque. */
  progress: number;
}

export const DEFAULT_WAVEFORM = [
  0.33, 0.6, 0.87, 0.47, 1, 0.73, 0.4, 0.87, 0.6, 0.93, 0.53, 0.33, 0.67, 0.87, 0.47, 0.27,
  0.6, 0.8, 0.4, 0.53,
];

const MAX_BAR_HEIGHT = 30;
const MIN_BAR_HEIGHT = 8;
const UNPLAYED_OPACITY = 0.45;

/** Voice-note waveform. Bars up to `progress` render at full opacity, the rest
 * recede — playback position is the only thing separating them. */
export function Waveform({ bars, color, progress }: WaveformProps) {
  const playedCount = Math.round(bars.length * Math.min(Math.max(progress, 0), 1));

  return (
    <View style={styles.wrap}>
      {bars.map((value, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              height: Math.max(MIN_BAR_HEIGHT, value * MAX_BAR_HEIGHT),
              backgroundColor: color,
              opacity: index < playedCount ? 1 : UNPLAYED_OPACITY,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 32,
  },
  bar: {
    width: 3,
    borderRadius: 1.5,
  },
});
