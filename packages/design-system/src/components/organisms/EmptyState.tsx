import React from 'react';
import { LucideIcon, MessageCircle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { subTestID } from '../../utils';
import { spacing, typography, useThemeColors, useStyles, ThemeColors } from '../../theme';
import { ButtonGhost } from '../atoms/ButtonGhost';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  /** Stable ID for E2E tools, set on the root; derives `.title` and `.action`. */
  testID?: string;
}

/** Centered icon + title + supporting text, used for empty chat list, empty
 * conversation, or no-search-results states. */
export function EmptyState({ icon: Icon = MessageCircle, title, description, actionLabel, onAction, testID }: EmptyStateProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  return (
    <View testID={testID} style={styles.base}>
      <View style={styles.iconCircle}>
        <Icon size={28} strokeWidth={2} color={colors.primary} style={{ opacity: 0.7 }} />
      </View>
      <Text testID={subTestID(testID, 'title')} style={[typography.headlineMd, styles.title]}>{title}</Text>
      <Text style={[typography.bodyMd, styles.description]}>{description}</Text>
      {actionLabel && (
        <View style={styles.action}>
          <ButtonGhost label={actionLabel} onPress={onAction} testID={subTestID(testID, 'action')} />
        </View>
      )}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  description: {
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.7,
  },
  action: {
    marginTop: spacing.lg,
  },
});
