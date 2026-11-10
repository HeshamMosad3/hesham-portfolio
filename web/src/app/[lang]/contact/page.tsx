import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { hasLocale, localePath } from "@/lib/i18n";
import { getDict } from "@/content/ui";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import { SITE } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { CopyButton, LocalTime } from "@/components/Live";
import { ArrowUpRight, Download, GitHub, LinkedIn, WhatsApp } from "@/components/Icons";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = getDict(lang).meta.contact;
  return buildMetadata({ lang, path: "/contact", title: m.title, description: m.desc });
}

export default async function Contact({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);
  const c = t.contact;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          url: absoluteUrl(localePath(lang, "/contact")),
          inLanguage: lang,
          mainEntity: { "@id": `${SITE.url}/#person` },
        }}
      />

      <section className="page-hero">
        <div className="wrap stack">
          <span className="eyebrow">{c.eyebrow}</span>
          <h1 className="display">{c.title}</h1>
          <p className="lead">{c.lead}</p>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="wrap contact-grid">
          <a
            className="panel cbox cbox-wa"
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            data-tilt="6"
            data-cursor={t.cursor.chat}
            data-reveal
          >
            <div className="cbox-row">
              <small>{c.items.whatsapp}</small>
              <WhatsApp width={28} height={28} />
            </div>
            <div className="cbox-row">
              <span className="v ltr">+{SITE.whatsapp}</span>
              <ArrowUpRight width={26} height={26} />
            </div>
          </a>

          <div className="panel cbox" data-tilt="6" data-reveal style={{ "--delay": "80ms" } as CSSProperties}>
            <div className="cbox-row">
              <small>{c.items.email}</small>
              <CopyButton value={SITE.email} label={t.cta.copy} done={t.cta.copied} cursor={t.cursor.copy} />
            </div>
            <a className="v ltr" href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </div>

          <a className="panel cbox" href={`tel:${SITE.phone}`} data-tilt="6" data-reveal style={{ "--delay": "140ms" } as CSSProperties}>
            <div className="cbox-row">
              <small>{c.items.phone}</small>
              <ArrowUpRight width={22} height={22} />
            </div>
            <span className="v ltr">{SITE.phone}</span>
          </a>

          <div className="panel cbox" data-tilt="6" data-reveal style={{ "--delay": "200ms" } as CSSProperties}>
            <div className="cbox-row">
              <small>{c.items.location}</small>
              <span className="mono muted" style={{ fontSize: "0.85rem" }}><LocalTime locale={lang} /></span>
            </div>
            <span className="v">{c.items.locationValue}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "2rem" }}>
          <div className="stack-sm">
            <span className="eyebrow">{c.social}</span>
            <div className="btn-row">
              <a className="btn" href={SITE.github} target="_blank" rel="noopener noreferrer" data-magnetic="0.3">
                <GitHub width={18} height={18} />
                <span>GitHub</span>
              </a>
              <a className="btn" href={SITE.linkedin} target="_blank" rel="noopener noreferrer" data-magnetic="0.3">
                <LinkedIn width={18} height={18} />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
          <div className="stack-sm">
            <p className="muted">{c.resumeText}</p>
            <a className="btn btn-primary" href={SITE.resume} download data-magnetic="0.3">
              <Download />
              <span>{t.cta.resume}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
