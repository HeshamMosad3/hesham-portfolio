import Image from "next/image";
import type { CSSProperties } from "react";
import type { Img } from "@/content/projects";
import { bidi } from "./Bidi";

/** Scroll duration scales with how long the page is, so every screen scrolls at a similar speed. */
const dur = (img: Img) => `${Math.min(16, Math.max(3, (img.h / img.w) * 1.6)).toFixed(1)}s`;

/** A browser window whose screenshot scrolls from top to bottom on hover (auto-scrolls on touch). */
export function Browser({ img, url, alt, sizes, className = "", style, preload = false }: { img: Img; url?: string; alt: string; sizes: string; className?: string; style?: CSSProperties; preload?: boolean }) {
  return (
    <span className={`browser ${className}`} style={style}>
      <span className="browser-bar" aria-hidden="true">
        <i /><i /><i />
        {url && <span className="browser-url ltr">{url}</span>}
      </span>
      <span className="shot" style={{ "--dur": dur(img) } as CSSProperties}>
        <Image src={img.src} alt={alt} width={img.w} height={img.h} sizes={sizes} preload={preload} />
      </span>
    </span>
  );
}

/** A phone frame with the same scroll-on-hover screen. */
export function Phone({ img, alt, sizes, className = "", style, preload = false, eager = false }: { img: Img; alt: string; sizes: string; className?: string; style?: CSSProperties; preload?: boolean; eager?: boolean }) {
  return (
    <span className={`phone ${className}`} style={style}>
      <span className="phone-island" aria-hidden="true" />
      {/* App screenshots (one screen tall) keep their own ratio; long web pages scroll inside a 390×844 screen. */}
      <span className="shot" style={{ "--dur": dur(img), ...(img.h / img.w < 844 / 390 ? { aspectRatio: `${img.w} / ${img.h}` } : {}) } as CSSProperties}>
        <Image src={img.src} alt={alt} width={img.w} height={img.h} sizes={sizes} preload={preload} loading={eager && !preload ? "eager" : undefined} />
      </span>
    </span>
  );
}

/**
 * 3D composition: browser in the back, phone floating in front, number chips
 * orbiting at different depths. The whole stage tilts with the pointer
 * (data-tilt), each layer sits at its own depth (data-depth).
 */
export function DeviceStage({
  desktop,
  mobile,
  url,
  alt,
  floats = [],
  size = "card",
  cursor,
  preload = false,
}: {
  desktop: Img;
  mobile: Img;
  url?: string;
  alt: string;
  floats?: string[];
  size?: "card" | "hero";
  cursor?: string;
  preload?: boolean;
}) {
  const hero = size === "hero";
  return (
    <div className={`stage stage-${size}`} data-tilt={hero ? "7" : "9"} data-cursor={cursor}>
      <span className="stage-glow" aria-hidden="true" />
      <span className="stage-grid" aria-hidden="true" />
      <Browser
        img={desktop}
        url={url}
        alt={alt}
        sizes={hero ? "(max-width: 900px) 90vw, 1000px" : "(max-width: 900px) 80vw, 560px"}
        className="stage-browser"
        style={{ "--d": 30 } as CSSProperties}
        preload={preload}
      />
      <Phone
        img={mobile}
        alt={alt}
        sizes={hero ? "(max-width: 900px) 30vw, 260px" : "(max-width: 900px) 26vw, 160px"}
        className="stage-phone"
        style={{ "--d": 90 } as CSSProperties}
        preload={preload}
      />
      {floats.map((f, i) => (
        <span key={f} className={`float-chip fc-${i}`} data-depth style={{ "--d": 130 + i * 20 } as CSSProperties} aria-hidden="true">
          {bidi(f)}
        </span>
      ))}
    </div>
  );
}

/**
 * Mobile-only projects: three phones fanned out in 3D. The middle one sits in
 * front; the side ones lean back. Each sits at its own depth and the whole
 * stage tilts with the pointer.
 */
export function PhoneTrio({
  phones,
  alt,
  floats = [],
  size = "card",
  cursor,
  preload = false,
}: {
  phones: Img[];
  alt: string;
  floats?: string[];
  size?: "card" | "hero";
  cursor?: string;
  preload?: boolean;
}) {
  const [a, b, c] = phones;
  const hero = size === "hero";
  const sizes = hero ? "(max-width: 900px) 40vw, 300px" : "(max-width: 900px) 34vw, 200px";
  return (
    <div className={`stage stage-${size} stage-trio`} data-tilt={hero ? "7" : "9"} data-cursor={cursor}>
      <span className="stage-glow" aria-hidden="true" />
      <span className="stage-grid" aria-hidden="true" />
      {b && <Phone img={b} alt={alt} sizes={sizes} className="trio-phone trio-side trio-start" preload={preload} />}
      {c && <Phone img={c} alt={alt} sizes={sizes} className="trio-phone trio-side trio-end" preload={preload} />}
      {a && <Phone img={a} alt={alt} sizes={sizes} className="trio-phone trio-main" preload={preload} />}
      {floats.map((f, i) => (
        <span key={f} className={`float-chip fc-${i}`} data-depth style={{ "--d": 140 + i * 20 } as CSSProperties} aria-hidden="true">
          {bidi(f)}
        </span>
      ))}
    </div>
  );
}

/** Teaser for a confidential, pre-launch app: a phone with a skeleton UI and a lock. */
export function ComingSoonPhone({ label }: { label: string }) {
  return (
    <div className="stage stage-card stage-soon" data-tilt="9">
      <span className="stage-glow" aria-hidden="true" />
      <span className="stage-grid" aria-hidden="true" />
      <div className="phone stage-phone-solo" data-depth style={{ "--d": 60 } as CSSProperties}>
        <span className="phone-island" aria-hidden="true" />
        <div className="skel" aria-hidden="true">
          <i className="sk-search" />
          <div className="sk-chips"><i /><i /><i /></div>
          <i className="sk-banner" />
          <div className="sk-grid"><i /><i /><i /><i /></div>
        </div>
        <span className="lock" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="5" y="10.5" width="14" height="10" rx="2.5" /><path d="M8 10.5V8a4 4 0 018 0v2.5" /></svg>
        </span>
      </div>
      <span className="float-chip fc-0" data-depth style={{ "--d": 130 } as CSSProperties}>{label}</span>
    </div>
  );
}
