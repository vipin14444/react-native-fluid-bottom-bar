import { type ReactNode } from 'react';

export type TabItem = {
  title: string;
  onPress: () => void;
  activeIcon: ReactNode;
  inactiveIcon: ReactNode;
};
