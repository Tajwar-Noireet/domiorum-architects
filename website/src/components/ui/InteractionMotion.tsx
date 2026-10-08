"use client";

import { useEffect } from "react";

export function InteractionMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (!preference.matches || !(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLElement>(".flow-button");
      if (!button) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = button.getBoundingClientRect();
        button.style.setProperty(
          "--flame-x",
          `${event.clientX - bounds.left}px`,
        );
        button.style.setProperty(
          "--flame-y",
          `${event.clientY - bounds.top}px`,
        );
      });
    };
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const button = event.target.closest<HTMLElement>(".flow-button");
      button?.style.removeProperty("--flame-x");
      button?.style.removeProperty("--flame-y");
    };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("focusin", focus);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", move);
      document.removeEventListener("focusin", focus);
    };
  }, []);
  return null;
}
