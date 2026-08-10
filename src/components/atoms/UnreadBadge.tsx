import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, typography } from '../../theme';

export interface UnreadBadgeProps {
  count: number;
}

/** Small circular/pill badge showing an unread message count, `primary` fill. */
export function UnreadBadge({ count }: UnreadBadgeProps) {
  if (count <= 0) return null;
  const label = count > 99 ? '99+' : String(count);

  return (
    <View style={styles.base}>
      <Text style={[typography.labelSm, styles.label]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    minWidth: 20,
    height: 20,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  label: {
    color: colors.onPrimary,
    letterSpacing: 0,
  },
});
