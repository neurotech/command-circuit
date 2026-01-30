"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import type { IconProps } from "./types";
import { useIconAnimation } from "./useIconAnimation";

export const AnimatedBell = ({
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
      transition: { duration: 0.5 * duration, ease: "easeOut", repeat: 0 },
    },
    animate: {
      opacity: 1,
      transition: { duration: 0.5 * duration, ease: "easeIn", repeat: 0 },
    },
  };

  const bellVariants: Variants = {
    normal: { rotate: 0 },
    animate: {
      rotate: [0, -15, 13, -9, 6, -3, 0],
      transition: {
        duration: 1.4 * duration,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  const clapperVariants: Variants = {
    normal: { x: 0 },
    animate: {
      x: [0, -3, 3, -2, 2, 0],
      transition: {
        duration: 1.4 * duration,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  function getRandomArbitrary(min = -0.5, max = 0.5) {
    function random(start: number, end: number) {
      return Math.random() * (end - start) + start;
    }

    return Array.from({ length: random(6, 20) }, () => random(min, max));
  }

  const leftWaveVariants: Variants = {
    normal: { opacity: 1, x: 0, y: 0, rotate: 0 },
    animate: () => {
      return {
        opacity: [1, 0.6, 1],
        x: getRandomArbitrary(),
        y: getRandomArbitrary(),
        rotate: getRandomArbitrary(-10, 6),
        transition: {
          duration: 0.21 * duration,
          ease: "easeInOut",
          repeat: Infinity,
        },
      };
    },
  };

  const rightWaveVariants: Variants = {
    normal: { opacity: 1, x: 0, y: 0, rotate: 0 },
    animate: () => {
      return {
        opacity: [1, 0.6, 1],
        x: getRandomArbitrary(),
        y: getRandomArbitrary(),
        rotate: getRandomArbitrary(-9, 7),
        transition: {
          duration: 0.21 * duration,
          ease: "easeInOut",
          repeat: Infinity,
        },
      };
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
        <title>Animated Bell Icon</title>
        <motion.path
          d="M10.268 21a2 2 0 0 0 3.464 0"
          className={"opacity-60"}
          variants={clapperVariants}
        />
        <motion.path d="M22 8c0-2.3-.8-4.3-2-6" variants={leftWaveVariants} />
        <motion.path
          d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
          variants={bellVariants}
        />
        <motion.path d="M4 2C2.8 3.7 2 5.7 2 8" variants={rightWaveVariants} />
      </motion.svg>
    </motion.div>
  );
};
