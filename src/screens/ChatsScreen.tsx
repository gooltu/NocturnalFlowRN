import React, { useEffect, useState } from 'react';
import { Edit3, Search } from 'lucide-react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';
import { ChatListItem } from '../components/molecules/ChatListItem';
import { EmptyState } from '../components/organisms/EmptyState';
import { Header } from '../components/organisms/Header';
import { IconButton } from '../components/atoms/IconButton';
import { InputField } from '../components/atoms/InputField';
import { SkeletonRow } from '../components/organisms/SkeletonRow';
import { chats } from '../data/mockData';

export interface ChatsScreenProps {
  onOpenChat: (chatId: string) => void;
}

/** Chats list: search bar over a list of ChatListItem rows, with a brief
 * skeleton-loading state on mount and an EmptyState for no search results. */
export function ChatsScreen({ onOpenChat }: ChatsScreenProps) {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filtered = chats.filter((c) =>
    c.contact.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.base} edges={['top']}>
      <Header
        title="Chats"
        rightSlot={
          <View style={styles.headerActions}>
            <IconButton icon={Edit3} size="md" />
          </View>
        }
      />
      <View style={styles.searchWrap}>
        <InputField
          icon={Search}
          placeholder="Search messages"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {loading ? (
        <View>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </View>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No results"
          description={`Nothing matches "${query}". Try a different name.`}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ChatListItem
              name={item.contact.name}
              avatarInitials={item.contact.initials}
              presence={item.contact.presence}
              snippet={item.isTyping ? 'typing…' : item.snippet}
              timestamp={item.timestamp}
              unreadCount={item.unreadCount}
              onPress={() => onOpenChat(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerActions: {
    flexDirection: 'row',
  },
  searchWrap: {
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.sm,
  },
  listContent: {
    paddingBottom: 96,
  },
});
