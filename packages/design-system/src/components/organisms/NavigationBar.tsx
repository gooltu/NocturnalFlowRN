import React from 'react';
import { MessageCircle, Phone, Settings, Users } from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing, states, typography, useThemeColors, useStyles, ThemeColors } from '../../theme';

export type NavTab = 'chats' | 'calls' | 'contacts' | 'settings';

export interface NavigationBarProps {
  active: NavTab;
  onChange: (tab: NavTab) => void;
}

const TABS: { key: NavTab; label: string; icon: LucideIcon }[] = [
  { key: 'chats', label: 'Chats', icon: MessageCircle },
  { key: 'calls', label: 'Calls', icon: Phone },
  { key: 'contacts', label: 'Contacts', icon: Users },
  { key: 'settings', label: 'Settings', icon: Settings },
];

/** Bottom-fixed floating tab bar, ~40% transparent over content, with a
 * pill highlight and `primary` tint on the active tab. */
export function NavigationBar({ active, onChange }: NavigationBarProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={styles.bar}>
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = key === active;
          return (
            <Pressable
              key={key}
              onPress={() => onChange(key)}
              style={({ pressed }) => [
                styles.tab,
                isActive && styles.tabActive,
                pressed && { opacity: states.pressedOpacity },
              ]}
            >
              <Icon
                size={20}
                strokeWidth={2}
                color={isActive ? colors.primary : colors.onSurfaceVariant}
              />
              <Text
                style={[
                  typography.labelSm,
                  { color: isActive ? colors.primary : colors.onSurfaceVariant },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.marginMobile,
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.navBar,
    borderRadius: radius.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
  },
  tabActive: {
    backgroundColor: colors.navActive,
  },
});
