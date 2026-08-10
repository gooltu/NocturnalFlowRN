import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, LucideIcon, WifiOff, X } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

export type ToastVariant = 'success' | 'warning' | 'error';

export interface ToastProps {
  variant: ToastVariant;
  title: string;
  description?: string;
  icon?: LucideIcon;
  /** Non-critical toasts auto-dismiss after 4s; connectivity/error states should persist until resolved. */
  persist?: boolean;
  onDismiss?: () => void;
}

const VARIANT_CONFIG: Record<ToastVariant, { color: string; icon: LucideIcon }> = {
  success: { color: colors.success, icon: CheckCircle2 },
  warning: { color: colors.warning, icon: WifiOff },
  error: { color: colors.error, icon: AlertCircle },
};

export function Toast({ variant, title, description, icon, persist, onDismiss }: ToastProps) {
  const config = VARIANT_CONFIG[variant];
  const Icon = icon ?? config.icon;

  useEffect(() => {
    if (persist) return;
    const timer = setTimeout(() => onDismiss?.(), 4000);
    return () => clearTimeout(timer);
  }, [persist, onDismiss]);

  return (
    <View style={[styles.base, { borderLeftColor: config.color }]}>
      <Icon size={20} strokeWidth={2} color={config.color} />
      <View style={styles.text}>
        <Text style={[typography.labelLg, { color: config.color }]}>{title}</Text>
        {description && (
          <Text style={[typography.bodyMd, styles.description]}>{description}</Text>
        )}
      </View>
      {onDismiss && (
        <Pressable onPress={onDismiss} hitSlop={8}>
          <X size={16} strokeWidth={2} color={colors.onSurfaceVariant} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radius.DEFAULT,
    borderLeftWidth: 3,
    padding: spacing.md,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  description: {
    color: colors.onSurfaceVariant,
  },
});
