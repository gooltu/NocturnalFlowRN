import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, duration, easing, radius, spacing } from '../../theme';

/** Shimmer placeholder for a chat-list row or message bubble while content loads. */
export function SkeletonRow() {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: duration.slow, easing: easing.standard }),
        withTiming(0, { duration: duration.slow, easing: easing.standard })
      ),
      -1
    );
  }, [pulse]);

  const style = useAnimatedStyle(() => ({
    opacity: 0.5 + pulse.value * 0.5,
  }));

  return (
    <Animated.View style={[styles.row, style]}>
      <View style={styles.avatar} />
      <View style={styles.lines}>
        <View style={[styles.line, { width: '55%' }]} />
        <View style={[styles.line, styles.lineSecondary, { width: '80%' }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.marginMobile,
    paddingVertical: spacing.sm,
    gap: spacing.sm + 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceContainerHighest,
  },
  lines: {
    flex: 1,
    gap: spacing.xs + 2,
  },
  line: {
    height: 12,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceContainerHighest,
  },
  lineSecondary: {
    backgroundColor: colors.surfaceContainerHigh,
  },
});
