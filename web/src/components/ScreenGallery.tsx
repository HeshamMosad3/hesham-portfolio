"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Screen } from "@/content/projects";
import { Browser, Phone } from "./Devices";

type Labels = { desktop: string; mobile: string; open: string; close: string; hint: string; cursor: string };

/**
 * Real screenshots of the live project.
 * Desktop: a grid of browser windows. Mobile: a 3D fan of phones.
 * Every device scrolls its page on hover; click opens a full-length viewer.
 */
export default function ScreenGallery({ screens, lang, url, labels }: { screens: Screen[]; lang: "ar" | "en"; url?: string; labels: Labels }) {
  const hasDesktop = screens.some((s) => s.desktop);
  const hasMobile = screens.some((s) => s.mobile);
  const [mode, setMode] = useState<"desktop" | "mobile">(hasDesktop ? "desktop" : "mobile");
  const list = screens.filter((s) => s[mode]);
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const current = open !== null ? list[open] : null;
  const img = current ? current[mode] : undefined;

  return (
    <div className="gallery">
      <div className="gallery-top">
        {hasDesktop && hasMobile && <div className="seg" role="tablist" aria-label="Device">
          {(["desktop", "mobile"] as const).map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} className={mode === m ? "on" : ""} onClick={() => setMode(m)} data-magnetic="0.2">
              {labels[m]}
            </button>
          ))}
        </div>}
        <span className="muted gallery-hint">{labels.hint}</span>
      </div>

      {mode === "desktop" ? (
        <div className="g-desktop">
          {list.map((s, i) => (
            <button key={s.id} className="g-item" onClick={() => setOpen(i)} data-tilt="6" data-cursor={labels.cursor} aria-label={`${labels.open}: ${s.label[lang]}`}>
              <Browser img={s.desktop!} url={url} alt={s.label[lang]} sizes="(max-width: 760px) 92vw, 600px" />
              <span className="g-cap"><b>{String(i + 1).padStart(2, "0")}</b> {s.label[lang]}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="g-mobile">
          {list.map((s, i) => (
            <button
              key={s.id}
              className="g-phone"
              onClick={() => setOpen(i)}
              data-cursor={labels.cursor}
              aria-label={`${labels.open}: ${s.label[lang]}`}
              style={{ "--i": i, "--n": list.length } as CSSProperties}
            >
              <Phone img={s.mobile!} alt={s.label[lang]} sizes="240px" eager />
              <span className="g-cap"><b>{String(i + 1).padStart(2, "0")}</b> {s.label[lang]}</span>
            </button>
          ))}
        </div>
      )}

      <dialog ref={dialog} className="viewer" onClose={() => setOpen(null)} onClick={(e) => e.target === e.currentTarget && setOpen(null)}>
        {current && img && (
          <div className="viewer-in">
            <div className="viewer-top">
              <span>
                <b>{current.label[lang]}</b> · {labels[mode]}
              </span>
              <button className="btn btn-sm" onClick={() => setOpen(null)} autoFocus>
                {labels.close}
              </button>
            </div>
            <div className={`viewer-scroll ${mode}`}>
              <Image
                src={img.src}
                alt={current.label[lang]}
                width={img.w}
                height={img.h}
                sizes={mode === "desktop" ? "(max-width: 1100px) 94vw, 1040px" : "390px"}
                loading="eager"
              />
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
