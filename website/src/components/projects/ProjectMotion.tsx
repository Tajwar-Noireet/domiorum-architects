"use client";

import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const MotionContext = createContext({ enabled: false });
const subscribeHydration = () => () => {};
export const useProjectMotion = () => useContext(MotionContext);

export function ProjectMotionProvider({ children }: { children: ReactNode }) {
  const enabled = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  return (
    <MotionContext.Provider value={{ enabled }}>
      {children}
    </MotionContext.Provider>
  );
}
