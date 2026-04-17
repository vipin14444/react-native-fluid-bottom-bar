import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BarConstants } from './constants';
import { type TabItem } from './types';

const { SPRING } = BarConstants;

type BottomTabItemProps = {
  tabItem: TabItem;
  index: number;
  activeIndex: SharedValue<number>;
  isSelected: boolean;
};

export function BottomTabItem({ tabItem, isSelected }: BottomTabItemProps) {
  const activeSharedValue = useSharedValue(0);

  useEffect(() => {
    activeSharedValue.value = withSpring(isSelected ? 1 : 0, SPRING);
  }, [activeSharedValue, isSelected]);

  const iconContainerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(activeSharedValue.value * -20, SPRING),
      },
    ],
  }));

  const darkIconStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(1 - activeSharedValue.value, SPRING),
    };
  });

  const lightIconStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(activeSharedValue.value, SPRING),
    };
  });

  return (
    <Pressable style={styles.pressableTabItem} onPress={tabItem.onPress}>
      <Animated.View style={[iconContainerStyle, styles.iconContainer]}>
        <Animated.View style={[StyleSheet.absoluteFill, lightIconStyle]}>
          {tabItem.activeIcon}
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, darkIconStyle]}>
          {tabItem.inactiveIcon}
        </Animated.View>
      </Animated.View>
      <Text style={styles.label}>{tabItem.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressableTabItem: {
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    gap: 4,
    marginBottom: -4,
  },
  iconContainer: {
    position: 'relative',
    width: 24,
    height: 24,
    pointerEvents: 'none',
  },
  label: {
    color: '#7b7b7b',
  },
});
