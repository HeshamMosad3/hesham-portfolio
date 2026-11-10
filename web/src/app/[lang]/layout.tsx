import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Alexandria, Readex_Pro } from "next/font/google";
import "../globals.css";
import { dirOf, hasLocale, locales } from "@/lib/i18n";
import { getDict } from "@/content/ui";
import { SITE } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Interactions from "@/components/Interactions";
import JsonLd from "@/components/JsonLd";

const alexandria = Alexandria({ subsets: ["arabic", "latin"], weight: ["500", "600", "700", "800"], variable: "--font-alexandria", display: "swap" });
const readex = Readex_Pro({ subsets: ["arabic", "latin"], weight: ["300", "400", "500", "600"], variable: "--font-readex", display: "swap" });

export const viewport: Viewport = {
  themeColor: "#0a0a09",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: "Hesham Mosad",
  authors: [{ name: "Hesham Mosad", url: SITE.url }],
  creator: "Hesham Mosad",
  formatDetection: { telephone: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  // Google Search Console ownership verification.
  verification: { google: "owAXDO5is_fv4eOhgTx9d5NOXjy6RpvjLT_SENe0-f4" },
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDict(lang);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE.url}/#person`,
        name: "Hesham Mosad Sayed",
        alternateName: ["هشام مسعد سيد", "Hesham Mosad"],
        jobTitle: "Full Stack Web & Mobile Developer",
        description: t.meta.home.desc,
        url: SITE.url,
        image: `${SITE.url}${SITE.photo}`,
        email: `mailto:${SITE.email}`,
        address: { "@type": "PostalAddress", addressLocality: "Assiut", addressCountry: "EG" },
        alumniOf: { "@type": "CollegeOrUniversity", name: "Egyptian E-Learning University" },
        knowsLanguage: ["ar", "en"],
        knowsAbout: ["C#", "ASP.NET Core", "PHP", "Laravel", "Tailwind CSS", "jQuery", "Mobile app development", "SQL Server", "Entity Framework Core", "SignalR", "REST APIs", "Clean Architecture", "JavaScript"],
        sameAs: [SITE.github, SITE.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name[lang],
        inLanguage: ["ar", "en"],
        publisher: { "@id": `${SITE.url}/#person` },
      },
    ],
  };

  const headerLabels = {
    brand: t.brand,
    tagline: t.footer.tagline,
    nav: t.nav,
    whatsapp: t.cta.whatsapp,
    switchTo: t.lang.switchTo,
    switchLabel: t.lang.label,
    chat: t.cursor.chat,
  };

  return (
    <html lang={lang} dir={dirOf(lang)} className={`${alexandria.variable} ${readex.variable}`} suppressHydrationWarning>
      <body>
        {/* Mark JS as available before paint so reveal animations never hide content for no-JS users. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <JsonLd data={graph} />
        <a className="skip" href="#main">{t.skip}</a>
        <Interactions />
        <Header lang={lang} l={headerLabels} />
        <main id="main">{children}</main>
        <Footer lang={lang} t={t} />
      </body>
    </html>
  );
}
