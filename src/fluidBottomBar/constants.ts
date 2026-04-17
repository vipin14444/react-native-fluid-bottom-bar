import { Dimensions } from 'react-native';
import { type SpringConfig } from 'react-native-reanimated/lib/typescript/animation/spring';

const SPRING: SpringConfig | undefined = undefined;

const { width: windowWidth } = Dimensions.get('window');
const CANVAS_MARGIN = 16;
const CANVAS_PADDING = 16;
const CANVAS_WIDTH = windowWidth - CANVAS_MARGIN * 2;
const TAB_WIDTH = (CANVAS_WIDTH - 2 * CANVAS_PADDING) / 4;
const CANVAS_HEIGHT = 70;
const CANVAS_BORDER_RADIUS = 32;

export const BarConstants = {
  SPRING,
  CANVAS_WIDTH,
  CANVAS_MARGIN,
  CANVAS_PADDING,
  CANVAS_HEIGHT,
  CANVAS_BORDER_RADIUS,
  TAB_WIDTH,
};
