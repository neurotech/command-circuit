import { useAnimation } from "motion/react";
import { useEffect } from "react";

export const useIconAnimation = (isAnimated: boolean) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isAnimated) {
      controls.start("animate");
    } else {
      controls.start("normal");
    }
  }, [isAnimated, controls]);

  return controls;
};
