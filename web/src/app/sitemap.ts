import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { localePath, locales } from "@/lib/i18n";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    { p: "/", priority: 1 },
    { p: "/projects", priority: 0.9 },
    { p: "/about", priority: 0.7 },
    { p: "/skills", priority: 0.6 },
    { p: "/services", priority: 0.7 },
    { p: "/contact", priority: 0.8 },
    ...projects.map((x) => ({ p: `/projects/${x.slug}`, priority: 0.9 })),
  ];
  const abs = (l: (typeof locales)[number], p: string) => `${SITE.url}${localePath(l, p) === "/" ? "" : localePath(l, p)}`;

  return paths.flatMap(({ p, priority }) =>
    locales.map((l) => ({
      url: abs(l, p) || SITE.url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: { ar: abs("ar", p), en: abs("en", p) } },
    })),
  );
}
