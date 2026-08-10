import React from 'react';
import { ImageSourcePropType, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, states, typography } from '../../theme';
import { Avatar, PresenceState } from '../atoms/Avatar';
import { UnreadBadge } from '../atoms/UnreadBadge';

export interface ChatListItemProps {
  name: string;
  snippet: string;
  timestamp: string;
  avatarSource?: ImageSourcePropType;
  avatarInitials: string;
  presence?: PresenceState;
  unreadCount?: number;
  onPress?: () => void;
}

/** Horizontal chat-list row: 48px avatar w/ presence, title + snippet stack,
 * trailing timestamp and unread badge. */
export function ChatListItem({
  name,
  snippet,
  timestamp,
  avatarSource,
  avatarInitials,
  presence = 'none',
  unreadCount = 0,
  onPress,
}: ChatListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.base, pressed && { opacity: states.pressedOpacity }]}
    >
      <Avatar source={avatarSource} initials={avatarInitials} presence={presence} size={48} />
      <View style={styles.body}>
        <Text style={[typography.headlineMd, styles.name]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[typography.bodyMd, styles.snippet]} numberOfLines={1}>
          {snippet}
        </Text>
      </View>
      <View style={styles.trailing}>
        <Text style={[typography.labelSm, styles.timestamp]}>{timestamp}</Text>
        <View style={styles.badgeSlot}>
          <UnreadBadge count={unreadCount} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
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
  snippet: {
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 6,
  },
  timestamp: {
    color: colors.onSurfaceVariant,
  },
  badgeSlot: {
    minHeight: 20,
  },
});
