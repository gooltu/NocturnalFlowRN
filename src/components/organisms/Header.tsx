import React, { ReactNode } from 'react';
import { ChevronLeft, MoreVertical } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme';
import { Avatar, PresenceState } from '../atoms/Avatar';
import { IconButton } from '../atoms/IconButton';

export interface HeaderProps {
  title: string;
  onBack?: () => void;
  avatarInitials?: string;
  presence?: PresenceState;
  subtitle?: string;
  rightSlot?: ReactNode;
}

/** Sticky top bar with a blurred backdrop over `background`. Renders a back
 * chevron + contact avatar/presence when `onBack` is given (conversation
 * mode), otherwise a plain title bar (list mode). */
export function Header({ title, onBack, avatarInitials, presence, subtitle, rightSlot }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <BlurView intensity={30} tint="dark" style={[styles.base, { paddingTop: insets.top }]}>
      <View style={styles.row}>
        <View style={styles.left}>
          {onBack && <IconButton icon={ChevronLeft} onPress={onBack} size="lg" />}
          {avatarInitials && <Avatar initials={avatarInitials} presence={presence} size={36} />}
          <View>
            <Text style={[typography.headlineMd, styles.title]} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  typography.labelSm,
                  styles.subtitle,
                  { color: presence === 'online' ? colors.presenceOnline : colors.onSurfaceVariant },
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        <View style={styles.right}>
          {rightSlot ?? <IconButton icon={MoreVertical} size="md" />}
        </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    color: colors.onSurface,
  },
  subtitle: {
    marginTop: 1,
  },
});
