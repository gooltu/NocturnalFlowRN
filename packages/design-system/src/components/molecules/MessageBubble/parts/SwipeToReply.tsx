import React, { useMemo } from 'react';
import { Reply } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import * as Haptics from 'expo-haptics';
import { iconTokens, useThemeColors } from '../../../../theme';
import { MessageDirection } from '../types';

interface SwipeToReplyProps {
  direction: MessageDirection;
  onReply: () => void;
  children: React.ReactNode;
}

const THRESHOLD = 56;
const SOFT_LIMIT = 72;
const ICON_SLOT = 40;

/** The further past the soft limit, the less the bubble follows the finger. */
function rubberband(overshoot: number, dimension: number, constant = 0.55) {
  'worklet';
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

/** WhatsApp/iMessage-style swipe-to-reply: drag a bubble toward the thread's
 * center (right for incoming, left for outgoing) to reveal a reply icon in
 * the gap it leaves behind; release past the threshold to fire `onReply`.
 * Always springs back — a fire-and-return gesture, not a persistent reveal.
 * `activeOffsetX`/`failOffsetY` restrict activation to deliberate horizontal
 * intent so this never steals the message list's vertical scroll. */
export function SwipeToReply({ direction, onReply, children }: SwipeToReplyProps) {
  const colors = useThemeColors();
  const sign = direction === 'outgoing' ? -1 : 1;
  const drag = useSharedValue(0);
  const armed = useSharedValue(false);

  useAnimatedReaction(
    () => drag.get() > THRESHOLD,
    (isArmed, wasArmed) => {
      if (isArmed !== wasArmed) {
        armed.set(isArmed);
        if (isArmed) scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Light);
      }
    }
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX(sign * 10)
        .failOffsetY([-15, 15])
        .onUpdate((e) => {
          const raw = Math.max(0, e.translationX * sign);
          drag.set(raw <= SOFT_LIMIT ? raw : SOFT_LIMIT + rubberband(raw - SOFT_LIMIT, SOFT_LIMIT));
        })
        .onEnd(() => {
          if (drag.get() > THRESHOLD) {
            scheduleOnRN(onReply);
          }
          drag.set(withSpring(0, { duration: 300, dampingRatio: 0.8 }));
        }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sign, onReply]
  );

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drag.get() * sign }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: interpolate(drag.get(), [0, THRESHOLD], [0, 1], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(drag.get(), [0, THRESHOLD], [0.5, 1], Extrapolation.CLAMP) }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <View style={[styles.wrap, direction === 'outgoing' ? styles.alignEnd : styles.alignStart]}>
        <Animated.View
          pointerEvents="none"
          style={[styles.icon, direction === 'outgoing' ? styles.iconRight : styles.iconLeft, iconStyle]}
        >
          <Reply size={iconTokens.sizeMd} strokeWidth={iconTokens.strokeWidth} color={colors.onSurfaceVariant} />
        </Animated.View>
        <Animated.View style={bubbleStyle}>{children}</Animated.View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
  },
  alignStart: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  alignEnd: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  icon: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: ICON_SLOT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: { left: -ICON_SLOT },
  iconRight: { right: -ICON_SLOT },
});
