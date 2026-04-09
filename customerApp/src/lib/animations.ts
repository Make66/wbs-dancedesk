import type { Variants } from "framer-motion";

export const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export const fadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delay,
      duration: 0.3,
    },
  },
});
