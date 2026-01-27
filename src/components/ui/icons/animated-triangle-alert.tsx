"use client";

import type { HTMLMotionProps, Transition, Variants } from "motion/react";
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

export const AnimatedTriangleAlert = ({
  className,
  size = 16,
  duration = 1,
  isAnimated = false,
  ...props
}: IconProps) => {
  const controls = useAnimation();

  const defaultTransition: Transition = {
    type: "spring",
    stiffness: 160,
    damping: 17,
    mass: 1,
  };

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

  const outerPathVariants: Variants = {
    normal: {
      pathLength: [1, 0],
      opacity: [1, 0],
      transition: { duration: 0.33 * duration },
    },
    animate: {
      pathLength: [0, 1],
      opacity: [0, 1],
      transition: { delay: 0.2 * duration, duration: 0.33 * duration },
    },
  };

  const innerPathVariants: Variants = {
    normal: {
      opacity: 0,
      transition: { duration: 0.2 * duration, ease: "easeInOut", repeat: 0 },
    },
    animate: {
      opacity: [0, 1],
      transition: {
        delay: 0.6 * duration,
        duration: 0.33 * duration,
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
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={controls}
        initial="normal"
        variants={iconVariants}
        className={twMerge("", className)}
      >
        <title>Animated Circle Check Icon</title>
        <motion.path
          d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
          className={"opacity-55"}
          variants={outerPathVariants}
          transition={defaultTransition}
        />
        <motion.path d="M12 9v4" variants={innerPathVariants} />
        <motion.path d="M12 17h.01" variants={innerPathVariants} />
      </motion.svg>
    </motion.div>
  );
};
