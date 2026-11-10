import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale, localePath } from "@/lib/i18n";
import { getDict } from "@/content/ui";
import { ordered, projects } from "@/content/projects";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import ProjectRows, { type Row } from "@/components/ProjectRows";
import WorkCard, { UpcomingCard } from "@/components/WorkCard";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({ params }: PageProps<"/[lang]/projects">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = getDict(lang).meta.projects;
  return buildMetadata({ lang, path: "/projects", title: m.title, description: m.desc });
}

export default async function Projects({ params }: PageProps<"/[lang]/projects">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);
  const x = t.projects;

  const rows: Row[] = ordered.map((e) =>
    e.kind === "project"
      ? {
          href: localePath(lang, `/projects/${e.p.slug}`),
          index: e.p.index,
          title: e.p.short[lang],
          year: e.p.year,
          context: e.p.context[lang],
          accent: e.p.accent,
          preview: (() => {
            const img = e.p.screens?.[0]?.desktop ?? e.p.screens?.[0]?.mobile;
            return img ? { kind: "image" as const, src: img.src, w: img.w, h: img.h } : { kind: e.p.visual ?? "qr" };
          })(),
        }
      : {
          index: e.u.index,
          title: e.u.short[lang],
          year: "—",
          context: e.u.client[lang],
          accent: e.u.accent,
          preview: { kind: "soon" },
          badge: x.soonTitle,
        },
  );

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: x.title,
          url: absoluteUrl(localePath(lang, "/projects")),
          mainEntity: {
            "@type": "ItemList",
            itemListElement: projects.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: absoluteUrl(localePath(lang, `/projects/${p.slug}`)),
              name: p.title[lang],
            })),
          },
        }}
      />

      <section className="page-hero">
        <div className="wrap stack">
          <span className="eyebrow">{x.eyebrow}</span>
          <h1 className="display">{x.title}</h1>
          <p className="lead">{x.lead}</p>
        </div>
      </section>

      <section className="section-tight" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ProjectRows cursor={t.cursor.view} soonCursor={t.cursor.soon} rows={rows} />
        </div>
      </section>

      <section className="section">
        <div className="wrap work-grid">
          {ordered.map((e, i) =>
            e.kind === "project" ? (
              <WorkCard key={e.p.slug} p={e.p} lang={lang} t={t} delay={i * 100} />
            ) : (
              <UpcomingCard key={e.u.slug} u={e.u} lang={lang} t={t} delay={i * 100} />
            ),
          )}
        </div>
      </section>
    </>
  );
}
