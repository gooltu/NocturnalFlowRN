import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, states, typography, useThemeColors } from '../../theme';
import { SVGIconName, SVGImageIcon } from '../atoms/SVGImageIcon';

export interface VoiceNoteProps {
  duration: string;
  variant?: 'incoming' | 'outgoing';
  /** Relative bar heights (0-1) forming the waveform; a default pattern is used if omitted. */
  waveform?: number[];
  icon?: SVGIconName;
}

const DEFAULT_WAVEFORM = [
  0.3, 0.6, 0.9, 0.5, 0.7, 1, 0.4, 0.6, 0.8, 0.3, 0.5, 0.9, 0.4, 0.7, 0.5, 0.3, 0.6, 0.8,
];

/** Voice message: play/pause control + waveform + duration label. When
 * incoming, a vector `SVGImageIcon` sits outside the bubble to its left,
 * vertically centered, standing in for the sender's avatar. */
export function VoiceNote({ duration, variant = 'outgoing', waveform = DEFAULT_WAVEFORM, icon = 'logo' }: VoiceNoteProps) {
  const colors = useThemeColors();
  const [playing, setPlaying] = useState(false);
  const isOutgoing = variant === 'outgoing';
  const fg = isOutgoing ? colors.onPrimaryContainer : colors.onSurface;
  const barColor = isOutgoing ? colors.onPrimaryContainer : colors.onSurfaceVariant;

  const bubble = (
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

  if (isOutgoing) return bubble;

  return (
    <View style={styles.row}>
      <SVGImageIcon icon={icon} size={28} />
      {bubble}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
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
