"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide pointer interactions, driven by data attributes so server
 * components can opt in without shipping their own client JS:
 *
 *  - custom cursor (dot + ring) with hover / label / text states
 *      data-cursor="label"     → ring grows and shows the label
 *  - [data-magnetic="0.3"]     → element is pulled toward the pointer
 *  - [data-tilt="8"]           → 3D tilt (degrees) following the pointer
 *  - .panel / [data-spot]      → --sx / --sy spotlight coordinates
 *  - .btn                      → --bx / --by fill origin on enter / leave
 *  - .wordmark                 → spotlight follows the pointer anywhere
 *  - [data-reveal]             → fades in when scrolled into view
 *  - ambient page light        → --px / --py on <html>
 *
 * Everything is skipped on touch-only devices and for reduced motion.
 */
export default function Interactions() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  // Pointer engine (mounted once).
  useEffect(() => {
    const root = document.documentElement;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine) return;

    const useCursor = !reduced;
    if (useCursor) root.classList.add("has-cursor");

    let mx = -100, my = -100;   // pointer
    let rx = -100, ry = -100;   // ring (lerped)
    let raf = 0;
    let magEl: HTMLElement | null = null;
    let magRect: DOMRect | null = null;
    let tiltEl: HTMLElement | null = null;
    let tiltRect: DOMRect | null = null;
    const wordmarks = Array.from(document.querySelectorAll<HTMLElement>(".wordmark"));

    const releaseMag = () => {
      if (!magEl) return;
      magEl.classList.remove("mag-active");
      magEl.style.transform = "";
      magEl = null;
      magRect = null;
    };
    const releaseTilt = () => {
      if (!tiltEl) return;
      tiltEl.classList.remove("tilt-active");
      tiltEl.style.transform = "";
      tiltEl = null;
      tiltRect = null;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      kick();
      root.style.setProperty("--px", `${mx}px`);
      root.style.setProperty("--py", `${my}px`);

      const target = e.target as Element | null;
      if (!target || !target.closest) return;

      // Spotlight panels
      const spot = target.closest<HTMLElement>(".panel, [data-spot]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--sx", `${mx - r.left}px`);
        spot.style.setProperty("--sy", `${my - r.top}px`);
      }

      // Footer wordmark follows the pointer everywhere it is visible
      for (const w of wordmarks) {
        const r = w.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        w.style.setProperty("--sx", `${mx - r.left}px`);
        w.style.setProperty("--sy", `${my - r.top}px`);
      }

      if (reduced) return;

      // Magnetic
      const mag = target.closest<HTMLElement>("[data-magnetic]");
      if (mag !== magEl) {
        releaseMag();
        if (mag) {
          magEl = mag;
          mag.style.transform = "";
          magRect = mag.getBoundingClientRect();
          mag.classList.add("mag-active");
        }
      }
      if (magEl && magRect) {
        const s = parseFloat(magEl.dataset.magnetic || "0.3") || 0.3;
        const dx = mx - (magRect.left + magRect.width / 2);
        const dy = my - (magRect.top + magRect.height / 2);
        magEl.style.transform = `translate3d(${dx * s}px, ${dy * s}px, 0)`;
      }

      // Tilt
      const tilt = target.closest<HTMLElement>("[data-tilt]");
      if (tilt !== tiltEl) {
        releaseTilt();
        if (tilt) {
          tiltEl = tilt;
          tilt.style.transform = "";
          tiltRect = tilt.getBoundingClientRect();
          tilt.classList.add("tilt-active");
        }
      }
      if (tiltEl && tiltRect) {
        const deg = parseFloat(tiltEl.dataset.tilt || "6") || 6;
        const px = (mx - tiltRect.left) / tiltRect.width - 0.5;
        const py = (my - tiltRect.top) / tiltRect.height - 0.5;
        tiltEl.style.transform = `perspective(1100px) rotateX(${(-py * deg).toFixed(2)}deg) rotateY(${(px * deg).toFixed(2)}deg)`;
      }
    };

    // Cursor states
    const setState = (t: Element | null) => {
      root.classList.remove("cursor-hover", "cursor-label", "cursor-text", "cursor-dark");
      if (!t || !t.closest) return;
      const labelled = t.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        root.classList.add("cursor-label");
        // Lime surfaces (service rows, WhatsApp box) need a dark label bubble.
        if (labelled.matches(".srow, .cbox-wa, .cta-orb, .header-cta")) root.classList.add("cursor-dark");
        if (label.current) label.current.textContent = labelled.dataset.cursor || "";
        return;
      }
      if (t.closest("a, button, summary, [role='button'], label, select")) {
        root.classList.add("cursor-hover");
        return;
      }
      if (t.closest("input, textarea")) root.classList.add("cursor-text");
    };
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = e.target as Element;
      setState(t);
      const btn = t.closest?.<HTMLElement>(".btn");
      const from = e.relatedTarget as Element | null;
      if (btn && !(from && btn.contains(from))) {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--bx", `${e.clientX - r.left}px`);
        btn.style.setProperty("--by", `${e.clientY - r.top}px`);
      }
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as Element;
      const btn = t.closest?.<HTMLElement>(".btn");
      const to = e.relatedTarget as Element | null;
      if (btn && !(to && btn.contains(to))) {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--bx", `${e.clientX - r.left}px`);
        btn.style.setProperty("--by", `${e.clientY - r.top}px`);
      }
      if (!to) {
        releaseMag();
        releaseTilt();
      }
    };
    const onDown = () => root.classList.add("cursor-down");
    const onUp = () => root.classList.remove("cursor-down");
    const onLeaveWindow = () => {
      if (dot.current) dot.current.style.opacity = "0";
      if (ring.current) ring.current.style.opacity = "0";
    };
    const onEnterWindow = () => {
      if (dot.current) dot.current.style.opacity = "";
      if (ring.current) ring.current.style.opacity = "";
    };
    const onScroll = () => {
      // Rects change while scrolling; re-measure on next move.
      releaseMag();
      releaseTilt();
    };

    // The cursor only animates while it is catching up with the pointer;
    // once it settles the loop stops, so an idle page does no work at all.
    let running = false;
    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      if (Math.abs(mx - rx) + Math.abs(my - ry) > 0.3) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const kick = () => {
      if (!useCursor || running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);
    document.documentElement.addEventListener("mouseenter", onEnterWindow);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      document.documentElement.removeEventListener("mouseenter", onEnterWindow);
      root.classList.remove("has-cursor", "cursor-hover", "cursor-label", "cursor-text", "cursor-down");
    };
  }, []);

  // Reveal-on-scroll; re-scanned on every route change.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("cursor-hover", "cursor-label", "cursor-text", "cursor-dark");
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach((el) => io.observe(el));

    // Pause every looping CSS animation inside blocks that are off screen
    // (auto-scrolling screenshots, floating phones, chips, rings, marquee).
    const animated = Array.from(document.querySelectorAll<HTMLElement>(".stage, .ps-stage, .marquee, .hero, .flow, .scroll-cue, .g-mobile, .g-desktop"));
    const pauser = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle("is-off", !e.isIntersecting);
      },
      { rootMargin: "120px 0px" },
    );
    animated.forEach((el) => pauser.observe(el));

    return () => {
      io.disconnect();
      pauser.disconnect();
    };
  }, [pathname]);

  return (
    <>
      <div className="ambient" aria-hidden="true" />
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <span ref={label} />
      </div>
    </>
  );
}
