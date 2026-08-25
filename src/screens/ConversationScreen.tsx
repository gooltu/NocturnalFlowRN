import React, { useLayoutEffect, useState } from 'react';
import { MoreVertical, Phone } from 'lucide-react-native';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  spacing,
  typography,
  useStyles,
  ThemeColors,
  MessageBubble,
  MessageContext,
  PickerMediaItem,
  QuotedContent,
  QuotedMessage,
  ReactionPill,
  TypingIndicator,
  AttachmentSheet,
  ChatInputBar,
  EmptyState,
} from '@nocturnalflow/design-system';
import { chats, MessageItem } from '../data/mockData';
import { useMediaPicker } from '../hooks/useMediaPicker';
import { useVoiceMessagePlayer } from '../hooks/useVoiceMessagePlayer';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import type { RootStackParamList } from '../navigation/types';

/** A single conversation thread: header w/ contact presence, scrollable
 * message list (bubbles, media, voice notes, replies), typing indicator,
 * and a keyboard-avoiding composer with an attachment sheet. */
export function ConversationScreen() {
  const styles = useStyles(makeStyles);
  const navigation = useNavigation();
  const { chatId } = useRoute<RouteProp<RootStackParamList, 'Conversation'>>().params;
  const chat = chats.find((c) => c.id === chatId);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [localMessages, setLocalMessages] = useState<MessageItem[]>([]);
  const [replyingTo, setReplyingTo] = useState<{ id: string; senderName: string; content: QuotedContent } | null>(
    null
  );
  const gifs = useMediaPicker('gifs');
  const stickers = useMediaPicker('stickers');
  const voiceRecorder = useVoiceRecorder();
  const [pendingVoiceUri, setPendingVoiceUri] = useState<string | null>(null);
  const previewPlayer = useVoiceMessagePlayer(pendingVoiceUri ?? undefined);

  // Must run unconditionally, before the `if (!chat)` early return below —
  // this codebase previously hit a "Rendered fewer hooks than expected"
  // error from an early return placed ahead of a hook.
  useLayoutEffect(() => {
    if (!chat) return;
    navigation.setOptions({
      title: chat.contact.name,
      headerProps: {
        subtitle: chat.isTyping ? 'typing…' : chat.contact.presence === 'online' ? 'Online' : 'Offline',
        presence: chat.contact.presence,
        avatar: { initials: chat.contact.initials },
        actions: [
          { key: 'call', label: `Call ${chat.contact.name}`, icon: Phone },
          { key: 'more', label: 'Conversation options', icon: MoreVertical },
        ],
        gamebar: { level: chat.contact.level, xpCurrent: chat.contact.xp, xpMax: chat.contact.xpMax },
      },
    });
  }, [chat, navigation]);

  if (!chat) return null;

  const messages = [...chat.messages, ...localMessages];

  const handleSend = (text: string) => {
    setLocalMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        type: 'text',
        sender: 'me',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        replyToId: replyingTo?.id,
      },
    ]);
    setReplyingTo(null);
  };

  const handleSendMedia = (type: 'sticker' | 'gif', item: PickerMediaItem) => {
    setLocalMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        type,
        sender: 'me',
        imageUri: item.fullUri,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleRecordingStart = () => {
    voiceRecorder.start();
  };

  const handleRecordingStop = async () => {
    setPendingVoiceUri(await voiceRecorder.stop());
  };

  const handleDiscardRecording = () => {
    voiceRecorder.discard();
    setPendingVoiceUri(null);
  };

  const handleSendVoiceNote = ({ duration, waveform }: { duration: string; waveform: number[] }) => {
    setLocalMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        type: 'voice',
        sender: 'me',
        duration,
        waveform,
        uri: pendingVoiceUri ?? undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setPendingVoiceUri(null);
  };

  return (
    <SafeAreaView style={styles.base} edges={[]}>
      {messages.length === 0 ? (
        <View style={styles.emptyWrap}>
          <EmptyState
            title="No messages yet"
            description="Start the conversation — your first message will appear right here."
            actionLabel="Say hello"
            onAction={() => handleSend('Hello!')}
          />
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={chat.isTyping ? <TypingIndicator /> : null}
          renderItem={({ item }) => (
            <MessageRow
              item={item}
              messages={messages}
              contactName={chat.contact.name}
              context={chat.context ?? 'direct'}
              onSwipeReply={setReplyingTo}
            />
          )}
        />
      )}

      <ChatInputBar
        onSend={handleSend}
        onAttach={() => setSheetVisible(true)}
        replyTo={replyingTo ?? undefined}
        onCancelReply={() => setReplyingTo(null)}
        stickers={stickers}
        gifs={gifs}
        onSendSticker={(item) => handleSendMedia('sticker', item)}
        onSendGif={(item) => handleSendMedia('gif', item)}
        onSendVoiceNote={handleSendVoiceNote}
        onRecordingStart={handleRecordingStart}
        onRecordingStop={handleRecordingStop}
        onDiscardRecording={handleDiscardRecording}
        {...(pendingVoiceUri
          ? { previewPlaying: previewPlayer.playing, onTogglePreviewPlayback: previewPlayer.toggle }
          : {})}
      />
      <AttachmentSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} />
    </SafeAreaView>
  );
}

interface MessageRowProps {
  item: MessageItem;
  messages: MessageItem[];
  contactName: string;
  context: MessageContext;
  onSwipeReply: (quoted: { id: string; senderName: string; content: QuotedContent }) => void;
}

/** Given a swiped message, the quote it should appear as in the reply bar —
 * mirrors `MessageItem.replyTo`'s text-only shape for text messages, and
 * describes media/voice by kind since there's nothing richer to quote them
 * with here (matches the existing reply feature's fidelity). */
function quotedContentFor(
  item: Extract<
    MessageItem,
    {
      type:
        | 'text'
        | 'media'
        | 'voice'
        | 'sticker'
        | 'gif'
        | 'video'
        | 'document'
        | 'location'
        | 'contact'
        | 'link';
    }
  >
): QuotedContent {
  if (item.type === 'text') return { kind: 'text', snippet: item.text };
  if (item.type === 'media') return { kind: 'image', thumbnail: { uri: item.imageUri } };
  if (item.type === 'sticker') return { kind: 'sticker', source: { uri: item.imageUri } };
  if (item.type === 'gif') return { kind: 'gif', thumbnail: { uri: item.imageUri } };
  if (item.type === 'video') return { kind: 'video', thumbnail: { uri: item.thumbnailUri }, duration: item.duration };
  if (item.type === 'document') return { kind: 'document', fileName: item.fileName };
  if (item.type === 'location') return { kind: 'location', label: item.label };
  if (item.type === 'contact') return { kind: 'contact', name: item.name };
  if (item.type === 'link') return { kind: 'link', title: item.title, url: item.url };
  return { kind: 'voice', duration: item.duration };
}

/** Resolves a message's `replyToId` (if any) against the full message list
 * into the `QuotedMessage` `MessageBubble` needs — reused for every content
 * kind, static mock replies and live composer replies alike, since both just
 * store a target id. */
function resolveReplyTo(
  item: MessageItem,
  messages: MessageItem[],
  contactName: string
): QuotedMessage | undefined {
  if (item.type === 'divider' || !item.replyToId) return undefined;
  const target = messages.find((m) => m.id === item.replyToId);
  if (!target || target.type === 'divider') return undefined;
  return {
    senderName: target.sender === 'me' ? 'You' : target.senderName ?? contactName,
    content: quotedContentFor(target),
  };
}

function MessageRow({ item, messages, contactName, context, onSwipeReply }: MessageRowProps) {
  const styles = useStyles(makeStyles);
  // Called unconditionally, before the `if (item.type === 'divider')` early
  // return below — this codebase previously hit a "Rendered fewer hooks
  // than expected" error from a hook placed after an early return.
  const voicePlayer = useVoiceMessagePlayer(item.type === 'voice' ? item.uri : undefined);

  if (item.type === 'divider') {
    return (
      <View style={styles.divider}>
        <Text style={[typography.labelSm, styles.dividerLabel]}>{item.label}</Text>
      </View>
    );
  }

  const align = item.sender === 'me' ? 'flex-end' : 'flex-start';
  const replyTo = resolveReplyTo(item, messages, contactName);
  const senderName = item.sender === 'them' ? item.senderName : undefined;
  const handleSwipeReply = () =>
    onSwipeReply({
      id: item.id,
      senderName: item.sender === 'me' ? 'You' : item.senderName ?? contactName,
      content: quotedContentFor(item),
    });

  if (item.type === 'text') {
    return (
      <View style={[styles.messageWrap, { alignItems: align }]}>
        <MessageBubble
          direction={item.sender === 'me' ? 'outgoing' : 'incoming'}
          context={context}
          senderName={senderName}
          content={{ kind: 'text', text: item.text }}
          timestamp={item.timestamp}
          status={item.sender === 'me' ? item.status ?? 'sent' : undefined}
          replyTo={replyTo}
          onSwipeReply={handleSwipeReply}
        />
      </View>
    );
  }

  if (item.type === 'media') {
    return (
      <View style={[styles.messageWrap, { alignItems: align }]}>
        <MessageBubble
          direction={item.sender === 'me' ? 'outgoing' : 'incoming'}
          context={context}
          senderName={senderName}
          content={
            item.caption
              ? { kind: 'textImage', source: { uri: item.imageUri }, caption: item.caption }
              : { kind: 'image', source: { uri: item.imageUri } }
          }
          timestamp={item.timestamp}
          replyTo={replyTo}
          onSwipeReply={handleSwipeReply}
        />
        {item.reactions && (
          <View style={styles.reactionsRow}>
            {item.reactions.map((r) => (
              <ReactionPill key={r.emoji} emoji={r.emoji} count={r.count} />
            ))}
          </View>
        )}
      </View>
    );
  }

  if (item.type === 'sticker') {
    return (
      <View style={[styles.messageWrap, { alignItems: align }]}>
        <MessageBubble
          direction={item.sender === 'me' ? 'outgoing' : 'incoming'}
          context={context}
          senderName={senderName}
          content={{ kind: 'sticker', source: { uri: item.imageUri } }}
          timestamp={item.timestamp}
          replyTo={replyTo}
          onSwipeReply={handleSwipeReply}
        />
      </View>
    );
  }

  if (item.type === 'gif') {
    return (
      <View style={[styles.messageWrap, { alignItems: align }]}>
        <MessageBubble
          direction={item.sender === 'me' ? 'outgoing' : 'incoming'}
          context={context}
          senderName={senderName}
          content={{ kind: 'gif', source: { uri: item.imageUri } }}
          timestamp={item.timestamp}
          replyTo={replyTo}
          onSwipeReply={handleSwipeReply}
        />
      </View>
    );
  }

  if (item.type === 'video') {
    return (
      <View style={[styles.messageWrap, { alignItems: align }]}>
        <MessageBubble
          direction={item.sender === 'me' ? 'outgoing' : 'incoming'}
          context={context}
          senderName={senderName}
          content={{ kind: 'video', thumbnail: { uri: item.thumbnailUri }, duration: item.duration }}
          timestamp={item.timestamp}
          replyTo={replyTo}
          onSwipeReply={handleSwipeReply}
        />
      </View>
    );
  }

  if (item.type === 'document') {
    return (
      <View style={[styles.messageWrap, { alignItems: align }]}>
        <MessageBubble
          direction={item.sender === 'me' ? 'outgoing' : 'incoming'}
          context={context}
          senderName={senderName}
          content={{
            kind: 'document',
            fileName: item.fileName,
            fileSize: item.fileSize,
            fileType: item.fileType,
            status: item.status,
          }}
          timestamp={item.timestamp}
          replyTo={replyTo}
          onSwipeReply={handleSwipeReply}
        />
      </View>
    );
  }

  if (item.type === 'location') {
    return (
      <View style={[styles.messageWrap, { alignItems: align }]}>
        <MessageBubble
          direction={item.sender === 'me' ? 'outgoing' : 'incoming'}
          context={context}
          senderName={senderName}
          content={{
            kind: 'location',
            label: item.label,
            address: item.address,
            mapImage: item.mapImageUri ? { uri: item.mapImageUri } : undefined,
            status: item.status,
          }}
          timestamp={item.timestamp}
          replyTo={replyTo}
          onSwipeReply={handleSwipeReply}
        />
      </View>
    );
  }

  if (item.type === 'contact') {
    return (
      <View style={[styles.messageWrap, { alignItems: align }]}>
        <MessageBubble
          direction={item.sender === 'me' ? 'outgoing' : 'incoming'}
          context={context}
          senderName={senderName}
          content={{
            kind: 'contact',
            name: item.name,
            subtitle: item.subtitle,
            avatar: item.avatarUri ? { uri: item.avatarUri } : undefined,
            initials: item.initials,
            status: item.status,
          }}
          timestamp={item.timestamp}
          replyTo={replyTo}
          onSwipeReply={handleSwipeReply}
        />
      </View>
    );
  }

  if (item.type === 'link') {
    return (
      <View style={[styles.messageWrap, { alignItems: align }]}>
        <MessageBubble
          direction={item.sender === 'me' ? 'outgoing' : 'incoming'}
          context={context}
          senderName={senderName}
          content={{
            kind: 'link',
            url: item.url,
            title: item.title,
            description: item.description,
            image: item.imageUri ? { uri: item.imageUri } : undefined,
            siteName: item.siteName,
            status: item.status,
          }}
          timestamp={item.timestamp}
          replyTo={replyTo}
          onSwipeReply={handleSwipeReply}
        />
      </View>
    );
  }

  return (
    <View style={[styles.messageWrap, { alignItems: align }]}>
      <MessageBubble
        direction={item.sender === 'me' ? 'outgoing' : 'incoming'}
        context={context}
        senderName={senderName}
        content={{
          kind: 'voice',
          duration: item.duration,
          waveform: item.waveform,
          ...(item.uri
            ? { playing: voicePlayer.playing, progress: voicePlayer.progress, onTogglePlay: voicePlayer.toggle }
            : {}),
        }}
        timestamp={item.timestamp}
        replyTo={replyTo}
        onSwipeReply={handleSwipeReply}
      />
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  messageWrap: {
    marginBottom: spacing.xs,
  },
  divider: {
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  dividerLabel: {
    color: colors.onSurfaceVariant,
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: 4,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
  },
});
