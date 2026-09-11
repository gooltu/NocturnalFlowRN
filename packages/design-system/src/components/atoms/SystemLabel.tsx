import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { radius, spacing, typography, useStyles, ThemeColors } from '../../theme';

export interface SystemLabelProps {
  text: string;
}

/** Centered muted label for inline system events and date dividers in a message list. */
export function SystemLabel({ text }: SystemLabelProps) {
  const styles = useStyles(makeStyles);
  return (
    <View style={styles.base}>
      <Text style={[typography.labelSm, styles.text]}>{text}</Text>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    alignSelf: 'center',
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: {
    color: colors.onSurfaceVariant,
  },
});
