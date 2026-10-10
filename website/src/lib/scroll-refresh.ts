import { ScrollTrigger } from "gsap/ScrollTrigger";

let pendingFrame: number | undefined;

// Font loading and route setup often finish together. Measure their geometry once.
export function scheduleScrollRefresh() {
  if (pendingFrame !== undefined) return;
  pendingFrame = requestAnimationFrame(() => {
    pendingFrame = undefined;
    ScrollTrigger.refresh();
  });
}
