import type Lenis from "lenis";

let scrollEngine: Lenis | undefined;

export function setScrollEngine(engine: Lenis | undefined) {
  scrollEngine = engine;
}

export function scrollToPosition(top: number) {
  if (scrollEngine) scrollEngine.scrollTo(top, { immediate: true });
  else window.scrollTo({ top, behavior: "instant" });
}
