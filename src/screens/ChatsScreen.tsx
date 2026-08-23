import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Edit3, MoreVertical, Search } from 'lucide-react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  spacing,
  useStyles,
  ThemeColors,
  ChatListItem,
  EmptyState,
  FloatingButton,
  InputField,
  SkeletonRow,
} from '@nocturnalflow/design-system';
import { chats, currentUser } from '../data/mockData';
import '../navigation/types';

const crateIcon = require('../../assets/jewelbox.png');
const gemIcon = require('../../assets/factory.png');

/** Chats list: search bar over a list of ChatListItem rows, with a brief
 * skeleton-loading state on mount and an EmptyState for no search results.
 * A floating "new message" button sits bottom-right, above the tab bar. */
export function ChatsScreen() {
  const styles = useStyles(makeStyles);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chats',
      headerProps: {
        actions: [
          { key: 'crates', label: `${currentUser.crates} crates`, image: crateIcon },
          { key: 'gems', label: `${currentUser.gems} gems`, image: gemIcon },
          { key: 'more', label: 'Chats options', icon: MoreVertical },
        ],
        gamebar: { level: currentUser.level, xpCurrent: currentUser.xp, xpMax: currentUser.xpMax },
      },
    });
  }, [navigation]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  const filtered = chats.filter((c) =>
    c.contact.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <SafeAreaView style={styles.base} edges={[]}>
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
              onPress={() => navigation.navigate('Conversation', { chatId: item.id })}
            />
          )}
        />
      )}

      <FloatingButton
        icon={Edit3}
        label="New message"
        onPress={() => navigation.navigate('SelectContacts')}
        style={styles.fab}
      />
    </SafeAreaView>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchWrap: {
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.sm,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.lg,
  },
});
