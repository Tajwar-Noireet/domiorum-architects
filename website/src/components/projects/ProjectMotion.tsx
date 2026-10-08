"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useHomeMotion } from "@/components/home/HomeMotion";

const MotionContext = createContext({ enabled: false, toggle: () => {} });
export const useProjectMotion = () => useContext(MotionContext);

function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: no-preference)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function preference() {
  try {
    const choice = sessionStorage.getItem("domiorum-project-motion");
    if (choice === "on" || choice === "off") return choice === "on";
  } catch {}
  return window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
}

export function ProjectMotionProvider({ children }: { children: ReactNode }) {
  const preferred = useSyncExternalStore(
    subscribeMotion,
    preference,
    () => false,
  );
  const [override, setOverride] = useState<boolean | null>(null);
  const { enabled: homeEnabled } = useHomeMotion();
  const enabled = homeEnabled && (override ?? preferred);
  return (
    <MotionContext.Provider
      value={{
        enabled,
        toggle: () => {
          setOverride(!enabled);
          try {
            sessionStorage.setItem(
              "domiorum-project-motion",
              enabled ? "off" : "on",
            );
          } catch {}
        },
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function ProjectMotionToggle() {
  const { enabled, toggle } = useProjectMotion();
  return (
    <button
      className="project-motion-toggle"
      onClick={toggle}
      aria-pressed={enabled}
    >
      <span className="project-motion-indicator" aria-hidden="true" />
      {enabled ? "Disable scroll effects" : "Enable scroll effects"}
    </button>
  );
}
