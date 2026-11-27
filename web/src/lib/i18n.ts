export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (v: string): v is Locale =>
  (locales as readonly string[]).includes(v);

export const dirOf = (l: Locale) => (l === "ar" ? "rtl" : "ltr");

/** Public URL path for a locale: English has no prefix, Arabic uses /ar. */
export function localePath(l: Locale, path = "/"): string {
  const clean = path === "/" ? "" : path;
  return l === "en" ? clean || "/" : `/ar${clean}`;
}
