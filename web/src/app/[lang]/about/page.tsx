import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { hasLocale, localePath } from "@/lib/i18n";
import { getDict } from "@/content/ui";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import { SITE } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import { Arrow, Download } from "@/components/Icons";
import { bidi } from "@/components/Bidi";
import PortraitStage from "@/components/PortraitStage";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = getDict(lang).meta.about;
  return buildMetadata({ lang, path: "/about", title: m.title, description: m.desc, type: "article" });
}

export default async function About({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);
  const a = t.about;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: absoluteUrl(localePath(lang, "/about")),
          inLanguage: lang,
          mainEntity: { "@id": `${SITE.url}/#person` },
        }}
      />

      <section className="page-hero">
        <div className="wrap about-grid">
          <div className="about-sticky">
            <PortraitStage
              name={lang === "ar" ? "هشام" : "Hesham"}
              alt={lang === "ar" ? "صورة شخصية لهشام مسعد" : "Portrait of Hesham Mosad"}
              chips={["Full-Stack", ".NET · Laravel"]}
              status={t.home.status}
              preload
            />
          </div>

          <div className="stack-lg">
            <div className="stack">
              <span className="eyebrow">{a.eyebrow}</span>
              <h1 className="h-xl">{bidi(a.title)}</h1>
              <p className="lead" style={{ color: "var(--paper)" }}>{bidi(a.lead)}</p>
              {a.body.map((b) => (
                <p key={b} className="muted" style={{ fontSize: "1.08rem" }}>{bidi(b)}</p>
              ))}
            </div>
            <div className="btn-row">
              <a className="btn btn-primary" href={SITE.resume} download data-magnetic="0.3">
                <Download />
                <span>{t.cta.resume}</span>
              </a>
              <Link className="btn" href={localePath(lang, "/projects")} data-magnetic="0.3">
                <span>{t.cta.work}</span>
                <Arrow />
              </Link>
            </div>

            <div>
              <h2 className="h-md" style={{ marginBottom: "1.2rem" }}>{a.valuesTitle}</h2>
              <div className="values">
                {a.values.map((v, i) => (
                  <div key={v.t} className="panel" data-tilt="8" data-reveal style={{ "--delay": `${i * 80}ms` } as CSSProperties}>
                    <span className="stat-idx">0{i + 1}</span>
                    <h3 style={{ margin: "1.6rem 0 0.5rem", fontSize: "1.2rem" }}>{bidi(v.t)}</h3>
                    <p className="muted">{bidi(v.d)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="h-md" style={{ marginBottom: "1.2rem" }}>{a.educationTitle}</h2>
              <div className="edu">
                {a.education.map((e) => (
                  <div key={e.t} className="edu-row" data-reveal>
                    <div>
                      <h3>{bidi(e.t)}</h3>
                      <p className="muted">{bidi(e.d)}</p>
                    </div>
                    {e.y && <span className="y">{e.y}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="h-md" style={{ marginBottom: "1.2rem" }}>{a.languagesTitle}</h2>
              <div className="values" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
                {a.languages.map((l) => (
                  <div key={l.t} className="panel">
                    <h3 style={{ fontSize: "1.15rem" }}>{l.t}</h3>
                    <p className="muted">{l.l}</p>
                    <div className="lang-meter" aria-label={`${l.v}/5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <i key={n} className={n <= l.v ? "on" : ""} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
