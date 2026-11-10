import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { hasLocale, localePath } from "@/lib/i18n";
import { getDict } from "@/content/ui";
import { buildMetadata } from "@/lib/seo";
import { Arrow } from "@/components/Icons";
import { bidi } from "@/components/Bidi";

export async function generateMetadata({ params }: PageProps<"/[lang]/skills">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = getDict(lang).meta.skills;
  return buildMetadata({ lang, path: "/skills", title: m.title, description: m.desc });
}

const isLatin = (s: string) => /^[\x00-\x7F]+$/.test(s);

export default async function Skills({ params }: PageProps<"/[lang]/skills">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);
  const s = t.skills;

  return (
    <>
      <section className="page-hero">
        <div className="wrap stack">
          <span className="eyebrow">{s.eyebrow}</span>
          <h1 className="display">{bidi(s.title)}</h1>
          <p className="lead">{s.lead}</p>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="wrap skill-grid">
          {s.groups.map((g, i) => (
            <div key={g.t} className="panel skill" data-tilt="5" data-reveal style={{ "--delay": `${i * 70}ms` } as CSSProperties}>
              <span className="skill-n">0{i + 1} / 0{s.groups.length}</span>
              <h2>{bidi(g.t)}</h2>
              <p className="muted" style={{ maxWidth: "48ch" }}>{bidi(g.e)}</p>
              <div className="chips">
                {g.items.map((it) => (
                  <span key={it} className={`chip ${isLatin(it) ? "" : "ar"}`} data-magnetic="0.4">{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ textAlign: "center" }}>
          <Link className="btn btn-primary btn-lg" href={localePath(lang, "/projects")} data-magnetic="0.3">
            <span>{t.cta.work}</span>
            <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
