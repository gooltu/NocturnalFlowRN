import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radius, typography, useStyles, ThemeColors } from '../../theme';

export interface UnreadBadgeProps {
  count: number;
  /** Stable ID for E2E tools (Maestro/Detox); forwarded to the root element. */
  testID?: string;
}

/** Small circular/pill badge showing an unread message count, `primary` fill. */
export function UnreadBadge({ count, testID }: UnreadBadgeProps) {
  const styles = useStyles(makeStyles);
  if (count <= 0) return null;
  const label = count > 99 ? '99+' : String(count);

  return (
    <View testID={testID} style={styles.base}>
      <Text style={[typography.labelSm, styles.label]}>{label}</Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
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
