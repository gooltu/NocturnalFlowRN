import React, { useEffect } from 'react';
import { Check, Pause, Play, Send, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  duration as durationTokens,
  easing,
  iconTokens,
  radius,
  spacing,
  states,
  typography,
  useThemeColors,
  useStyles,
  ThemeColors,
} from '../../../../theme';

export type RecorderPhase = 'recording' | 'reviewing';

export interface VoiceRecorderPanelProps {
  phase: RecorderPhase;
  elapsedSeconds: number;
  /** Relative bar heights (0-1). Grows live during recording; frozen once
   * review starts. */
  waveform: number[];
  isPreviewPlaying: boolean;
  /** Recording → reviewing. */
  onStop: () => void;
  /** Reviewing only — toggles the mock playback icon (no real audio). */
  onTogglePreview: () => void;
  /** Either phase — cancels and discards. */
  onDiscard: () => void;
  /** Reviewing only — commits. */
  onSend: () => void;
}

export function formatDuration(totalSeconds: number): string {
  const whole = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(whole / 60);
  const seconds = whole % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Replaces the composer row while recording/reviewing a voice note —
 * mirrors the record → stop → review → send flow common to WhatsApp/
 * Telegram/iMessage. Purely presentational: the mock timer and waveform
 * data live in `ChatInputBar`, this just renders whatever it's given. */
export function VoiceRecorderPanel({
  phase,
  elapsedSeconds,
  waveform,
  isPreviewPlaying,
  onStop,
  onTogglePreview,
  onDiscard,
  onSend,
}: VoiceRecorderPanelProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const isRecording = phase === 'recording';

  return (
    <View style={styles.base}>
      <Pressable
        onPress={onDiscard}
        hitSlop={4}
        accessibilityRole="button"
        accessibilityLabel="Discard recording"
        style={({ pressed }) => [styles.discardButton, pressed && { opacity: states.pressedOpacity }]}
      >
        <Trash2 size={iconTokens.sizeMd} strokeWidth={iconTokens.strokeWidth} color={colors.onErrorContainer} />
      </Pressable>

      <View style={styles.pill}>
        {isRecording ? (
          <>
            <PulsingDot />
            <Text style={[typography.labelLg, styles.timer]}>{formatDuration(elapsedSeconds)}</Text>
            <Bars values={waveform} color={colors.error} />
          </>
        ) : (
          <>
            <Pressable
              onPress={onTogglePreview}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={isPreviewPlaying ? 'Pause preview' : 'Play preview'}
            >
              {isPreviewPlaying ? (
                <Pause size={iconTokens.sizeMd} strokeWidth={iconTokens.strokeWidth} color={colors.primary} fill={colors.primary} />
              ) : (
                <Play size={iconTokens.sizeMd} strokeWidth={iconTokens.strokeWidth} color={colors.primary} fill={colors.primary} />
              )}
            </Pressable>
            <Bars values={waveform} color={colors.onSurfaceVariant} />
            <Text style={[typography.labelLg, styles.timer]}>{formatDuration(elapsedSeconds)}</Text>
          </>
        )}
      </View>

      <Pressable
        onPress={isRecording ? onStop : onSend}
        accessibilityRole="button"
        accessibilityLabel={isRecording ? 'Stop recording' : 'Send voice note'}
        style={({ pressed }) => [styles.actionButton, pressed && { opacity: states.pressedOpacity }]}
      >
        {isRecording ? (
          <Check size={iconTokens.sizeMd} strokeWidth={2} color={colors.onPrimary} />
        ) : (
          <Send size={iconTokens.sizeMd} strokeWidth={2} color={colors.onPrimary} />
        )}
      </Pressable>
    </View>
  );
}

/** Looping red dot signalling live recording — same pulse pattern as
 * `TypingIndicator`'s dots. */
function PulsingDot() {
  const styles = useStyles(makeStyles);
  const colors = useThemeColors();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: durationTokens.slow, easing: easing.standard }),
        withTiming(1, { duration: durationTokens.slow, easing: easing.standard })
      ),
      -1
    );
  }, [opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View style={[styles.dot, { backgroundColor: colors.error }, style]} />;
}

const MAX_BAR_HEIGHT = 20;

function Bars({ values, color }: { values: number[]; color: string }) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.barsRow}>
      {values.map((v, i) => (
        <View key={i} style={[styles.bar, { height: Math.max(3, v * MAX_BAR_HEIGHT), backgroundColor: color }]} />
      ))}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
  },
  discardButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timer: {
    color: colors.onSurface,
    minWidth: 32,
  },
  barsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    overflow: 'hidden',
  },
  bar: {
    width: 2,
    borderRadius: 1,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
  },
});
