import React, { useState } from 'react';
import { Pause, Play } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { iconTokens, spacing, states, typography, useThemeColors } from '../../../../theme';
import { bubbleSkin } from '../bubbleTheme';
import { MessageDirection, VoiceMessageContent } from '../types';
import { DEFAULT_WAVEFORM, Waveform } from './Waveform';

export interface VoiceContentProps {
  direction: MessageDirection;
  content: VoiceMessageContent;
}

/** Voice-note row: play/pause control, waveform, duration. Playback can be
 * driven from outside (`playing` + `onTogglePlay`) or left to the row's own
 * local state. */
export function VoiceContent({ direction, content }: VoiceContentProps) {
  const colors = useThemeColors();
  const skin = bubbleSkin(colors, direction);
  const [localPlaying, setLocalPlaying] = useState(false);
  const controlled = content.playing != null;
  const playing = controlled ? content.playing! : localPlaying;

  const toggle = () => {
    content.onTogglePlay?.();
    if (!controlled) setLocalPlaying((p) => !p);
  };

  const Glyph = playing ? Pause : Play;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={toggle}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pause voice message' : 'Play voice message'}
        style={({ pressed }) => [
          styles.playButton,
          { backgroundColor: skin.playFill },
          pressed && { opacity: states.pressedOpacity },
        ]}
      >
        <Glyph
          size={iconTokens.sizeSm}
          strokeWidth={iconTokens.strokeWidth}
          color={skin.playGlyph}
          fill={skin.playGlyph}
        />
      </Pressable>

      <Waveform
        bars={content.waveform ?? DEFAULT_WAVEFORM}
        color={skin.wave}
        progress={content.progress ?? 0.4}
      />

      <Text style={[typography.labelSm, { color: skin.meta }]}>{content.duration}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterChat,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
