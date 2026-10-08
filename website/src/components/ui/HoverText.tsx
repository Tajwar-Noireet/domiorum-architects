"use client";

import { motion } from "framer-motion";
import { useSyncExternalStore, type ReactNode } from "react";

function subscribe(callback: () => void) {
  const query = matchMedia("(hover: hover)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function allowHoverMotion() {
  return matchMedia("(hover: hover)").matches;
}

export function HoverText({
  children,
  variant = "title",
}: {
  children: ReactNode;
  variant?: "title" | "link";
}) {
  const allowMotion = useSyncExternalStore(
    subscribe,
    allowHoverMotion,
    () => false,
  );
  const active = allowMotion;

  return (
    <motion.span
      className={`hover-text hover-text-${variant}`}
      initial={false}
      animate={{ x: 0, y: 0, scale: 1 }}
      whileHover={
        active
          ? variant === "title"
            ? { y: -3, scale: 1.008 }
            : { x: 4 }
          : undefined
      }
      transition={
        active
          ? { type: "spring", stiffness: 280, damping: 24, mass: 0.7 }
          : { duration: 0 }
      }
    >
      {children}
    </motion.span>
  );
}
