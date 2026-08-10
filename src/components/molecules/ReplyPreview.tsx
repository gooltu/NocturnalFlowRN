import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export interface ReplyPreviewProps {
  senderName: string;
  snippet: string;
}

/** Compact left-bordered block above a composed message or inside a bubble,
 * showing the quoted message's sender and a single truncated line. */
export function ReplyPreview({ senderName, snippet }: ReplyPreviewProps) {
  return (
    <View style={styles.base}>
      <Text style={[typography.labelLg, styles.sender]}>{senderName}</Text>
      <Text style={[typography.bodyMd, styles.snippet]} numberOfLines={1}>
        {snippet}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderLeftWidth: 2,
    borderLeftColor: colors.outline,
    paddingLeft: spacing.sm,
    paddingVertical: 2,
  },
  sender: {
    color: colors.primary,
  },
  snippet: {
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
});
