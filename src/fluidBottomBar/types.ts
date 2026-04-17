import { type ReactNode } from 'react';
import { type ColorValue } from 'react-native';
import { type SharedValue } from 'react-native-reanimated';
import { type SpringConfig } from 'react-native-reanimated/lib/typescript/animation/spring';

export type TabItem = {
  title: string;
  onPress: () => void;
  activeIcon: ReactNode;
  inactiveIcon: ReactNode;
};

export type BarConstantsType = {
  SPRING?: SpringConfig;
  CANVAS_WIDTH: number;
  CANVAS_MARGIN: number;
  CANVAS_PADDING: number;
  CANVAS_HEIGHT: number;
  CANVAS_BORDER_RADIUS: number;
  TAB_WIDTH: number;
};

export type FloatingBallProps = {
  activeIndex: SharedValue<number>;
  floatingBallColor?: ColorValue;
  barConstants?: Partial<BarConstantsType>;
  renderFloatingBall?: (props: FloatingBallProps) => React.ReactNode;
};

export type BottomTabItemProps = {
  tabItem: TabItem;
  index: number;
  activeIndex: SharedValue<number>;
  isSelected: boolean;
  textColor?: ColorValue;
  barConstants?: Partial<BarConstantsType>;
  renderLabel?: (props: {
    isSelected: boolean;
    textColor: ColorValue;
    title: string;
  }) => React.ReactNode;
};
