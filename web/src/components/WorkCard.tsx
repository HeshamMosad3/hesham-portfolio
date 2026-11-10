import Link from "next/link";
import type { CSSProperties } from "react";
import { localePath, type Locale } from "@/lib/i18n";
import type { Dict } from "@/content/ui";
import type { Project, Upcoming } from "@/content/projects";
import ProjectVisual from "./ProjectVisual";
import { ComingSoonPhone, DeviceStage, PhoneTrio } from "./Devices";
import { Arrow } from "./Icons";
import { bidi } from "./Bidi";

export default function WorkCard({ p, lang, t, delay = 0 }: { p: Project; lang: Locale; t: Dict; delay?: number }) {
  const href = localePath(lang, `/projects/${p.slug}`);
  const hero = p.screens?.[0];
  const phones = (p.screens ?? []).map((s) => s.mobile).filter((m): m is NonNullable<typeof m> => !!m);
  return (
    <article className="panel work-card" data-reveal style={{ "--accent": p.accent, "--delay": `${delay}ms` } as CSSProperties}>
      {hero?.desktop && hero.mobile ? (
        <Link href={href} className="work-visual has-stage" tabIndex={-1} aria-hidden="true">
          <DeviceStage desktop={hero.desktop} mobile={hero.mobile} url={p.liveLabel} alt={p.title[lang]} floats={p.floats?.map((f) => f[lang])} cursor={t.cursor.scroll} />
        </Link>
      ) : phones.length ? (
        <Link href={href} className="work-visual has-stage" tabIndex={-1} aria-hidden="true">
          <PhoneTrio phones={phones.slice(0, 3)} alt={p.title[lang]} floats={p.floats?.map((f) => f[lang])} cursor={t.cursor.view} />
        </Link>
      ) : (
        <div className="work-visual" data-cursor={t.cursor.click} role="img" aria-label={`${t.projects.illustration}: ${p.title[lang]}`}>
          <ProjectVisual kind={p.visual ?? "qr"} />
        </div>
      )}
      <Link href={href} className="work-body" data-cursor={t.cursor.view}>
        <div className="work-top">
          <span>{p.index} / {p.year}</span>
          <span>{bidi(p.context[lang])}</span>
        </div>
        <h3 className="work-title">{bidi(p.title[lang])}</h3>
        <p className="muted">{bidi(p.tagline[lang])}</p>
        <div className="chips">
          {p.stack.flatMap((g) => g.items).slice(0, 6).map((s) => (
            <span key={s} className="chip">{s}</span>
          ))}
        </div>
        <div className="work-nums">
          {p.stats.slice(0, 3).map((s) => (
            <div key={s.label.en}>
              <b>{s.text ?? `${s.prefix ?? ""}${s.value}${s.suffix ?? ""}`}</b>
              <span>{bidi(s.label[lang])}</span>
            </div>
          ))}
        </div>
        <span className="work-go">
          <span className="circle"><Arrow /></span>
          {t.cta.view}
        </span>
      </Link>
    </article>
  );
}

export function UpcomingCard({ u, lang, t, delay = 0 }: { u: Upcoming; lang: Locale; t: Dict; delay?: number }) {
  return (
    <article className="panel work-card is-soon" data-reveal data-cursor={t.cursor.soon} style={{ "--accent": u.accent, "--delay": `${delay}ms` } as CSSProperties}>
      <div className="work-visual has-stage">
        <ComingSoonPhone label={u.status[lang]} />
      </div>
      <div className="work-body">
        <div className="work-top">
          <span>{u.index} / —</span>
          <span>{bidi(u.client[lang])}</span>
        </div>
        <span className="soon-badge" style={{ alignSelf: "flex-start" }}>{t.projects.soonTitle}</span>
        <h3 className="work-title">{bidi(u.title[lang])}</h3>
        <p className="muted">{bidi(u.tagline[lang])}</p>
        <div className="work-nums">
          <div>
            <b style={{ fontSize: "1.1rem" }}>{bidi(u.role[lang])}</b>
            <span>{t.projects.meta.role}</span>
          </div>
          <div>
            <b style={{ fontSize: "1.1rem" }}>{bidi(u.client[lang])}</b>
            <span>{t.projects.meta.client}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
