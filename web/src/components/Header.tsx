"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { localePath, type Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";
import { Chat, Grid, Home, Spark, User, WhatsApp } from "./Icons";
import { bidi } from "./Bidi";

type Labels = {
  brand: string;
  tagline: string;
  nav: { home: string; projects: string; about: string; skills: string; services: string; contact: string };
  whatsapp: string;
  switchTo: string;
  switchLabel: string;
  chat: string;
};

const items = [
  { key: "home", path: "/", Icon: Home },
  { key: "projects", path: "/projects", Icon: Grid },
  { key: "about", path: "/about", Icon: User },
  { key: "skills", path: "/skills", Icon: Spark, desktopOnly: true },
  { key: "services", path: "/services", Icon: Spark },
  { key: "contact", path: "/contact", Icon: Chat },
] as const;

const logical = (p: string) => p.replace(/^\/(ar|en)(?=\/|$)/, "") || "/";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function Header({ lang, l }: { lang: Locale; l: Labels }) {
  const pathname = usePathname();
  const current = logical(pathname);
  const isActive = (path: string) => (path === "/" ? current === "/" : current === path || current.startsWith(path + "/"));
  const other: Locale = lang === "ar" ? "en" : "ar";

  const navRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<{ left: number; width: number } | null>(null);
  const [hover, setHover] = useState<{ left: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const a = nav.querySelector<HTMLElement>('a[aria-current="page"]');
    setActive(a ? { left: a.offsetLeft, width: a.offsetWidth } : null);
  }, []);

  useIsoLayoutEffect(() => {
    measure();
  }, [pathname, measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Solid backdrop once scrolled; hide while scrolling down, reveal on scroll up.
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 320);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <header className={`site-header ${scrolled ? "is-scrolled" : ""} ${hidden ? "is-hidden" : ""}`} id="top" onFocus={() => setHidden(false)}>
        <div className="wrap">
          <Link href={localePath(lang, "/")} className="logo" aria-label={l.brand} data-magnetic="0.15">
            <span className="logo-mark" aria-hidden="true">HM</span>
            <span className="logo-text">
              <span>{l.brand}</span>
              <small>{bidi(l.tagline)}</small>
            </span>
          </Link>

          <nav ref={navRef} className="nav-pill" aria-label="Main" onMouseLeave={() => setHover(null)}>
            {active && <span className="nav-active" style={{ left: active.left, width: active.width }} aria-hidden="true" />}
            <span className="nav-ind" style={hover ? { left: hover.left, width: hover.width, opacity: 1 } : { opacity: 0 }} aria-hidden="true" />
            {items.map((i) => {
              const on = isActive(i.path);
              return (
                <Link
                  key={i.key}
                  href={localePath(lang, i.path)}
                  aria-current={on ? "page" : undefined}
                  onMouseEnter={(e) => {
                    if (on) return setHover(null);
                    const el = e.currentTarget;
                    setHover({ left: el.offsetLeft, width: el.offsetWidth });
                  }}
                >
                  {l.nav[i.key]}
                </Link>
              );
            })}
          </nav>

          <div className="header-actions">
            <Link className="icon-btn" href={localePath(other, current)} hrefLang={other} lang={other} aria-label={l.switchLabel} data-magnetic="0.35">
              {l.switchTo}
            </Link>
            <a
              className="icon-btn header-cta"
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={l.whatsapp}
              data-magnetic="0.35"
              data-cursor={l.chat}
            >
              <WhatsApp width={20} height={20} />
            </a>
          </div>
        </div>
      </header>

      <nav className="tabbar" aria-label="Mobile">
        {items
          .filter((i) => !("desktopOnly" in i))
          .map(({ key, path, Icon }) => (
            <Link key={key} href={localePath(lang, path)} aria-current={isActive(path) ? "page" : undefined}>
              <Icon />
              <span>{l.nav[key]}</span>
            </Link>
          ))}
      </nav>
    </>
  );
}
