import type { Metadata } from "next";
import { SITE } from "./site";
import { localePath, type Locale } from "./i18n";

const abs = (path: string) => `${SITE.url}${path === "/" ? "" : path}`;

/** Build metadata (title, description, canonical, hreflang, OG, Twitter) for a logical path. */
export function buildMetadata(opts: { lang: Locale; path: string; title: string; description: string; type?: "website" | "article"; image?: string }): Metadata {
  const { lang, path, title, description, type = "website" } = opts;
  const url = abs(localePath(lang, path));
  const image = opts.image ?? "/opengraph-image";
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ar: abs(localePath("ar", path)),
        en: abs(localePath("en", path)),
        "x-default": abs(localePath("ar", path)),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name[lang],
      locale: lang === "ar" ? "ar_EG" : "en_US",
      alternateLocale: lang === "ar" ? ["en_US"] : ["ar_EG"],
      type,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export const absoluteUrl = abs;
