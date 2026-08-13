import React, { useState } from 'react';
import { MoreVertical, Phone } from 'lucide-react-native';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { BubbleIncoming } from '../components/molecules/BubbleIncoming';
import { BubbleOutgoing } from '../components/molecules/BubbleOutgoing';
import { MediaBubble } from '../components/molecules/MediaBubble';
import { ReactionPill } from '../components/atoms/ReactionPill';
import { ReplyPreview } from '../components/molecules/ReplyPreview';
import { TypingIndicator } from '../components/molecules/TypingIndicator';
import { VoiceNote } from '../components/molecules/VoiceNote';
import { AttachmentSheet } from '../components/organisms/AttachmentSheet';
import { ChatInputBar } from '../components/organisms/ChatInputBar';
import { EmptyState } from '../components/organisms/EmptyState';
import { Header } from '../components/organisms/Header';
import { chats, MessageItem } from '../data/mockData';

export interface ConversationScreenProps {
  chatId: string;
  onBack: () => void;
}

/** A single conversation thread: header w/ contact presence, scrollable
 * message list (bubbles, media, voice notes, replies), typing indicator,
 * and a keyboard-avoiding composer with an attachment sheet. */
export function ConversationScreen({ chatId, onBack }: ConversationScreenProps) {
  const chat = chats.find((c) => c.id === chatId);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [localMessages, setLocalMessages] = useState<MessageItem[]>([]);

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
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.base} edges={[]}>
      <Header
        title={chat.contact.name}
        subtitle={chat.isTyping ? 'typing…' : chat.contact.presence === 'online' ? 'Online' : 'Offline'}
        presence={chat.contact.presence}
        onBack={onBack}
        avatar={{ initials: chat.contact.initials }}
        actions={[
          { key: 'call', label: `Call ${chat.contact.name}`, icon: Phone },
          { key: 'more', label: 'Conversation options', icon: MoreVertical },
        ]}
        gamebar={{ level: chat.contact.level, xpCurrent: chat.contact.xp, xpMax: chat.contact.xpMax }}
      />

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
          renderItem={({ item }) => <MessageRow item={item} />}
        />
      )}

      <ChatInputBar onSend={handleSend} onAttach={() => setSheetVisible(true)} />
      <AttachmentSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} />
    </SafeAreaView>
  );
}

function MessageRow({ item }: { item: MessageItem }) {
  if (item.type === 'divider') {
    return (
      <View style={styles.divider}>
        <Text style={[typography.labelSm, styles.dividerLabel]}>{item.label}</Text>
      </View>
    );
  }

  const align = item.sender === 'me' ? 'flex-end' : 'flex-start';

  if (item.type === 'text') {
    return (
      <View style={[styles.messageWrap, { alignItems: align }]}>
        {item.replyTo && (
          <View style={styles.replyWrap}>
            <ReplyPreview senderName={item.replyTo.senderName} snippet={item.replyTo.snippet} />
          </View>
        )}
        {item.sender === 'me' ? (
          <BubbleOutgoing text={item.text} timestamp={item.timestamp} status={item.status ?? 'sent'} />
        ) : (
          <BubbleIncoming text={item.text} timestamp={item.timestamp} />
        )}
      </View>
    );
  }

  if (item.type === 'media') {
    return (
      <View style={[styles.messageWrap, { alignItems: align }]}>
        <MediaBubble
          source={{ uri: item.imageUri }}
          caption={item.caption}
          timestamp={item.timestamp}
          variant={item.sender === 'me' ? 'outgoing' : 'incoming'}
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

  return (
    <View style={[styles.messageWrap, { alignItems: align }]}>
      <VoiceNote duration={item.duration} variant={item.sender === 'me' ? 'outgoing' : 'incoming'} />
    </View>
  );
}

const styles = StyleSheet.create({
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
  replyWrap: {
    marginBottom: 4,
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
