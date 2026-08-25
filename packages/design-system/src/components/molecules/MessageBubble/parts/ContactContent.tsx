import React from 'react';
import { AlertTriangle, User } from 'lucide-react-native';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { iconTokens, spacing, states, typography, useThemeColors, useStyles, ThemeColors } from '../../../../theme';
import { bubbleSkin } from '../bubbleTheme';
import { ContactMessageContent, MessageDirection } from '../types';

export interface ContactContentProps {
  direction: MessageDirection;
  content: ContactMessageContent;
}

const AVATAR_SIZE = 44;

/** Contact-card row: avatar (photo, initials, or a generic person glyph —
 * whichever the consumer supplied, in that order) plus name and subtitle.
 * While `status` is set the avatar swaps for a spinner or failure glyph. */
export function ContactContent({ direction, content }: ContactContentProps) {
  const colors = useThemeColors();
  const skin = bubbleSkin(colors, direction);
  const styles = useStyles(makeStyles);
  const { name, subtitle, avatar, initials, status, onPress } = content;

  const secondary = status === 'downloading' ? 'Loading contact…' : status === 'failed' ? 'Couldn’t load contact · Tap to retry' : subtitle;

  const row = (
    <View style={styles.row}>
      <View style={[styles.avatar, { backgroundColor: skin.quoteTileFill }]}>
        {status === 'downloading' ? (
          <ActivityIndicator color={skin.text} />
        ) : status === 'failed' ? (
          <AlertTriangle size={iconTokens.sizeMd} strokeWidth={iconTokens.strokeWidth} color={colors.error} />
        ) : avatar ? (
          <Image source={avatar} style={styles.avatarImage} resizeMode="cover" />
        ) : initials ? (
          <Text style={[typography.labelLg, { color: skin.text }]}>{initials}</Text>
        ) : (
          <User size={iconTokens.sizeMd} strokeWidth={iconTokens.strokeWidth} color={skin.text} />
        )}
      </View>
      <View style={styles.text}>
        <Text style={[typography.bodyLg, { color: skin.text }]} numberOfLines={1}>
          {name}
        </Text>
        {!!secondary && (
          <Text
            style={[typography.labelSm, { color: status === 'failed' ? colors.error : skin.meta }]}
            numberOfLines={1}
          >
            {secondary}
          </Text>
        )}
      </View>
    </View>
  );

  if (!onPress) return row;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={secondary ? `${name}, ${secondary}` : name}
      style={({ pressed }) => pressed && { opacity: states.pressedOpacity }}
    >
      {row}
    </Pressable>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  text: {
    flex: 1,
    gap: 2,
  },
});
