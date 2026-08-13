import React, { ReactNode } from 'react';
import { ChevronLeft, LucideIcon } from 'lucide-react-native';
import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamilies, spacing, typography } from '../../theme';
import { Avatar, PresenceState } from '../atoms/Avatar';
import { IconButton } from '../atoms/IconButton';
import { ImageIcon } from '../atoms/ImageIcon';
import { ProgressBar } from '../molecules/ProgressBar';

export interface HeaderAvatar {
  source?: ImageSourcePropType;
  initials?: string;
}

export interface HeaderAction {
  key: string;
  /** Screen-reader label; also what distinguishes otherwise identical glyphs. */
  label: string;
  /** Vector glyph for functional actions. Mutually exclusive with `image`. */
  icon?: LucideIcon;
  /** Raster art for game/reward affordances. Mutually exclusive with `icon`. */
  image?: ImageSourcePropType;
  onPress?: () => void;
  active?: boolean;
  disabled?: boolean;
}

export interface HeaderGamebar {
  level: number;
  xpCurrent: number;
  xpMax: number;
}

export interface HeaderProps {
  title: string;
  /** Presence line under the title ("Online", "typing…", "last seen …"). */
  subtitle?: string;
  /** Tints the presence dot and the subtitle. Omit for non-contact contexts. */
  presence?: PresenceState;
  onBack?: () => void;
  /** Defaults to `true` whenever `onBack` is supplied. */
  showBack?: boolean;
  /** Contact picture or monogram. Omit on top-level list screens. */
  avatar?: HeaderAvatar;
  /** Trailing controls, rendered left to right. */
  actions?: HeaderAction[];
  /** XP strip docked under the header. Omit to render the 56px bar alone. */
  gamebar?: HeaderGamebar;
  /** Escape hatch for trailing content that `actions` can't express. Replaces `actions`. */
  rightSlot?: ReactNode;
}

/** Sticky top bar with a blurred backdrop over `background`. Every region is
 * opt-in, so one component covers both contexts: pass `title` alone for a
 * top-level list header, or add `onBack` + `avatar` + `presence` + `subtitle`
 * for a conversation. Nothing is implied — a header renders no trailing
 * controls unless `actions` or `rightSlot` says so. */
export function Header({
  title,
  subtitle,
  presence,
  onBack,
  showBack,
  avatar,
  actions,
  gamebar,
  rightSlot,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const backVisible = showBack ?? Boolean(onBack);
  const subtitleColor =
    presence === 'online' ? colors.presenceOnline : colors.onSurfaceVariant;

  return (
    <BlurView
      intensity={30}
      tint="dark"
      style={[styles.base, { paddingTop: insets.top }]}
      accessibilityRole="header"
    >
      <View style={styles.headerMain}>
        {backVisible && (
          <IconButton icon={ChevronLeft} onPress={onBack} size="lg" />
        )}

        {avatar && (
          <Avatar
            source={avatar.source}
            initials={avatar.initials}
            presence={presence ?? 'none'}
            size={40}
          />
        )}

        <View style={styles.identity}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[typography.labelSm, { color: subtitleColor }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        {rightSlot ?? (
          <View style={styles.actions}>
            {actions?.map((action) =>
              action.image ? (
                <ImageIcon
                  key={action.key}
                  source={action.image}
                  size={24}
                  label={action.label}
                  onPress={action.onPress}
                  disabled={action.disabled}
                />
              ) : action.icon ? (
                <IconButton
                  key={action.key}
                  icon={action.icon}
                  onPress={action.onPress}
                  size="md"
                  active={action.active}
                  disabled={action.disabled}
                />
              ) : null
            )}
          </View>
        )}
      </View>

      {gamebar && <Gamebar {...gamebar} />}
    </BlurView>
  );
}

function Gamebar({ level, xpCurrent, xpMax }: HeaderGamebar) {
  const xpLabel = `${xpCurrent}/${xpMax}`;

  return (
    <View style={styles.gamebar}>
      <Text style={styles.gamebarLabel}>{`Level ${String(level).padStart(3, '0')}`}</Text>
      <View style={styles.gamebarBar}>
        <ProgressBar progress={xpMax > 0 ? xpCurrent / xpMax : 0} />
      </View>
      <Text style={styles.gamebarLabel}>{xpLabel}</Text>
    </View>
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
  title: {
    fontFamily: fontFamilies.jakartaSemiBold,
    fontSize: 17,
    color: colors.onSurface,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutterChat,
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
    fontSize: 11,
    color: colors.primary,
  },
});
