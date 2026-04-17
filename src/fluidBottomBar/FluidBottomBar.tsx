import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { StyleSheet, View } from 'react-native';
import {
  type SharedValue,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { BottomTabItem } from './BottomTabItem';
import { BarConstants } from './constants';
import { FloatingBall } from './FloatingBall';
import { type TabItem } from './types';

const {
  SPRING,
  CANVAS_WIDTH,
  CANVAS_MARGIN,
  CANVAS_PADDING,
  CANVAS_BORDER_RADIUS,
  CANVAS_HEIGHT,
  TAB_WIDTH,
} = BarConstants;

type FluidBottomBarProps = {
  tabItems: TabItem[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  activeIndex: SharedValue<number>;
};

export function FluidBottomBar({
  tabItems,
  selectedIndex,
  activeIndex,
}: FluidBottomBarProps) {
  const springIndex = useDerivedValue(() => {
    return withSpring(activeIndex.value, SPRING);
  });

  const createBarPath = (index: number, inset = 0) => {
    'worklet';

    const left = inset;
    const top = inset;
    const right = CANVAS_WIDTH - inset;
    const bottom = CANVAS_HEIGHT - inset;
    const radius = Math.max(CANVAS_BORDER_RADIUS - inset, 0);
    const centerX = CANVAS_PADDING + index * TAB_WIDTH + TAB_WIDTH / 2;

    const skPath = Skia.PathBuilder.Make();
    skPath.moveTo(left, top + radius);

    const leftBlend = 1 - Math.min(Math.max(index, 0), 1);
    const leftXAtFirst = centerX - TAB_WIDTH / 2;
    const topLeftArcEndX =
      left + radius + (leftXAtFirst - (left + radius)) * leftBlend;

    const dip = 40;
    skPath.quadTo(left, top, topLeftArcEndX, top);
    skPath.lineTo(centerX - 50, top);
    skPath.cubicTo(centerX - 30, top, centerX - 35, dip, centerX, dip);
    skPath.cubicTo(centerX + 35, dip, centerX + 30, top, centerX + 50, top);

    const rightBlend = Math.min(Math.max(index - (tabItems.length - 2), 0), 1);
    const rightXAtLast = centerX + TAB_WIDTH / 2;
    const topRightArcStartX =
      right - radius + (rightXAtLast - (right - radius)) * rightBlend;

    skPath.lineTo(topRightArcStartX, top);
    skPath.quadTo(right, top, right, top + radius);
    skPath.lineTo(right, bottom - radius);
    skPath.quadTo(right, bottom, right - radius, bottom);
    skPath.lineTo(left + radius, bottom);
    skPath.quadTo(left, bottom, left, bottom - radius);
    skPath.lineTo(left, top + radius);

    return skPath.build();
  };

  const path = useDerivedValue(() => {
    return createBarPath(springIndex.value);
  });

  return (
    <View style={styles.container}>
      <View style={styles.canvasWrapper}>
        <Canvas style={styles.canvas}>
          <Path path={path} color="#EDEDED" style="fill" />
        </Canvas>

        <View style={styles.interactiveLayer}>
          {tabItems.map((tab, index) => (
            <BottomTabItem
              key={index}
              tabItem={tab}
              index={index}
              activeIndex={activeIndex}
              isSelected={selectedIndex === index}
            />
          ))}
        </View>
        <FloatingBall activeIndex={activeIndex} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 32,
    width: '100%',
    paddingHorizontal: CANVAS_MARGIN,
  },
  canvasWrapper: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    flexDirection: 'row',
    paddingHorizontal: CANVAS_PADDING,
    justifyContent: 'center',
  },
  canvas: {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    zIndex: 1,
  },
  interactiveLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: CANVAS_PADDING,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
