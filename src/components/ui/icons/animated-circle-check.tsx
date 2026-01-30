"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import type { IconProps } from "./types";
import { useIconAnimation } from "./useIconAnimation";

export const AnimatedCircleCheck = ({
  className,
  size = 16,
  duration = 1,
  isAnimated = false,
  ...props
}: IconProps) => {
  const controls = useIconAnimation(isAnimated);

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
      pathLength: 0,
      transition: { duration: 0.33 * duration, ease: "easeInOut", repeat: 0 },
    },
    animate: {
      pathLength: [0, 1],
      transition: { duration: 0.33 * duration, ease: "circIn", repeat: 0 },
    },
  };

  const innerPathVariants: Variants = {
    normal: {
      pathLength: 0,
      transition: { duration: 0.33 * duration, ease: "easeInOut", repeat: 0 },
    },
    animate: {
      pathLength: [0, 1],
      transition: {
        delay: 0.2 * duration,
        duration: 0.33 * duration,
        ease: "easeOut",
        repeat: 0,
      },
    },
  };

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
          d="M21.801 10A10 10 0 1 1 17 3.335"
          variants={outerPathVariants}
          className={"opacity-55"}
        />
        <motion.path d="m9 11 3 3L22 4" variants={innerPathVariants} />
      </motion.svg>
    </motion.div>
  );
};
