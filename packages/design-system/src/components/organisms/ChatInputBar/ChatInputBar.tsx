import React, { useEffect, useRef, useState } from 'react';
import { Mic, Plus, Send, Smile, X } from 'lucide-react-native';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { iconTokens, radius, spacing, states, typography, useThemeColors, useStyles, ThemeColors } from '../../../theme';
import { IconButton } from '../../atoms/IconButton';
import { describeQuotedContent } from '../../molecules/MessageBubble/parts/QuoteBlock';
import { QuotedMessage } from '../../molecules/MessageBubble/types';
import { EmojiGifPanel } from './parts/EmojiGifPanel';
import { formatDuration, RecorderPhase, VoiceRecorderPanel } from './parts/VoiceRecorderPanel';
import { ChatInputBarProps, PickerMediaItem } from './types';

/** How often the mock recorder ticks — drives both the elapsed-time counter
 * and a new fake waveform bar, so the two stay in lockstep. */
const RECORDER_TICK_MS = 120;
/** Sliding window of bars kept while recording — older ones fall off so the
 * row doesn't grow unbounded. */
const MAX_WAVEFORM_BARS = 40;

/** Fixed bottom composer: an optional reply bar (quoted message + close
 * button), an emoji-face button that toggles an emoji/sticker/GIF panel in
 * place of the native keyboard, attachment icon, text input, and a send/mic
 * button that swaps based on whether there's text. Wrapped in
 * KeyboardAvoidingView per platform, since this is the most failure-prone
 * piece of a messenger UI. */
export function ChatInputBar({
  onSend,
  onAttach,
  replyTo,
  onCancelReply,
  stickers,
  gifs,
  onSendSticker,
  onSendGif,
  onSendVoiceNote,
  onRecordingStart,
  onRecordingStop,
  onDiscardRecording,
  previewPlaying,
  onTogglePreviewPlayback,
}: ChatInputBarProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const [text, setText] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [recorderPhase, setRecorderPhase] = useState<RecorderPhase | 'idle'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [waveform, setWaveform] = useState<number[]>([]);
  const [internalPreviewPlaying, setInternalPreviewPlaying] = useState(false);
  const isPreviewControlled = previewPlaying !== undefined;
  const isPreviewPlaying = isPreviewControlled ? previewPlaying : internalPreviewPlaying;
  const insets = useSafeAreaInsets();
  const hasText = text.trim().length > 0;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (recorderPhase !== 'recording') return;
    const interval = setInterval(() => {
      setElapsedSeconds((s) => s + RECORDER_TICK_MS / 1000);
      setWaveform((prev) => [...prev.slice(-(MAX_WAVEFORM_BARS - 1)), Math.random() * 0.7 + 0.3]);
    }, RECORDER_TICK_MS);
    return () => clearInterval(interval);
  }, [recorderPhase]);

  const handleSend = () => {
    if (!hasText) return;
    onSend?.(text.trim());
    setText('');
  };

  const handleToggleEmoji = () => {
    if (panelOpen) {
      setPanelOpen(false);
      inputRef.current?.focus();
    } else {
      inputRef.current?.blur();
      setPanelOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (panelOpen) setPanelOpen(false);
  };

  const handleSelectSticker = (item: PickerMediaItem) => {
    onSendSticker?.(item);
    setPanelOpen(false);
  };

  const handleSelectGif = (item: PickerMediaItem) => {
    onSendGif?.(item);
    setPanelOpen(false);
  };

  const handleMicPress = () => {
    setPanelOpen(false);
    inputRef.current?.blur();
    setElapsedSeconds(0);
    setWaveform([]);
    setRecorderPhase('recording');
    onRecordingStart?.();
  };

  const handleStopRecording = () => {
    setRecorderPhase('reviewing');
    onRecordingStop?.();
  };

  const resetRecorderState = () => {
    setRecorderPhase('idle');
    setElapsedSeconds(0);
    setWaveform([]);
    setInternalPreviewPlaying(false);
  };

  const handleDiscardRecording = () => {
    resetRecorderState();
    onDiscardRecording?.();
  };

  const handleTogglePreview = () => {
    if (isPreviewControlled) {
      onTogglePreviewPlayback?.();
    } else {
      setInternalPreviewPlaying((p) => !p);
    }
  };

  const handleSendVoiceNote = () => {
    onSendVoiceNote?.({ duration: formatDuration(elapsedSeconds), waveform });
    resetRecorderState();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {replyTo && (
        <View style={styles.replyBar}>
          <View style={styles.replyAccent} />
          <View style={styles.replyText}>
            <Text style={[typography.labelLg, styles.replySender]} numberOfLines={1}>
              {replyTo.senderName}
            </Text>
            <ReplySnippet content={replyTo.content} />
          </View>
          <Pressable onPress={onCancelReply} hitSlop={8} accessibilityLabel="Cancel reply">
            {({ pressed }) => (
              <X
                size={iconTokens.sizeMd}
                strokeWidth={iconTokens.strokeWidth}
                color={colors.onSurfaceVariant}
                opacity={pressed ? states.pressedOpacity : 1}
              />
            )}
          </Pressable>
        </View>
      )}
      {recorderPhase !== 'idle' ? (
        <VoiceRecorderPanel
          phase={recorderPhase}
          elapsedSeconds={elapsedSeconds}
          waveform={waveform}
          isPreviewPlaying={isPreviewPlaying}
          onStop={handleStopRecording}
          onTogglePreview={handleTogglePreview}
          onDiscard={handleDiscardRecording}
          onSend={handleSendVoiceNote}
        />
      ) : (
        <View style={[styles.base, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
          <View style={styles.attachSlot}>
            <IconButton icon={Smile} onPress={handleToggleEmoji} size="lg" active={panelOpen} />
          </View>
          <View style={styles.attachSlot}>
            <IconButton icon={Plus} onPress={onAttach} size="lg" />
          </View>
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            onFocus={handleInputFocus}
            placeholder="Message"
            placeholderTextColor={colors.onSurfaceVariant}
            multiline
            style={[typography.bodyLg, styles.input]}
          />
          <Pressable
            onPress={hasText ? handleSend : handleMicPress}
            hitSlop={8}
            style={({ pressed }) => [styles.sendButton, pressed && { opacity: states.pressedOpacity }]}
          >
            {hasText ? (
              <Send size={iconTokens.sizeMd} strokeWidth={2} color={colors.onPrimary} />
            ) : (
              <Mic size={iconTokens.sizeMd} strokeWidth={2} color={colors.onPrimary} />
            )}
          </Pressable>
        </View>
      )}

      {panelOpen && (
        <EmojiGifPanel
          onSelectEmoji={(emoji) => setText((prev) => prev + emoji)}
          stickers={stickers}
          gifs={gifs}
          onSelectSticker={handleSelectSticker}
          onSelectGif={handleSelectGif}
        />
      )}
    </KeyboardAvoidingView>
  );
}

function ReplySnippet({ content }: { content: QuotedMessage['content'] }) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const { label, Glyph } = describeQuotedContent(content);
  return (
    <View style={styles.replySnippetRow}>
      {Glyph && <Glyph size={13} strokeWidth={iconTokens.strokeWidth} color={colors.onSurfaceVariant} />}
      <Text style={[typography.bodyMd, styles.replySnippet]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
  },
  replyAccent: {
    width: 2,
    alignSelf: 'stretch',
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  replyText: {
    flex: 1,
    gap: 2,
    paddingVertical: 2,
  },
  replySender: {
    color: colors.primary,
  },
  replySnippetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  replySnippet: {
    flexShrink: 1,
    color: colors.onSurfaceVariant,
  },
  attachSlot: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: colors.onSurface,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    maxHeight: 120,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 0,
  },
});
