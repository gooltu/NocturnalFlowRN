import React from 'react';
import { LucideIcon, UserPlus, Users } from 'lucide-react-native';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  iconTokens,
  spacing,
  states,
  typography,
  useStyles,
  useThemeColors,
  ThemeColors,
  PresenceState,
  Avatar,
} from '@nocturnalflow/design-system';
import { chats } from '../data/mockData';

/** Contact picker for starting a new conversation: a "New Contact"/"New Group"
 * action bar above a list of every known contact (reusing the chat records'
 * contacts — there's no separate contacts dataset), which opens that
 * contact's existing chat on tap. Title/gamebar are set statically on the
 * `SelectContacts` route in RootNavigator (no route-param dependency). */
export function SelectContactsScreen() {
  const styles = useStyles(makeStyles);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.base} edges={[]}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.actionsWrap}>
            <ActionRow icon={UserPlus} label="New Contact" />
            <ActionRow icon={Users} label="New Group" />
          </View>
        }
        renderItem={({ item }) => (
          <ContactRow
            name={item.contact.name}
            initials={item.contact.initials}
            presence={item.contact.presence}
            onPress={() => navigation.navigate('Conversation', { chatId: item.id })}
          />
        )}
      />
    </SafeAreaView>
  );
}

interface ActionRowProps {
  icon: LucideIcon;
  label: string;
  onPress?: () => void;
}

function ActionRow({ icon: Icon, label, onPress }: ActionRowProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: states.pressedOpacity }]}
    >
      <View style={styles.actionIcon}>
        <Icon size={iconTokens.sizeLg} strokeWidth={iconTokens.strokeWidth} color={colors.primary} />
      </View>
      <Text style={[typography.headlineMd, styles.name]}>{label}</Text>
    </Pressable>
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
  actionsWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
    marginBottom: spacing.xs,
    paddingBottom: spacing.xs,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
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
