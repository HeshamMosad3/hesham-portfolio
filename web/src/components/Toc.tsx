"use client";

import { useEffect, useRef, useState } from "react";

/** Sticky table of contents with scroll-spy and a reading-progress bar. */
export default function Toc({ sections, title }: { sections: { id: string; label: string }[]; title: string }) {
  const [active, setActive] = useState(sections[0]?.id);
  const bar = useRef<HTMLElement>(null);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-25% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));

    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - innerHeight;
      const p = h > 0 ? Math.min(scrollY / h, 1) : 0;
      if (top.current) top.current.style.transform = `scaleX(${p})`;
      const first = els[0], last = els[els.length - 1];
      if (bar.current && first && last) {
        const a = first.getBoundingClientRect().top + scrollY - innerHeight * 0.3;
        const b = last.getBoundingClientRect().bottom + scrollY - innerHeight * 0.7;
        const q = Math.max(0, Math.min(1, (scrollY - a) / Math.max(1, b - a)));
        bar.current.style.transform = `scaleX(${q})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
    };
  }, [sections]);

  return (
    <>
      <div ref={top} className="read-bar" aria-hidden="true" />
      <nav className="toc" aria-label={title}>
        <span className="toc-title">{title}</span>
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`} className={active === s.id ? "active" : ""} aria-current={active === s.id ? "true" : undefined}>
            {s.label}
          </a>
        ))}
        <div className="toc-progress" aria-hidden="true">
          <i ref={bar} />
        </div>
      </nav>
    </>
  );
}
