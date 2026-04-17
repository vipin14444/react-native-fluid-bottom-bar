import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { BarConstants } from './constants';
import { type FloatingBallProps } from './types';

export function FloatingBall({
  activeIndex,
  floatingBallColor = '#FF4242',
  barConstants = {},
  renderFloatingBall,
}: FloatingBallProps) {
  const { SPRING = BarConstants.SPRING, TAB_WIDTH = BarConstants.TAB_WIDTH } =
    barConstants;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(activeIndex.value * TAB_WIDTH, SPRING),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      {renderFloatingBall ? (
        renderFloatingBall({ activeIndex, floatingBallColor, barConstants })
      ) : (
        <Animated.View style={[animatedStyle, styles.animatedBall]}>
          <View style={[styles.tabBallWrapper, { width: TAB_WIDTH }]}>
            <View
              style={[styles.ball, { backgroundColor: floatingBallColor }]}
            />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -17,
    width: '100%',
    zIndex: 0,
    pointerEvents: 'none',
  },
  animatedBall: {
    pointerEvents: 'none',
  },
  tabBallWrapper: {
    alignItems: 'center',
  },
  ball: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
