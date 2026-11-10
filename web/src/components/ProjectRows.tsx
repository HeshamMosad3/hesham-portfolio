"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import ProjectVisual from "./ProjectVisual";
import { bidi } from "./Bidi";

export type Row = {
  href?: string;
  index: string;
  title: string;
  year: string;
  context: string;
  accent: string;
  preview: { kind: "image"; src: string; w: number; h: number } | { kind: "qr" | "graph" } | { kind: "soon" };
  badge?: string;
};

/** Large editorial rows; a live preview card follows the cursor while hovering. */
export default function ProjectRows({ rows, cursor, soonCursor }: { rows: Row[]; cursor: string; soonCursor: string }) {
  const [hot, setHot] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, cx: 0, cy: 0 });

  useEffect(() => {
    // Follow the pointer only while it moves; stop once the card has caught up.
    let raf = 0;
    let running = false;
    const loop = () => {
      const p = pos.current;
      p.cx += (p.x - p.cx) * 0.14;
      p.cy += (p.y - p.cy) * 0.14;
      if (preview.current) preview.current.style.translate = `${p.cx - 180}px ${p.cy - 135}px`;
      if (Math.abs(p.x - p.cx) + Math.abs(p.y - p.cy) > 0.3) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const pv = hot !== null ? rows[hot].preview : null;

  return (
    <div className="plist" onMouseLeave={() => setHot(null)}>
      {rows.map((r, i) => {
        const inner = (
          <>
            <span className="prow-idx">{r.index}</span>
            <h2 className="prow-title">
              {bidi(r.title)} {r.badge && <span className="soon-badge" style={{ verticalAlign: "middle", fontSize: "0.8rem" }}>{r.badge}</span>}
            </h2>
            <span className="prow-meta">
              <span>{r.year}</span>
              <span>{bidi(r.context)}</span>
            </span>
          </>
        );
        const common = {
          className: "prow",
          "data-reveal": true,
          style: { "--accent": r.accent, "--delay": `${i * 90}ms` } as CSSProperties,
          onMouseEnter: () => setHot(i),
        };
        return r.href ? (
          <Link key={r.index} href={r.href} data-cursor={cursor} {...common}>
            {inner}
          </Link>
        ) : (
          <div key={r.index} data-cursor={soonCursor} {...common}>
            {inner}
          </div>
        );
      })}
      <div ref={preview} className={`prow-preview ${hot !== null ? "on" : ""}`} aria-hidden="true">
        {pv?.kind === "image" && <Image src={pv.src} alt="" width={pv.w} height={pv.h} sizes="360px" style={{ width: "100%", height: "auto" }} />}
        {(pv?.kind === "qr" || pv?.kind === "graph") && <ProjectVisual key={pv.kind} kind={pv.kind} />}
        {pv?.kind === "soon" && <div className="skel" style={{ height: "100%", aspectRatio: "auto", borderRadius: 0 }}><i className="sk-search" /><i className="sk-banner" /><div className="sk-grid"><i /><i /><i /><i /></div></div>}
      </div>
    </div>
  );
}
