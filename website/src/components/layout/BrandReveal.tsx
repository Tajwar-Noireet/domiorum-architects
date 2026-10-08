"use client";

import { useEffect, useRef } from "react";
import { FlowButton } from "@/components/ui/FlowButton";
import { brandRevealSessionKey } from "@/lib/brand-reveal";

export function BrandReveal() {
  const intro = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const dismiss = useRef<() => void>(() => {});

  useEffect(() => {
    const root = document.documentElement;
    let seen = false;
    try {
      seen = sessionStorage.getItem(brandRevealSessionKey) === "seen";
    } catch {}
    if (seen || root.dataset.brandIntroExpired === "true") {
      delete root.dataset.brandIntro;
      return;
    }
    root.dataset.brandIntro = "playing";
    const player = video.current;
    const shell = document.getElementById("site-shell");
    if (!player || !shell) {
      delete root.dataset.brandIntro;
      return;
    }

    let finished = false;
    let exitTimer = 0;
    const previousFocus = document.activeElement;
    const wasInert = shell.inert;
    shell.inert = true;
    intro.current?.querySelector("button")?.focus({ preventScroll: true });

    const release = () => {
      delete root.dataset.brandIntro;
      shell.inert = wasInert;
      player.pause();
      player.removeAttribute("src");
      player.load();
      if (intro.current?.contains(document.activeElement)) {
        const target =
          previousFocus instanceof HTMLElement &&
          previousFocus !== document.body
            ? previousFocus
            : document.getElementById("main");
        target?.focus({ preventScroll: true });
      }
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      window.clearTimeout(safetyTimer);
      window.clearTimeout(startupTimer);
      try {
        sessionStorage.setItem(brandRevealSessionKey, "seen");
      } catch {}
      root.dataset.brandIntro = "leaving";
      exitTimer = window.setTimeout(release, 360);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) finish();
    };
    const onProgress = () => {
      if (player.readyState >= 2 && player.currentTime > 0)
        window.clearTimeout(startupTimer);
    };
    const startupTimer = window.setTimeout(finish, 2500);
    const safetyTimer = window.setTimeout(finish, 8000);
    dismiss.current = finish;
    player.addEventListener("ended", finish);
    player.addEventListener("error", finish);
    player.addEventListener("timeupdate", onProgress);
    document.addEventListener("keydown", onKey);
    window.addEventListener("pageshow", onPageShow);
    player.src = "/brand/brand-reveal.mp4";
    player.play().catch(finish);

    return () => {
      finished = true;
      window.clearTimeout(safetyTimer);
      window.clearTimeout(startupTimer);
      window.clearTimeout(exitTimer);
      player.removeEventListener("ended", finish);
      player.removeEventListener("error", finish);
      player.removeEventListener("timeupdate", onProgress);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("pageshow", onPageShow);
      release();
      dismiss.current = () => {};
    };
  }, []);

  return (
    <div
      ref={intro}
      className="brand-reveal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="brand-reveal-title"
      aria-describedby="brand-reveal-description"
    >
      <h2 id="brand-reveal-title" className="sr-only">
        Welcome to Domiorum Architects
      </h2>
      <p id="brand-reveal-description" className="sr-only">
        Our brand introduction plays once. The website opens when the animation
        finishes, or you can skip it.
      </p>
      <video
        ref={video}
        className="brand-reveal-video"
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
      <FlowButton
        className="button-light brand-reveal-skip"
        onClick={() => dismiss.current()}
      >
        Skip intro
      </FlowButton>
    </div>
  );
}
