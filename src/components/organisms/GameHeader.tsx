import React from 'react';
import { ChevronLeft, MoreVertical, Phone } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing, typography } from '../../theme';
import { Avatar, PresenceState } from '../atoms/Avatar';
import { IconButton } from '../atoms/IconButton';
import { ProgressBar } from '../molecules/ProgressBar';

export interface GameHeaderProps {
  title: string;
  onBack?: () => void;
  avatarInitials: string;
  presence?: PresenceState;
  subtitle?: string;
  onCallPress?: () => void;
  onMorePress?: () => void;
  level: number;
  xpCurrent: number;
  xpMax: number;
}

/** Conversation header plus a "gamebar" strip: level, an XP progress bar,
 * and a current/max fraction — a gamification layer over the base Header. */
export function GameHeader({
  title,
  onBack,
  avatarInitials,
  presence,
  subtitle,
  onCallPress,
  onMorePress,
  level,
  xpCurrent,
  xpMax,
}: GameHeaderProps) {
  const insets = useSafeAreaInsets();
  const levelLabel = `Level ${String(level).padStart(3, '0')}`;
  const xpLabel = `${xpCurrent}/${xpMax}`;

  return (
    <BlurView intensity={30} tint="dark" style={[styles.base, { paddingTop: insets.top }]}>
      <View style={styles.headerMain}>
        {onBack && <IconButton icon={ChevronLeft} onPress={onBack} size="lg" />}
        <Avatar initials={avatarInitials} presence={presence} size={40} />
        <View style={styles.identity}>
          <Text style={styles.name} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                typography.labelSm,
                { color: presence === 'online' ? colors.presenceOnline : colors.onSurfaceVariant },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
        <IconButton icon={Phone} onPress={onCallPress} size="md" />
        <IconButton icon={MoreVertical} onPress={onMorePress} size="md" />
      </View>

      <View style={styles.gamebar}>
        <Text style={styles.gamebarLabel}>{levelLabel}</Text>
        <View style={styles.gamebarBar}>
          <ProgressBar progress={xpCurrent / xpMax} />
        </View>
        <Text style={styles.gamebarLabel}>{xpLabel}</Text>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(18,20,20,0.85)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterChat,
    height: 56,
    paddingHorizontal: spacing.gutterChat,
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: fontFamilies.jakartaSemiBold,
    fontSize: 17,
    color: colors.onSurface,
  },
  gamebar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterChat,
    height: 24,
    paddingHorizontal: spacing.gutterChat,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
  },
  gamebarBar: {
    flex: 1,
  },
  gamebarLabel: {
    fontFamily: fontFamilies.interSemiBold,
    fontSize: 8,
    color: colors.primary,
  },
});
