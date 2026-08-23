import React from 'react';
import { StyleSheet, View } from 'react-native';
import { EmptyState, ThemeColors, useStyles } from '@nocturnalflow/design-system';

export interface PlaceholderScreenProps {
  icon: React.ComponentProps<typeof EmptyState>['icon'];
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Centered `EmptyState` filling a full tab screen — used for the Calls/
 * Contacts/Settings tabs, none of which have real content yet. */
export function PlaceholderScreen({ icon, title, description, actionLabel, onAction }: PlaceholderScreenProps) {
  const styles = useStyles(makeStyles);
  return (
    <View style={[styles.root, styles.centered]}>
      <EmptyState icon={icon} title={title} description={description} actionLabel={actionLabel} onAction={onAction} />
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
  },
});
