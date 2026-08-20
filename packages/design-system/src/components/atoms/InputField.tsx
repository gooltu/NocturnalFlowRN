import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react-native';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { iconTokens, radius, spacing, typography, useThemeColors, useStyles, ThemeColors } from '../../theme';

export interface InputFieldProps extends TextInputProps {
  icon?: LucideIcon;
}

/** Search / chat text input: `surface-container` fill, `outline-variant` border
 * on focus, 16px internal padding. */
export function InputField({ icon: Icon, style, ...rest }: InputFieldProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.base, focused && styles.focused]}>
      {Icon && (
        <Icon
          size={iconTokens.sizeMd}
          strokeWidth={iconTokens.strokeWidth}
          color={colors.onSurfaceVariant}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholderTextColor={colors.onSurfaceVariant}
        style={[typography.bodyLg, styles.input, style]}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        {...rest}
      />
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.DEFAULT,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  focused: {
    borderColor: colors.outlineVariant,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.onSurface,
    paddingVertical: spacing.sm,
  },
});
