import { useEffect } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BarConstants } from './constants';
import { type BottomTabItemProps } from './types';

export function BottomTabItem({
  tabItem,
  isSelected,
  textColor = '#7b7b7b',
  barConstants = {},
  renderLabel,
}: BottomTabItemProps) {
  const { SPRING = BarConstants.SPRING } = barConstants;
  const activeSharedValue = useSharedValue(0);

  useEffect(() => {
    activeSharedValue.value = withSpring(isSelected ? 1 : 0, SPRING);
  }, [SPRING, activeSharedValue, isSelected]);

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
      {renderLabel ? (
        renderLabel({ isSelected, textColor, title: tabItem.title })
      ) : (
        <Text style={[{ color: textColor }]}>{tabItem.title}</Text>
      )}
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
});
