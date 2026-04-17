import { StyleSheet, View } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { BarConstants } from './constants';

const { SPRING, TAB_WIDTH } = BarConstants;

type FloatingBallProps = {
  activeIndex: SharedValue<number>;
};

export function FloatingBall({ activeIndex }: FloatingBallProps) {
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
      <Animated.View style={[animatedStyle, styles.animatedBall]}>
        <View style={styles.tabBallWrapper}>
          <View style={styles.ball} />
        </View>
      </Animated.View>
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
    width: TAB_WIDTH,
    alignItems: 'center',
  },
  ball: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF4242',
  },
});
