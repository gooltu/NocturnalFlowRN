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
import { iconTokens, useThemeColors, useStyles, ThemeColors } from '../../../../theme';
import { MessageDirection } from '../types';

export interface SwipeToReplyProps {
  direction: MessageDirection;
  onReply: () => void;
  children: React.ReactNode;
  /** When true, this wrapper fills its row instead of shrink-wrapping to
   * `children`'s natural width — for bubbles whose width cap is enforced by
   * a flex sibling further up the tree (`MessageBubble`'s text-bubble width
   * limiter), which needs every layer in between to pass its squeeze through
   * rather than opt out of it via this component's usual alignSelf-based
   * shrink-wrap. */
  stretch?: boolean;
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
export function SwipeToReply({ direction, onReply, children, stretch }: SwipeToReplyProps) {
  const colors = useThemeColors();
  const styles = useStyles(makeStyles);
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
      <View
        style={[
          styles.wrap,
          stretch ? styles.stretchSelf : direction === 'outgoing' ? styles.alignEnd : styles.alignStart,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[styles.icon, direction === 'outgoing' ? styles.iconRight : styles.iconLeft, iconStyle]}
        >
          <Reply size={iconTokens.sizeMd} strokeWidth={iconTokens.strokeWidth} color={colors.onSurfaceVariant} />
        </Animated.View>
        <Animated.View style={[bubbleStyle, stretch && styles.expand]}>{children}</Animated.View>
      </View>
    </GestureDetector>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
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
  stretchSelf: {
    alignSelf: 'stretch',
  },
  expand: {
    // flexBasis: 0 would tell Yoga to ignore this node's own content size,
    // which collapses `widthLimiterContent`'s flexBasis: 'auto' measurement
    // (in MessageBubble) to zero — the bubble rendering at zero width. Only
    // flexShrink is needed: 'auto' keeps the natural content size for that
    // measurement, while still allowing this to shrink down when the outer
    // width-limiter row actually squeezes it below that natural size.
    flexShrink: 1,
    flexBasis: 'auto',
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
