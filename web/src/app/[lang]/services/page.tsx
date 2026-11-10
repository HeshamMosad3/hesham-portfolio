import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { hasLocale } from "@/lib/i18n";
import { getDict } from "@/content/ui";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { ArrowUpRight, WhatsApp } from "@/components/Icons";
import { bidi } from "@/components/Bidi";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = getDict(lang).meta.services;
  return buildMetadata({ lang, path: "/services", title: m.title, description: m.desc });
}

export default async function Services({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);
  const s = t.services;
  const wa = `https://wa.me/${SITE.whatsapp}`;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: s.items.map((it, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: { "@type": "Service", name: it.t, description: it.d, provider: { "@id": `${SITE.url}/#person` }, areaServed: "EG" },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            inLanguage: lang,
            mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />

      <section className="page-hero">
        <div className="wrap stack">
          <span className="eyebrow">{s.eyebrow}</span>
          <h1 className="display">{s.title}</h1>
          <p className="lead">{s.lead}</p>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          {s.items.map((it, i) => (
            <a
              key={it.t}
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="srow"
              data-reveal
              data-cursor={t.cursor.chat}
              style={{ "--delay": `${i * 60}ms` } as CSSProperties}
            >
              <span className="srow-idx">0{i + 1}</span>
              <h2 className="h-md">{bidi(it.t)}</h2>
              <p className="muted">{bidi(it.d)}</p>
              <span className="srow-arrow"><ArrowUpRight /></span>
            </a>
          ))}
          <p className="muted" style={{ marginTop: "1.6rem" }}>{s.note}</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ display: "grid", gap: "clamp(2rem, 5vw, 5rem)", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", alignItems: "start" }}>
          <div className="stack">
            <span className="eyebrow">FAQ</span>
            <h2 className="h-xl">{s.faqTitle}</h2>
            <a className="btn btn-primary" href={wa} target="_blank" rel="noopener noreferrer" data-magnetic="0.3" style={{ marginTop: "1.6rem" }}>
              <WhatsApp width={18} height={18} />
              <span>{t.cta.whatsapp}</span>
            </a>
          </div>
          <div className="faq">
            {s.faq.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>
                  {bidi(f.q)}
                  <span className="pm" aria-hidden="true" />
                </summary>
                <p>{bidi(f.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
