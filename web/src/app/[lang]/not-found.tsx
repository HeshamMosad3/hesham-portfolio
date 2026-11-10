import Link from "next/link";
import { getDict } from "@/content/ui";
import { defaultLocale } from "@/lib/i18n";

export default function NotFound() {
  const t = getDict(defaultLocale).notFound;
  return (
    <section className="page-hero" style={{ minHeight: "80svh" }}>
      <div className="wrap stack" style={{ textAlign: "center", justifyItems: "center" }}>
        <div className="display mono hl" style={{ fontSize: "clamp(5rem, 20vw, 14rem)", lineHeight: 1 }}>404</div>
        <h1 className="h-lg">{t.title}</h1>
        <p className="lead" style={{ marginInline: "auto" }}>{t.text}</p>
        <div>
          <Link className="btn btn-primary btn-lg" href="/" data-magnetic="0.3">{t.cta}</Link>
        </div>
      </div>
    </section>
  );
}
