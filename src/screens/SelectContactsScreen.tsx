import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  spacing,
  states,
  typography,
  useStyles,
  ThemeColors,
  PresenceState,
  Avatar,
  Header,
} from '@nocturnalflow/design-system';
import { chats } from '../data/mockData';

export interface SelectContactsScreenProps {
  onBack: () => void;
  onSelectContact: (chatId: string) => void;
}

/** Contact picker for starting a new conversation: lists every known contact
 * (reusing the chat records' contacts — there's no separate contacts
 * dataset) and opens that contact's existing chat on tap. */
export function SelectContactsScreen({ onBack, onSelectContact }: SelectContactsScreenProps) {
  const styles = useStyles(makeStyles);

  return (
    <SafeAreaView style={styles.base} edges={[]}>
      <Header title="New Message" onBack={onBack} />
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ContactRow
            name={item.contact.name}
            initials={item.contact.initials}
            presence={item.contact.presence}
            onPress={() => onSelectContact(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

interface ContactRowProps {
  name: string;
  initials: string;
  presence: PresenceState;
  onPress: () => void;
}

function ContactRow({ name, initials, presence, onPress }: ContactRowProps) {
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: states.pressedOpacity }]}
    >
      <Avatar initials={initials} presence={presence} size={48} />
      <View style={styles.body}>
        <Text style={[typography.headlineMd, styles.name]}>{name}</Text>
        <Text style={[typography.bodyMd, styles.presence]}>
          {presence === 'online' ? 'Online' : 'Offline'}
        </Text>
      </View>
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.sm,
    gap: spacing.sm + 2,
    minHeight: 44,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: colors.onSurface,
  },
  presence: {
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
});
