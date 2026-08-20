import React from 'react';
import { Camera, FileText, Image as ImageIcon, LucideIcon, Mic } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radius, spacing, states, typography, useThemeColors, useStyles, ThemeColors } from '../../theme';

export interface AttachmentSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect?: (kind: 'photos' | 'camera' | 'file' | 'audio') => void;
}

const OPTIONS: { key: 'photos' | 'camera' | 'file' | 'audio'; label: string; icon: LucideIcon }[] = [
  { key: 'photos', label: 'Photos', icon: ImageIcon },
  { key: 'camera', label: 'Camera', icon: Camera },
  { key: 'file', label: 'File', icon: FileText },
  { key: 'audio', label: 'Audio', icon: Mic },
];

/** Bottom sheet with rounded top corners for choosing an attachment type. */
export function AttachmentSheet({ visible, onClose, onSelect }: AttachmentSheetProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        <View style={styles.handle} />
        <View style={styles.grid}>
          {OPTIONS.map(({ key, label, icon: Icon }) => (
            <Pressable
              key={key}
              onPress={() => onSelect?.(key)}
              style={({ pressed }) => [styles.option, pressed && { opacity: states.pressedOpacity }]}
            >
              <View style={styles.iconTile}>
                <Icon size={22} strokeWidth={2} color={colors.primary} />
              </View>
              <Text style={[typography.labelSm, styles.label]}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.backdrop,
  },
  sheet: {
    backgroundColor: colors.surfaceContainerHigh,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.outline,
    marginVertical: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  option: {
    alignItems: 'center',
    gap: spacing.xs + 2,
  },
  iconTile: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHighest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.onSurfaceVariant,
  },
});
