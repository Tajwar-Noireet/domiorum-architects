"use client";

import { useEffect, useRef } from "react";
import { brandRevealSessionKey } from "@/lib/brand-reveal";

export function BrandReveal() {
  const intro = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

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
    const wasInert = shell.inert;
    shell.inert = true;
    intro.current?.focus({ preventScroll: true });

    const release = (focusMain = false) => {
      delete root.dataset.brandIntro;
      shell.inert = wasInert;
      player.pause();
      player.removeAttribute("src");
      player.load();
      if (focusMain)
        document.getElementById("main")?.focus({ preventScroll: true });
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
      exitTimer = window.setTimeout(() => release(true), 360);
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
    player.addEventListener("ended", finish);
    player.addEventListener("error", finish);
    player.addEventListener("timeupdate", onProgress);
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
      window.removeEventListener("pageshow", onPageShow);
      release();
    };
  }, []);

  return (
    <div
      ref={intro}
      className="brand-reveal"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-labelledby="brand-reveal-title"
      aria-describedby="brand-reveal-description"
    >
      <h2 id="brand-reveal-title" className="sr-only">
        Welcome to Domiorum Architects
      </h2>
      <p id="brand-reveal-description" className="sr-only">
        The website opens when the introduction ends.
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
    </div>
  );
}
