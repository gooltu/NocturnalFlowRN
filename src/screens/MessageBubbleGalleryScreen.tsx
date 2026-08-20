import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  radius,
  spacing,
  typography,
  useStyles,
  useTheme,
  ThemeColors,
  MessageBubble,
  MessageContent,
  MessageContext,
  MessageDirection,
  QuotedContent,
} from '@nocturnalflow/design-system';

const img = (seed: string) => ({ uri: `https://picsum.photos/seed/${seed}/600/450` });
const sticker = require('../../assets/jewelbox.png');

const STATES: { direction: MessageDirection; context: MessageContext; label: string }[] = [
  { direction: 'outgoing', context: 'direct', label: 'Outgoing' },
  { direction: 'incoming', context: 'direct', label: 'Incoming' },
  { direction: 'incoming', context: 'group', label: 'Group' },
];

/** Body content for each of the 15 types. Reply types return text content plus
 * a `replyTo`; the rest return plain content. */
const TYPES: {
  n: number;
  title: string;
  content: (d: MessageDirection) => MessageContent;
  replyTo?: QuotedContent;
}[] = [
  { n: 1, title: 'Text', content: (d) => ({ kind: 'text', text: d === 'outgoing' ? 'On my way ✦ booked the corner table so we can actually hear each other.' : 'Are we still on for tonight?' }) },
  { n: 2, title: 'Single Image', content: () => ({ kind: 'image', source: img('rooftop') }) },
  { n: 3, title: 'Image Group', content: () => ({ kind: 'imageGroup', sources: [img('a'), img('b'), img('c'), img('d'), img('e'), img('f'), img('g')] }) },
  { n: 4, title: 'Text + Image', content: (d) => ({ kind: 'textImage', source: img('mugs'), caption: d === 'outgoing' ? 'Found the mugs you wanted.' : 'Rooftop, just before the rain.' }) },
  { n: 5, title: 'Sticker', content: () => ({ kind: 'sticker', source: sticker, size: 120 }) },
  { n: 6, title: 'GIF', content: () => ({ kind: 'gif', source: img('lights') }) },
  { n: 7, title: 'Video', content: () => ({ kind: 'video', thumbnail: img('concert'), duration: '0:42' }) },
  { n: 8, title: 'Voice Note', content: () => ({ kind: 'voice', duration: '0:14' }) },
  { n: 9, title: 'Reply · Text', content: () => ({ kind: 'text', text: 'Got it — the warm ramp reads much better at night.' }), replyTo: { kind: 'text', snippet: 'New palette is in the shared folder' } },
  { n: 10, title: 'Reply · Image', content: () => ({ kind: 'text', text: 'That light is unreal. Send me the full res?' }), replyTo: { kind: 'image', thumbnail: img('rooftop') } },
  { n: 11, title: 'Reply · Video', content: () => ({ kind: 'text', text: 'The drop at 0:19 is the one.' }), replyTo: { kind: 'video', thumbnail: img('concert'), duration: '0:42' } },
  { n: 12, title: 'Reply · Sticker', content: () => ({ kind: 'text', text: 'Same energy, honestly.' }), replyTo: { kind: 'sticker', source: sticker } },
  { n: 13, title: 'Reply · GIF', content: () => ({ kind: 'text', text: 'Sending this to the group immediately.' }), replyTo: { kind: 'gif', thumbnail: img('lights') } },
  { n: 14, title: 'Reply · Image Group', content: () => ({ kind: 'text', text: "The third one — that's the cover." }), replyTo: { kind: 'imageGroup', thumbnails: [img('a'), img('b'), img('c'), img('d')], count: 4 } },
  { n: 15, title: 'Reply · Voice Note', content: () => ({ kind: 'text', text: 'Heard it — booking the table now.' }), replyTo: { kind: 'voice', duration: '0:14' } },
];

const SENDERS = ['Maya Chen', 'Dev Rao', '+91 98110 22417'];

/** Visual index of every MessageBubble permutation — 15 content types × 3
 * layout states. Doubles as the usage reference for the component. */
export function MessageBubbleGalleryScreen() {
  const styles = useStyles(makeStyles);
  const { themeName, toggleTheme } = useTheme();
  return (
    <SafeAreaView style={styles.base} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[typography.headlineLgMobile, styles.title]}>Message Bubbles</Text>
        <Text style={[typography.bodyMd, styles.subtitle]}>
          15 content types × 3 layout states
        </Text>

        <Pressable
          onPress={toggleTheme}
          accessibilityRole="switch"
          accessibilityLabel={`Theme: ${themeName}. Tap to switch.`}
          style={styles.toggle}
        >
          <Text style={[typography.labelLg, styles.toggleLabel]}>
            {`Theme: ${themeName} · tap to switch`}
          </Text>
        </Pressable>

        {TYPES.map((type) => (
          <View key={type.n} style={styles.row}>
            <Text style={[typography.labelLg, styles.rowTitle]}>
              {String(type.n).padStart(2, '0')} · {type.title}
            </Text>
            {STATES.map((state, stateIndex) => (
              <MessageBubble
                key={state.label}
                direction={state.direction}
                context={state.context}
                senderName={SENDERS[stateIndex]}
                content={type.content(state.direction)}
                replyTo={
                  type.replyTo
                    ? { senderName: SENDERS[stateIndex], content: type.replyTo }
                    : undefined
                }
                timestamp={state.direction === 'outgoing' ? '21:04' : '21:02'}
                status="seen"
              />
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    gap: spacing.lg,
  },
  toggle: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  toggleLabel: {
    color: colors.primary,
  },
  title: {
    color: colors.onSurface,
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    marginTop: -spacing.md,
  },
  row: {
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  rowTitle: {
    color: colors.primary,
    marginBottom: spacing.xs,
  },
});
