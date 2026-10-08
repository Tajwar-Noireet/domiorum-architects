"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useHomeMotion } from "@/components/home/HomeMotion";

const MotionContext = createContext({ enabled: false });
export const useProjectMotion = () => useContext(MotionContext);

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function preference() {
  return window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
}

export function ProjectMotionProvider({ children }: { children: ReactNode }) {
  const preferred = useSyncExternalStore(
    subscribeMotion,
    preference,
    () => false,
  );
  const { enabled: homeEnabled } = useHomeMotion();
  const enabled = homeEnabled && preferred;
  return (
    <MotionContext.Provider value={{ enabled }}>
      {children}
    </MotionContext.Provider>
  );
}
