// A simple animation library adapter to avoid adding dependencies
// Provides basic layout animation functionality similar to framer-motion
import { createElement } from 'react';

export interface MotionProps {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: Record<string, unknown>;
  layout?: boolean;
  className?: string;
}

interface MotionComponentProps extends MotionProps {
  children?: React.ReactNode;
}

export const motion = {
  div: ({
    initial,
    animate,
    exit,
    transition,
    layout,
    className,
    children,
    ...props
  }: MotionComponentProps & React.HTMLAttributes<HTMLDivElement>) => {
    return createElement('div', { className, ...props }, children);
  },
};