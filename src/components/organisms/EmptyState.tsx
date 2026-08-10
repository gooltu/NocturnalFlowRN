import React from 'react';
import { LucideIcon, MessageCircle } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';
import { ButtonGhost } from '../atoms/ButtonGhost';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

/** Centered icon + title + supporting text, used for empty chat list, empty
 * conversation, or no-search-results states. */
export function EmptyState({ icon: Icon = MessageCircle, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.base}>
      <View style={styles.iconCircle}>
        <Icon size={28} strokeWidth={2} color={colors.primary} style={{ opacity: 0.7 }} />
      </View>
      <Text style={[typography.headlineMd, styles.title]}>{title}</Text>
      <Text style={[typography.bodyMd, styles.description]}>{description}</Text>
      {actionLabel && (
        <View style={styles.action}>
          <ButtonGhost label={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
