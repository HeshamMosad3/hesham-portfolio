"use client";

import { useEffect, useRef, useState } from "react";

/** Statement whose words light up one by one as it scrolls through the viewport. */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(/\s+/);
  const [lit, setLit] = useState(words.length);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.35;
      const p = (start - r.top) / (start - end + r.height * 0.6);
      setLit(Math.round(Math.max(0, Math.min(1, p)) * words.length));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [words.length]);

  return (
    <p ref={ref} className={`statement ${className}`}>
      {words.map((w, i) => (
        <span key={i}>
          <span className={`sw ${i < lit ? "on" : ""}`}>{w}</span>{" "}
        </span>
      ))}
    </p>
  );
}

/** Animated number. Server renders the final value so crawlers and no-JS users see it. */
export function CountUp({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1600;
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          setN(Math.round(value * (1 - Math.pow(1 - p, 4))));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        setN(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className="stat-num">
      {prefix}
      {n}
      {suffix}
    </span>
  );
}

/** Live local time in Assiut (Africa/Cairo). Renders a placeholder until mounted to avoid hydration mismatch. */
export function LocalTime({ locale }: { locale: string }) {
  const [now, setNow] = useState<string>("--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, [locale]);
  return <span suppressHydrationWarning>{now}</span>;
}

/** Copy-to-clipboard button with feedback. */
export function CopyButton({ value, label, done, cursor }: { value: string; label: string; done: string; cursor: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className="btn btn-sm"
      data-magnetic="0.25"
      data-cursor={cursor}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          setTimeout(() => setOk(false), 1800);
        } catch {
          /* clipboard blocked: do nothing */
        }
      }}
      aria-live="polite"
    >
      {ok ? done : label}
    </button>
  );
}
