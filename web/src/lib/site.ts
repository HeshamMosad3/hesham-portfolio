// Single source of truth for site-wide facts.
// TODO(owner): confirm the final domain, phone and e-mail before launch.
export const SITE = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://heshammosad.dev",
  name: { ar: "هشام مسعد", en: "Hesham Mosad" },
  email: "heshammosad885@gmail.com",
  phone: "+201010235681",
  whatsapp: "201010235681",
  github: "https://github.com/HeshamMosad3",
  linkedin: "https://linkedin.com/in/hesham-mosad",
  resume: "/Hesham_Mosad_Resume.pdf",
  photo: "/hesham.jpeg",
} as const;
