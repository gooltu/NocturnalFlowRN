import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, states, typography } from '../../theme';

export interface VoiceNoteProps {
  duration: string;
  variant?: 'incoming' | 'outgoing';
  /** Relative bar heights (0-1) forming the waveform; a default pattern is used if omitted. */
  waveform?: number[];
}

const DEFAULT_WAVEFORM = [
  0.3, 0.6, 0.9, 0.5, 0.7, 1, 0.4, 0.6, 0.8, 0.3, 0.5, 0.9, 0.4, 0.7, 0.5, 0.3, 0.6, 0.8,
];

/** Voice message: play/pause control + waveform + duration label. */
export function VoiceNote({ duration, variant = 'outgoing', waveform = DEFAULT_WAVEFORM }: VoiceNoteProps) {
  const [playing, setPlaying] = useState(false);
  const isOutgoing = variant === 'outgoing';
  const fg = isOutgoing ? colors.onPrimaryContainer : colors.onSurface;
  const barColor = isOutgoing ? colors.onPrimaryContainer : colors.onSurfaceVariant;

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: isOutgoing ? colors.primaryContainer : colors.surfaceContainer },
      ]}
    >
      <Pressable
        onPress={() => setPlaying((p) => !p)}
        hitSlop={8}
        style={({ pressed }) => [
          styles.playButton,
          { backgroundColor: isOutgoing ? colors.onPrimaryContainer : colors.primary },
          pressed && { opacity: states.pressedOpacity },
        ]}
      >
        {playing ? (
          <Pause size={16} strokeWidth={2} color={isOutgoing ? colors.primaryContainer : colors.onPrimary} fill={isOutgoing ? colors.primaryContainer : colors.onPrimary} />
        ) : (
          <Play size={16} strokeWidth={2} color={isOutgoing ? colors.primaryContainer : colors.onPrimary} fill={isOutgoing ? colors.primaryContainer : colors.onPrimary} />
        )}
      </Pressable>

      <View style={styles.waveform}>
        {waveform.map((h, i) => (
          <View
            key={i}
            style={[styles.bar, { height: Math.max(3, h * 20), backgroundColor: barColor }]}
          />
        ))}
      </View>

      <Text style={[typography.labelSm, { color: fg }]}>{duration}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    minWidth: 200,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bar: {
    width: 2,
    borderRadius: 1,
  },
});
