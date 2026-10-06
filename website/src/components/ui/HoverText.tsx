"use client";

import { motion } from "framer-motion";
import { useSyncExternalStore, type ReactNode } from "react";
import { useHomeMotion } from "@/components/home/HomeMotion";

function subscribe(callback: () => void) {
  const query = matchMedia(
    "(prefers-reduced-motion: no-preference) and (hover: hover)",
  );
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function allowHoverMotion() {
  return matchMedia(
    "(prefers-reduced-motion: no-preference) and (hover: hover)",
  ).matches;
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
  const { enabled } = useHomeMotion();
  const active = enabled && allowMotion;

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
