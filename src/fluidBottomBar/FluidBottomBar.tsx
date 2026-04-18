import { Canvas, Path, Skia } from '@shopify/react-native-skia';
import { Fragment } from 'react';
import {
  StyleSheet,
  View,
  type ColorValue,
  type ViewStyle,
} from 'react-native';
import {
  useDerivedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import { BottomTabItem } from './BottomTabItem';
import { BarConstants } from './constants';
import { FloatingBall } from './FloatingBall';
import {
  type BarConstantsType,
  type BottomTabItemProps,
  type FloatingBallProps,
  type TabItem,
} from './types';

type FluidBottomBarProps = {
  tabItems: TabItem[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  activeIndex: SharedValue<number>;
  barColor?: ColorValue;
  floatingBallColor?: ColorValue;
  textColor?: ColorValue;
  barConstants?: Partial<BarConstantsType>;
  containerStyle?: ViewStyle;
  canvasWrapperStyle?: ViewStyle;
  renderFloatingBallLayer?: (props: FloatingBallProps) => React.ReactNode;
  renderFloatingBall?: (props: FloatingBallProps) => React.ReactNode;
  renderInteractiveLayer?: () => React.ReactNode;
  renderTabItem?: (props: BottomTabItemProps) => React.ReactNode;
};

export function FluidBottomBar({
  tabItems,
  selectedIndex,
  activeIndex,
  barColor = '#EDEDED',
  floatingBallColor,
  textColor,
  barConstants = {},
  renderFloatingBallLayer,
  renderFloatingBall,
  renderInteractiveLayer,
  renderTabItem,
  containerStyle = {},
  canvasWrapperStyle = {},
}: FluidBottomBarProps) {
  const {
    SPRING = BarConstants.SPRING,
    CANVAS_WIDTH = BarConstants.CANVAS_WIDTH,
    CANVAS_MARGIN = BarConstants.CANVAS_MARGIN,
    CANVAS_PADDING = BarConstants.CANVAS_PADDING,
    CANVAS_BORDER_RADIUS = BarConstants.CANVAS_BORDER_RADIUS,
    CANVAS_HEIGHT = BarConstants.CANVAS_HEIGHT,
    TAB_WIDTH = BarConstants.TAB_WIDTH,
  } = barConstants;

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
    <View
      style={[
        styles.container,
        { paddingHorizontal: CANVAS_MARGIN },
        containerStyle,
      ]}
    >
      <View
        style={[
          styles.canvasWrapper,
          {
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            paddingHorizontal: CANVAS_PADDING,
          },
          canvasWrapperStyle,
        ]}
      >
        <Canvas
          style={[
            styles.canvas,
            { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
          ]}
        >
          <Path path={path} color={barColor?.toString()} style="fill" />
        </Canvas>

        {renderInteractiveLayer ? (
          renderInteractiveLayer()
        ) : (
          <View
            style={[
              styles.interactiveLayer,
              { paddingHorizontal: CANVAS_PADDING },
            ]}
          >
            {tabItems.map((tab, index) => (
              <Fragment key={index}>
                {renderTabItem ? (
                  renderTabItem({
                    tabItem: tab,
                    index,
                    activeIndex,
                    isSelected: selectedIndex === index,
                    textColor,
                    barConstants,
                  })
                ) : (
                  <BottomTabItem
                    tabItem={tab}
                    index={index}
                    activeIndex={activeIndex}
                    isSelected={selectedIndex === index}
                    textColor={textColor}
                    barConstants={barConstants}
                  />
                )}
              </Fragment>
            ))}
          </View>
        )}

        {renderFloatingBallLayer ? (
          renderFloatingBallLayer({
            activeIndex,
            floatingBallColor,
            barConstants,
          })
        ) : (
          <FloatingBall
            activeIndex={activeIndex}
            floatingBallColor={floatingBallColor}
            barConstants={barConstants}
            renderFloatingBall={renderFloatingBall}
          />
        )}
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
  },
  canvasWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  canvas: {
    zIndex: 1,
  },
  interactiveLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
