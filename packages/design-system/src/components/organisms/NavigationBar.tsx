import React from 'react';
import { LucideIcon } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing, states, typography, useThemeColors, useStyles, ThemeColors } from '../../theme';

/** One tab's identity — the consumer supplies its own key union (typically
 * its route-name type) plus a label and any lucide icon. */
export interface NavTabItem<T extends string = string> {
  key: T;
  label: string;
  icon: LucideIcon;
}

export interface NavigationBarProps<T extends string = string> {
  /** 2 or more tabs, in display order. Count, labels and icons are entirely
   * caller-defined — this component has no built-in tab set. */
  tabs: NavTabItem<T>[];
  active: T;
  onChange: (tab: T) => void;
}

/** Floating-capsule tab bar — ~40% transparent, with a pill highlight and
 * `primary` tint on the active tab. Renders in normal layout flow (not
 * self-overlaid); a host that wants it fixed to the screen bottom, such as a
 * `bottom-tabs` custom `tabBar`, positions it. Controlled via `tabs`/`active`/
 * `onChange` only — no navigation-library dependency. */
export function NavigationBar<T extends string = string>({ tabs, active, onChange }: NavigationBarProps<T>) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
      <View style={styles.bar}>
        {tabs.map(({ key, label, icon: Icon }) => {
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
