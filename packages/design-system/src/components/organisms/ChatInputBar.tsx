import React, { useState } from 'react';
import { Mic, Plus, Send } from 'lucide-react-native';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { iconTokens, radius, spacing, states, typography, useThemeColors, useStyles, ThemeColors } from '../../theme';
import { IconButton } from '../atoms/IconButton';

export interface ChatInputBarProps {
  onSend?: (text: string) => void;
  onAttach?: () => void;
}

/** Fixed bottom composer: attachment icon, text input, and a send/mic button
 * that swaps based on whether there's text. Wrapped in KeyboardAvoidingView
 * per platform, since this is the most failure-prone piece of a messenger UI. */
export function ChatInputBar({ onSend, onAttach }: ChatInputBarProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();
  const hasText = text.trim().length > 0;

  const handleSend = () => {
    if (!hasText) return;
    onSend?.(text.trim());
    setText('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.base, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        <IconButton icon={Plus} onPress={onAttach} size="lg" />
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message"
          placeholderTextColor={colors.onSurfaceVariant}
          multiline
          style={[typography.bodyLg, styles.input]}
        />
        <Pressable
          onPress={hasText ? handleSend : undefined}
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
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.marginMobile,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
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
