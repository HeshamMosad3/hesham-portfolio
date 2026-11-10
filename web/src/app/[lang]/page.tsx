import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { hasLocale, localePath } from "@/lib/i18n";
import { getDict } from "@/content/ui";
import { ordered } from "@/content/projects";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";
import HeroScene from "@/components/HeroScene";
import WorkCard, { UpcomingCard } from "@/components/WorkCard";
import { CountUp, LocalTime, ScrollWords } from "@/components/Live";
import { Arrow, ArrowUpRight, Download, WhatsApp } from "@/components/Icons";
import { bidi } from "@/components/Bidi";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = getDict(lang).meta.home;
  return buildMetadata({ lang, path: "/", title: m.title, description: m.desc });
}

const TECH = ["ASP.NET Core", "Laravel", "C#", "PHP", "SQL Server", "Tailwind CSS", "jQuery", "Figma", "REST APIs", "SignalR", "Mobile", "Git"];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);
  const h = t.home;
  const wa = `https://wa.me/${SITE.whatsapp}`;

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="hero">
        <HeroScene />
        <div className="hero-fade" />
        <div className="wrap hero-inner">
          <span className="status"><span className="pulse" /> {h.status}</span>

          <h1 className="display headline">
            {h.headline.map((line, i) => (
              <span key={i} className={`line ${line.hl ? "hl" : ""}`}>
                <span>
                  {line.t.split(" ").map((w, j) => (
                    <span key={j}>
                      <span className="w">{w}</span>{" "}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>

          <div className="hero-bottom">
            <p className="lead">{bidi(h.intro)}</p>
            <div className="btn-row">
              <a className="btn btn-primary btn-lg" href={wa} target="_blank" rel="noopener noreferrer" data-magnetic="0.3">
                <WhatsApp width={20} height={20} />
                <span>{t.cta.whatsapp}</span>
              </a>
              <Link className="btn btn-lg" href={localePath(lang, "/projects")} data-magnetic="0.3">
                <span>{t.cta.work}</span>
                <Arrow />
              </Link>
            </div>
          </div>

          <div className="hero-meta">
            <span>{bidi(t.footer.tagline)}</span>
            <span><b>{h.location}</b></span>
            <span>{h.localTime} <b><LocalTime locale={lang} /></b></span>
          </div>
        </div>
        <div className="scroll-cue" aria-hidden="true"><i /> {h.scroll}</div>
      </section>

      {/* ───────── Tech marquee ───────── */}
      <div className="marquee" aria-label="Tech stack">
        <div className="marquee-track">
          {[...TECH, ...TECH].map((s, i) => (
            <span key={i} className="marquee-item" aria-hidden={i >= TECH.length}>{s}</span>
          ))}
        </div>
      </div>

      {/* ───────── Statement ───────── */}
      <section className="section">
        <div className="wrap">
          <span className="eyebrow" style={{ marginBottom: "2rem" }}>{t.nav.about}</span>
          <ScrollWords text={h.statement} />
          <div className="btn-row" style={{ marginTop: "2.5rem" }}>
            <Link className="btn" href={localePath(lang, "/about")} data-magnetic="0.25">
              <span>{t.about.eyebrow}</span>
              <Arrow />
            </Link>
            <a className="btn" href={SITE.resume} download data-magnetic="0.25">
              <Download />
              <span>{t.cta.resume}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ───────── Numbers ───────── */}
      <section className="section-tight">
        <div className="wrap">
          <div className="section-head">
            <div className="stack-sm">
              <span className="eyebrow">{h.statsEyebrow}</span>
              <h2 className="h-xl">{h.statsTitle}</h2>
            </div>
          </div>
          <div className="bento">
            {h.stats.map((s, i) => (
              <div key={s.label} className="panel stat" data-tilt="6" data-reveal style={{ "--delay": `${i * 80}ms` } as CSSProperties}>
                <span className="stat-idx">0{i + 1}</span>
                <div>
                  {"value" in s && typeof s.value === "number" ? (
                    <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                  ) : (
                    <span className="stat-num">{s.text}</span>
                  )}
                  <div className="stat-label" style={{ marginTop: "0.8rem" }}>{bidi(s.label)}</div>
                  <div className="stat-note">{bidi(s.note)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Selected work ───────── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="stack-sm">
              <span className="eyebrow">{h.workEyebrow}</span>
              <h2 className="h-xl">{h.workTitle}</h2>
            </div>
            <Link className="btn" href={localePath(lang, "/projects")} data-magnetic="0.3">
              <span>{t.cta.all}</span>
              <Arrow />
            </Link>
          </div>
          <div className="work-grid">
            {ordered.map((e, i) =>
              e.kind === "project" ? (
                <WorkCard key={e.p.slug} p={e.p} lang={lang} t={t} delay={i * 100} />
              ) : (
                <UpcomingCard key={e.u.slug} u={e.u} lang={lang} t={t} delay={i * 100} />
              ),
            )}
          </div>
        </div>
      </section>

      {/* ───────── Services ───────── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div className="stack-sm">
              <span className="eyebrow">{h.servicesEyebrow}</span>
              <h2 className="h-xl">{h.servicesTitle}</h2>
            </div>
          </div>
          <div>
            {t.services.items.map((s, i) => (
              <Link
                key={s.t}
                href={localePath(lang, "/services")}
                className="srow"
                data-reveal
                data-cursor={t.cursor.open}
                style={{ "--delay": `${i * 60}ms` } as CSSProperties}
              >
                <span className="srow-idx">0{i + 1}</span>
                <h3>{bidi(s.t)}</h3>
                <p className="muted">{bidi(s.d)}</p>
                <span className="srow-arrow"><ArrowUpRight /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Process ───────── */}
      <section className="section-tight">
        <div className="wrap">
          <div className="section-head">
            <div className="stack-sm">
              <span className="eyebrow">{h.processEyebrow}</span>
              <h2 className="h-xl">{h.processTitle}</h2>
            </div>
          </div>
          <div className="steps">
            {h.process.map((s, i) => (
              <div key={s.t} className="panel step" data-tilt="8" data-reveal style={{ "--delay": `${i * 90}ms` } as CSSProperties}>
                <span className="step-n">0{i + 1}</span>
                <div>
                  <h3>{bidi(s.t)}</h3>
                  <p className="muted">{bidi(s.d)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="section">
        <div className="wrap">
          <div className="panel cta-big" data-reveal>
            <span className="eyebrow">{h.ctaEyebrow}</span>
            <h2 className="display" style={{ marginTop: "1.4rem" }}>
              {h.ctaTitle[0]}
              <br />
              <span className="hl">{h.ctaTitle[1]}</span>
            </h2>
            <p className="lead" style={{ marginInline: "auto", marginTop: "1.4rem" }}>{h.ctaText}</p>
            <a className="cta-orb" href={wa} target="_blank" rel="noopener noreferrer" data-magnetic="0.45" data-cursor={t.cursor.chat}>
              <span>
                <WhatsApp />
                {t.cta.start}
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
