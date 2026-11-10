import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content/ui";
import { SITE } from "@/lib/site";
import { LocalTime } from "./Live";
import { ArrowUp, GitHub, LinkedIn, WhatsApp } from "./Icons";

export default function Footer({ lang, t }: { lang: Locale; t: Dict }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-col stack">
            <p className="h-md" style={{ fontFamily: "var(--f-display)", fontWeight: 600, maxWidth: "22ch" }}>
              {t.home.ctaTitle.join(" ")}
            </p>
            <div className="btn-row">
              <a className="btn btn-primary" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" data-magnetic="0.25">
                <WhatsApp width={18} height={18} />
                <span>{t.cta.whatsapp}</span>
              </a>
            </div>
          </div>
          <div className="foot-col">
            <h4>{t.nav.home}</h4>
            <ul>
              {(["projects", "about", "skills", "services", "contact"] as const).map((k) => (
                <li key={k}>
                  <Link className="link-u" href={localePath(lang, `/${k}`)}>{t.nav[k]}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="foot-col">
            <h4>{t.contact.social}</h4>
            <ul>
              <li><a className="link-u ltr" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
              <li>
                <a className="link-u" href={SITE.github} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                  <GitHub width={16} height={16} /> GitHub
                </a>
              </li>
              <li>
                <a className="link-u" href={SITE.linkedin} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
                  <LinkedIn width={16} height={16} /> LinkedIn
                </a>
              </li>
              <li className="muted">
                {t.home.location} · <LocalTime locale={lang} />
              </li>
            </ul>
          </div>
        </div>

        <span className="wordmark" aria-hidden="true">{t.brand}</span>

        <div className="foot-bottom">
          <span>© {year} {t.brand} · {t.footer.rights}</span>
          <span>{t.footer.built}</span>
          <a href="#top" className="link-u" style={{ display: "inline-flex", gap: 6, alignItems: "center" }} data-magnetic="0.3">
            {t.cta.top} <ArrowUp width={14} height={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
