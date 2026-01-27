"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

export interface IconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface IconProps extends HTMLMotionProps<"div"> {
  size?: number;
  duration?: number;
  isAnimated?: boolean;
}

export const AnimatedInfo = ({
  className,
  size = 16,
  duration = 1,
  isAnimated = false,
  ...props
}: IconProps) => {
  const controls = useAnimation();

  const iconVariants: Variants = {
    normal: {
      opacity: 0,
      transition: { duration: 0.4 * duration, ease: "easeInOut", repeat: 0 },
    },
    animate: {
      opacity: 1,
      transition: { duration: 0.3 * duration, ease: "easeInOut", repeat: 0 },
    },
  };

  const drawVariants: Variants = {
    normal: {
      pathLength: 0,
      transition: { duration: 0.33 * duration, ease: "easeInOut", repeat: 0 },
    },
    animate: {
      pathLength: [0, 1],
      transition: { duration: 0.33 * duration, ease: "circIn", repeat: 0 },
    },
  };

  const barVariants: Variants = {
    normal: {
      opacity: 0,
      transition: { duration: 0.33 * duration, ease: "easeInOut", repeat: 0 },
    },
    animate: {
      opacity: [0, 1],
      transition: {
        delay: 0.6 * duration,
        duration: 0.33 * duration,
        ease: "easeOut",
        repeat: 0,
      },
    },
  };

  const dotVariants: Variants = {
    normal: {
      opacity: 0,
      transition: { duration: 0.33 * duration, ease: "easeInOut", repeat: 0 },
    },
    animate: {
      opacity: [0, 1],
      transition: {
        delay: 0.8 * duration,
        duration: 0.33 * duration,
        ease: "easeOut",
        repeat: 0,
      },
    },
  };

  useEffect(() => {
    if (isAnimated) {
      controls.start("animate");
    } else {
      controls.start("normal");
    }
  }, [isAnimated, controls]);

  return (
    <motion.div
      className={"inline-flex items-center justify-center"}
      {...props}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        animate={controls}
        initial="normal"
        variants={iconVariants}
        className={twMerge("", className)}
      >
        <title>Animated Info Icon</title>
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          variants={drawVariants}
          className={"opacity-55"}
        />
        <motion.path d="M12 16v-4" variants={barVariants} />
        <motion.path d="M12 8h.01" variants={dotVariants} />
      </motion.svg>
    </motion.div>
  );
};
