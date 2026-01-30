import type { HTMLMotionProps } from "motion/react";

export interface IconProps extends HTMLMotionProps<"div"> {
  size?: number;
  duration?: number;
  isAnimated?: boolean;
}
