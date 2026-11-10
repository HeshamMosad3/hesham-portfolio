export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ar";

export const hasLocale = (v: string): v is Locale =>
  (locales as readonly string[]).includes(v);

export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

/** Public URL path for a locale: Arabic has no prefix, English uses /en. */
export function localePath(l: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path;
  return l === "ar" ? clean || "/" : `/en${clean}`;
}
