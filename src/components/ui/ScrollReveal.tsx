"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type Direction = "up" | "left" | "right";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}

const directionMap: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 32 },
  left: { x: -32 },
  right: { x: 32 },
};

const easing = [0.22, 1, 0.36, 1] as const;

export function ScrollReveal({ children, delay = 0, direction = "up", className }: ScrollRevealProps) {
  const initial = { opacity: 0, ...directionMap[direction] };
  const animate = { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: easing }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
