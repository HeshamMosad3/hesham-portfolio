import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { hasLocale, localePath, locales } from "@/lib/i18n";
import { getDict } from "@/content/ui";
import { getProject, projects } from "@/content/projects";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import { SITE } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import ProjectVisual from "@/components/ProjectVisual";
import Toc from "@/components/Toc";
import Flow from "@/components/Flow";
import { CountUp } from "@/components/Live";
import { Arrow, ArrowUpRight, GitHub, WhatsApp } from "@/components/Icons";
import { DeviceStage, PhoneTrio } from "@/components/Devices";
import ScreenGallery from "@/components/ScreenGallery";
import { bidi } from "@/components/Bidi";

export function generateStaticParams() {
  return locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/projects/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = getProject(slug);
  if (!hasLocale(lang) || !p) return {};
  return buildMetadata({
    lang,
    path: `/projects/${slug}`,
    title: `${p.title[lang]} | ${SITE.name[lang]}`,
    description: p.summary[lang],
    type: "article",
  });
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/projects/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const p = getProject(slug);
  if (!p) notFound();
  const t = getDict(lang);
  const x = t.projects;
  const next = projects[(projects.findIndex((q) => q.slug === slug) + 1) % projects.length];

  const sections = [
    { id: "overview", label: x.overview },
    ...(p.screens?.length ? [{ id: "screens", label: x.screensTitle }] : []),
    { id: "numbers", label: x.statsTitle },
    ...(p.responsibilities?.length ? [{ id: "role", label: x.respTitle }] : []),
    { id: "features", label: x.featuresTitle },
    { id: "flow", label: x.flowTitle },
    { id: "stack", label: x.stackTitle },
    { id: "challenges", label: x.challengesTitle },
    ...(p.timeline?.length ? [{ id: "timeline", label: x.timelineTitle }] : []),
  ];
  const hero = p.screens?.[0];
  const phones = (p.screens ?? []).map((s) => s.mobile).filter((m): m is NonNullable<typeof m> => !!m);
  const heroImg = hero?.desktop ?? hero?.mobile;

  const url = absoluteUrl(localePath(lang, `/projects/${slug}`));
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": p.github ? "SoftwareSourceCode" : "CreativeWork",
      name: p.title[lang],
      description: p.summary[lang],
      url,
      ...(p.github ? { codeRepository: p.github } : {}),
      ...(p.live ? { sameAs: p.live } : {}),
      ...(heroImg ? { image: absoluteUrl(heroImg.src) } : {}),
      programmingLanguage: p.stack.flatMap((g) => g.items).filter((i) => ["C#", "PHP", "JavaScript", "jQuery"].includes(i)),
      author: { "@id": `${SITE.url}/#person` },
      dateCreated: p.year,
      inLanguage: lang,
      keywords: p.stack.flatMap((g) => g.items).join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.nav.home, item: absoluteUrl(localePath(lang, "/")) },
        { "@type": "ListItem", position: 2, name: t.nav.projects, item: absoluteUrl(localePath(lang, "/projects")) },
        { "@type": "ListItem", position: 3, name: p.title[lang], item: url },
      ],
    },
  ];

  const accent = { "--accent": p.accent } as CSSProperties;

  return (
    <div style={accent}>
      <JsonLd data={ld} />

      <section className="page-hero" style={{ paddingBottom: "2.5rem" }}>
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href={localePath(lang, "/projects")} className="link-u">{t.nav.projects}</Link>
            <span aria-hidden="true">/</span>
            <span>{p.index}</span>
          </nav>
          <div className="stack">
            <span className="eyebrow">{bidi(p.context[lang])}</span>
            <h1 className="display" style={{ maxWidth: "18ch" }}>{bidi(p.title[lang])}</h1>
            <p className="lead">{bidi(p.tagline[lang])}</p>
          </div>
          <div className="btn-row" style={{ marginTop: "2rem" }}>
            {p.live && (
              <a className="btn btn-primary" href={p.live} target="_blank" rel="noopener noreferrer" data-magnetic="0.3">
                <span>{t.cta.live}</span>
                <ArrowUpRight />
              </a>
            )}
            {p.github && (
              <a className={`btn ${p.live ? "" : "btn-primary"}`} href={p.github} target="_blank" rel="noopener noreferrer" data-magnetic="0.3">
                <GitHub width={18} height={18} />
                <span>{t.cta.github}</span>
              </a>
            )}
            <a className="btn" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" data-magnetic="0.3">
              <WhatsApp width={18} height={18} />
              <span>{t.cta.whatsapp}</span>
            </a>
          </div>

          <div className="meta-grid">
            <div><small>{x.meta.role}</small><b>{bidi(p.role[lang])}</b></div>
            <div><small>{x.meta.client}</small><b>{bidi(p.client[lang])}</b></div>
            {p.duration ? (
              <div><small>{x.meta.duration}</small><b>{bidi(p.duration[lang])}</b></div>
            ) : (
              <div><small>{x.meta.year}</small><b>{p.year}</b></div>
            )}
          </div>

          {hero && !hero.desktop && phones.length ? (
            <figure className="p-stage" style={{ "--accent": p.accent, margin: 0 } as CSSProperties}>
              <PhoneTrio
                size="hero"
                phones={phones.slice(0, 3)}
                alt={p.title[lang]}
                floats={p.floats?.map((f) => f[lang])}
                cursor={t.cursor.view}
              />
              <figcaption className="muted" style={{ marginTop: "1rem", fontSize: "0.85rem", textAlign: "center" }}>{x.appShots}</figcaption>
            </figure>
          ) : hero?.desktop && hero.mobile ? (
            <figure className="p-stage" style={{ "--accent": p.accent, margin: 0 } as CSSProperties}>
              <DeviceStage
                size="hero"
                desktop={hero.desktop}
                mobile={hero.mobile}
                url={p.liveLabel}
                alt={`${p.title[lang]} · ${hero.label[lang]}`}
                floats={p.floats?.map((f) => f[lang])}
                cursor={t.cursor.scroll}
              />
              <figcaption className="muted" style={{ marginTop: "1rem", fontSize: "0.85rem", textAlign: "center" }}>{x.liveShots}</figcaption>
            </figure>
          ) : (
            <figure className="p-hero-visual" data-tilt="2" data-cursor={t.cursor.click} style={{ margin: 0 }}>
              <ProjectVisual kind={p.visual ?? "qr"} />
              <figcaption>{x.illustration}</figcaption>
            </figure>
          )}
        </div>
      </section>

      <div className="wrap detail" style={{ paddingBottom: "2rem" }}>
        <aside>
          <Toc sections={sections} title={x.toc} />
        </aside>

        <article>
          <section id="overview" className="d-sec">
            <h2>{x.overview}</h2>
            <p className="lead" style={{ color: "var(--paper)", maxWidth: "62ch" }}>{bidi(p.summary[lang])}</p>
            <div className="ps">
              <div className="panel" data-reveal>
                <span className="ps-tag bad">{x.problemLabel}</span>
                <p>{bidi(p.problem[lang])}</p>
              </div>
              <div className="panel" data-reveal style={{ "--delay": "100ms" } as CSSProperties}>
                <span className="ps-tag good">{x.solutionLabel}</span>
                <p>{bidi(p.solution[lang])}</p>
              </div>
            </div>
          </section>

          {p.screens?.length ? (
            <section id="screens" className="d-sec">
              <h2>{x.screensTitle}</h2>
              <ScreenGallery
                screens={p.screens}
                lang={lang}
                url={p.liveLabel}
                labels={{ ...x.gallery, cursor: t.cursor.zoom }}
              />
            </section>
          ) : null}

          <section id="numbers" className="d-sec">
            <h2>{x.statsTitle}</h2>
            <div className="d-stats">
              {p.stats.map((s, i) => (
                <div key={s.label.en} className="panel stat" data-tilt="8" data-reveal style={{ "--delay": `${i * 80}ms` } as CSSProperties}>
                  <span className="stat-idx">0{i + 1}</span>
                  <div>
                    {typeof s.value === "number" ? <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} /> : <span className="stat-num">{s.text}</span>}
                    <div className="stat-label" style={{ marginTop: "0.7rem" }}>{bidi(s.label[lang])}</div>
                    {s.note && <div className="stat-note">{bidi(s.note[lang])}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {p.responsibilities?.length ? (
            <section id="role" className="d-sec">
              <h2>{x.respTitle}</h2>
              <ol className="resp">
                {p.responsibilities.map((r) => (
                  <li key={r.en} data-reveal>
                    <span style={{ fontSize: "1.08rem" }}>{bidi(r[lang])}</span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <section id="features" className="d-sec">
            <h2>{x.featuresTitle}</h2>
            <div className="feat-grid">
              {p.features.map((f, i) => (
                <div key={f.title.en} className="panel feat" data-tilt="5" data-reveal style={{ "--delay": `${(i % 2) * 80}ms` } as CSSProperties}>
                  <span className="feat-i">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{bidi(f.title[lang])}</h3>
                    <p className="muted">{bidi(f.text[lang])}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="flow" className="d-sec">
            <h2>{x.flowTitle}</h2>
            <p className="muted" style={{ marginTop: "-1rem", marginBottom: "1.6rem" }}>{x.flowHint}</p>
            <Flow nodes={p.flow.map((n) => ({ id: n.id, title: n.title[lang], text: n.text[lang] }))} />
          </section>

          <section id="stack" className="d-sec">
            <h2>{x.stackTitle}</h2>
            <div className="stack-grid">
              {p.stack.map((g, i) => (
                <div key={g.group.en} className="panel" data-reveal style={{ "--delay": `${i * 70}ms` } as CSSProperties}>
                  <h3>{bidi(g.group[lang])}</h3>
                  <div className="chips">
                    {g.items.map((it) => (
                      <span key={it} className="chip" data-magnetic="0.4">{it}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="challenges" className="d-sec">
            <h2>{x.challengesTitle}</h2>
            <div className="stack">
              {p.challenges.map((c) => (
                <div key={c.title.en} className="panel challenge" data-reveal>
                  <h3>{bidi(c.title[lang])}</h3>
                  <div>
                    <span className="ps-tag bad">{x.problemLabel}</span>
                    <p className="muted">{bidi(c.problem[lang])}</p>
                  </div>
                  <div>
                    <span className="ps-tag good">{x.solutionLabel}</span>
                    <p>{bidi(c.solution[lang])}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {p.timeline?.length ? (
          <section id="timeline" className="d-sec">
            <h2>{x.timelineTitle}</h2>
            <div className="tl">
              {(p.timeline ?? []).map((s) => (
                <div key={s.when} className="tl-item">
                  <b>{s.when}</b>
                  <p>{bidi(s.text[lang])}</p>
                </div>
              ))}
            </div>
          </section>
          ) : null}

          <div className="panel" style={{ textAlign: "center", padding: "clamp(2rem, 5vw, 3.5rem)" }} data-reveal>
            <h2 className="h-lg">{x.ctaTitle}</h2>
            <div className="btn-row" style={{ justifyContent: "center", marginTop: "1.6rem" }}>
              <a className="btn btn-primary" href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noopener noreferrer" data-magnetic="0.3">
                <WhatsApp width={18} height={18} />
                <span>{t.cta.whatsapp}</span>
              </a>
              <Link className="btn" href={localePath(lang, "/contact")} data-magnetic="0.3">
                <span>{t.cta.start}</span>
                <Arrow />
              </Link>
            </div>
          </div>
        </article>
      </div>

      {next.slug !== p.slug && (
        <Link
          href={localePath(lang, `/projects/${next.slug}`)}
          className="next-proj"
          data-cursor={t.cursor.go}
          style={{ "--accent": next.accent } as CSSProperties}
        >
          <div className="wrap">
            <small>{t.cta.next} · {next.index}</small>
            <div className="display">{bidi(next.short[lang])}</div>
          </div>
        </Link>
      )}
    </div>
  );
}
