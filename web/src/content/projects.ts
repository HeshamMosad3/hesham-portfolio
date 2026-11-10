import type { Locale } from "@/lib/i18n";

export type L10n = Record<Locale, string>;
export type Img = { src: string; w: number; h: number };
export type Screen = { id: string; label: L10n; desktop?: Img; mobile?: Img };

export type Project = {
  slug: string;
  index: string;
  year: string;
  accent: string;
  /** Canvas illustration, used when there are no screenshots. */
  visual?: "qr" | "graph";
  /** Real screenshots captured from the live deployment. */
  screens?: Screen[];
  live?: string;
  liveLabel?: string;
  github?: string;
  client: L10n;
  duration?: L10n;
  role: L10n;
  context: L10n;
  title: L10n;
  short: L10n;
  tagline: L10n;
  summary: L10n;
  problem: L10n;
  solution: L10n;
  /** Verified numbers only. Numeric `value` animates; `text` is shown as-is. */
  stats: { value?: number; text?: string; prefix?: string; suffix?: string; label: L10n; note?: L10n }[];
  /** Short numbers that float around the device mock-ups. */
  floats?: L10n[];
  responsibilities?: L10n[];
  features: { title: L10n; text: L10n }[];
  stack: { group: L10n; items: string[] }[];
  flow: { id: string; title: L10n; text: L10n }[];
  challenges: { title: L10n; problem: L10n; solution: L10n }[];
  timeline?: { when: string; text: L10n }[];
};

/** Projects that are confidential / not launched yet: shown as a teaser card only. */
export type Upcoming = {
  slug: string;
  index: string;
  accent: string;
  title: L10n;
  short: L10n;
  client: L10n;
  role: L10n;
  tagline: L10n;
  status: L10n;
  stack: string[];
};

const shot = (dir: string, name: string, dH: number, mH: number, ar: string, en: string): Screen => ({
  id: name,
  label: { ar, en },
  desktop: { src: `/projects/${dir}/${name}-desktop.jpg`, w: 1440, h: dH },
  mobile: { src: `/projects/${dir}/${name}-mobile.jpg`, w: 780, h: mH },
});

export const projects: Project[] = [
  /* ───────────────────────────── 01 · Dar Al-Ruya ───────────────────────────── */
  {
    slug: "dar-alruya",
    index: "01",
    year: "2026",
    accent: "#ffb547",
    live: "https://examinations-department-h-production.up.railway.app/",
    liveLabel: "examinations-department · railway.app",
    client: { ar: "دار الرؤى للتدريب · المملكة العربية السعودية", en: "Dar Al-Ruya Training · Saudi Arabia" },
    role: { ar: "مطوّر Full Stack · من Figma إلى الخادم", en: "Full Stack Developer · Figma to backend" },
    context: { ar: "عميل سعودي · الموقع الجديد لـ alruaa.com", en: "Saudi client · the new alruaa.com" },
    title: { ar: "دار الرؤى: منصة تدريب ومقاييس شخصية", en: "Dar Al-Ruya: Training & Assessment Platform" },
    short: { ar: "دار الرؤى للتدريب", en: "Dar Al-Ruya Training" },
    tagline: {
      ar: "الموقع الجديد لمركز تدريب سعودي: مقاييس تفاعلية لاكتشاف الذات، وكتالوج دورات معتمدة، وتجربة عربية كاملة على كل الأجهزة.",
      en: "The new website of a Saudi training centre: interactive self-discovery assessments, an accredited course catalogue, and a fully Arabic experience on every device.",
    },
    summary: {
      ar: "بنيت الموقع الجديد لدار الرؤى للتدريب من الصفر، من تصميم Figma حتى الخادم. يجمع الموقع ثلاثة مقاييس تفاعلية لاكتشاف الذات، وتحدياً سريعاً على الصفحة الرئيسية، وكتالوجاً لسبع دورات معتمدة لكل منها صفحة تفصيلية، مع تسجيل سريع للوصول إلى التقارير ولوحة تحكم للمشرفين.",
      en: "I built Dar Al-Ruya's new website from scratch, from the Figma design to the server. It brings together three interactive self-discovery assessments, a quick challenge on the home page, and a catalogue of seven accredited courses with a detailed page each, plus quick sign-up to unlock reports and a supervisors' dashboard.",
    },
    problem: {
      ar: "يحتاج المركز إلى موقع حديث يعرض دوراته ومقاييسه بشكل جذاب، ويحوّل الزائر إلى متدرب مسجّل، دون أن يفقده في خطوات تسجيل طويلة.",
      en: "The centre needed a modern site that presents its courses and assessments attractively and turns visitors into registered trainees, without losing them in long sign-up steps.",
    },
    solution: {
      ar: "واجهة عربية متجاوبة مبنية بدقة على تصميم Figma، ومقاييس تفاعلية مجانية تجذب الزائر، ونماذج تسجيل ودخول سريعة داخل الصفحة نفسها، وصفحة لكل دورة مع نموذج لطلب عرض سعر للجهات.",
      en: "A responsive Arabic interface built faithfully from the Figma design, free interactive assessments that draw visitors in, inline quick sign-up and login forms, and a page per course with a quote-request form for organisations.",
    },
    stats: [
      { value: 3, label: { ar: "مقاييس تفاعلية", en: "Interactive assessments" }, note: { ar: "عجلة الحياة · أنماط الإدراك · مفاتيح الشخصية", en: "Life Wheel · Perceptual Patterns · Personality Keys" } },
      { value: 7, label: { ar: "دورات معتمدة بصفحات مستقلة", en: "Accredited course pages" }, note: { ar: "PMP · CBP · TOT · 6 Sigma · KPIs وغيرها", en: "PMP · CBP · TOT · Six Sigma · KPIs and more" } },
      { value: 8, label: { ar: "جوانب في عجلة الحياة", en: "Life Wheel dimensions" }, note: { ar: "من الصحي والمالي إلى المهني والعائلي", en: "From health and finance to career and family" } },
      { value: 14, suffix: "+", label: { ar: "صفحة عامة", en: "Public pages" }, note: { ar: "كلها عربية RTL ومتجاوبة", en: "All Arabic RTL and responsive" } },
    ],
    floats: [
      { ar: "3 مقاييس تفاعلية", en: "3 assessments" },
      { ar: "7 دورات معتمدة", en: "7 courses" },
      { ar: "100% عربي RTL", en: "100% Arabic RTL" },
    ],
    responsibilities: [
      { ar: "تحويل تصميم Figma إلى واجهات متجاوبة بدقة على الهاتف والحاسوب.", en: "Turned the Figma design into pixel-accurate responsive screens for phone and desktop." },
      { ar: "بناء الخلفية بـ Laravel: الحسابات، والمقاييس، والدورات، والنماذج.", en: "Built the Laravel backend: accounts, assessments, courses and forms." },
      { ar: "برمجة التفاعلات بـ jQuery: التحدي السريع، والقوائم المنسدلة، والنماذج.", en: "Wrote the jQuery interactions: the quick challenge, accordions and forms." },
      { ar: "تنسيق الواجهات بـ Tailwind وBootstrap مع دعم كامل للعربية.", en: "Styled the interface with Tailwind and Bootstrap, with full Arabic support." },
      { ar: "النشر والتشغيل على Railway.", en: "Deployment and hosting on Railway." },
    ],
    features: [
      { title: { ar: "ثلاثة مقاييس لاكتشاف الذات", en: "Three self-discovery assessments" }, text: { ar: "عجلة الحياة بثمانية جوانب، وأنماط الإدراك (سمعي، بصري، حسي)، ومفاتيح الشخصية السبعة، ولكل مقياس صفحة تعريفية خاصة.", en: "The Life Wheel across eight dimensions, Perceptual Patterns (auditory, visual, kinaesthetic) and the Seven Personality Keys, each with its own explainer page." } },
      { title: { ar: "تحدٍّ سريع تفاعلي", en: "Interactive quick challenge" }, text: { ar: "لغز أنماط من أربعة أسئلة على الصفحة الرئيسية، مع احتفال مرئي عند الإجابة الصحيحة.", en: "A four-question pattern puzzle on the home page, with a celebration effect on a correct answer." } },
      { title: { ar: "كتالوج دورات متكامل", en: "Complete course catalogue" }, text: { ar: "سبع دورات، لكل منها مواعيد، ورقم اعتماد، وخطة تدريبية يومية، وآراء المتدربين، وأسئلة شائعة.", en: "Seven courses, each with dates, an accreditation number, a day-by-day plan, testimonials and FAQs." } },
      { title: { ar: "طلب عرض سعر للجهات", en: "Quote requests for organisations" }, text: { ar: "نموذج مخصص للشركات لطلب الدورة حصرياً لموظفيها.", en: "A dedicated form for companies to request a course exclusively for their staff." } },
      { title: { ar: "تسجيل سريع داخل الصفحة", en: "Inline quick sign-up" }, text: { ar: "إنشاء حساب أو تسجيل دخول دون مغادرة الصفحة للوصول إلى تقرير المقياس.", en: "Create an account or log in without leaving the page to unlock the assessment report." } },
      { title: { ar: "لوحة تحكم للمشرفين", en: "Supervisors' dashboard" }, text: { ar: "لوحة خاصة بالمشرفين لمتابعة نتائج عجلة الحياة.", en: "A dedicated dashboard for supervisors to follow Life Wheel results." } },
    ],
    stack: [
      { group: { ar: "الخلفية", en: "Backend" }, items: ["PHP", "Laravel"] },
      { group: { ar: "الواجهة", en: "Frontend" }, items: ["jQuery", "Tailwind CSS", "Bootstrap", "HTML5", "CSS3"] },
      { group: { ar: "التصميم", en: "Design" }, items: ["Figma"] },
      { group: { ar: "النشر", en: "Deployment" }, items: ["Railway"] },
    ],
    flow: [
      { id: "visit", title: { ar: "الزائر", en: "Visitor" }, text: { ar: "يصل إلى الصفحة الرئيسية ويرى المقاييس والدورات.", en: "Lands on the home page and sees assessments and courses." } },
      { id: "pick", title: { ar: "اختيار المقياس", en: "Pick an assessment" }, text: { ar: "يقرأ الصفحة التعريفية ويبدأ التقييم مجاناً.", en: "Reads the explainer page and starts for free." } },
      { id: "signup", title: { ar: "تسجيل سريع", en: "Quick sign-up" }, text: { ar: "حساب جديد أو دخول من نفس الصفحة.", en: "New account or login on the same page." } },
      { id: "laravel", title: { ar: "خادم Laravel", en: "Laravel backend" }, text: { ar: "يحفظ الإجابات ويحسب النتيجة.", en: "Stores answers and calculates the result." } },
      { id: "report", title: { ar: "التقرير ولوحة المشرف", en: "Report and dashboard" }, text: { ar: "يرى المتدرب تقريره، ويتابع المشرف النتائج.", en: "The trainee sees their report; supervisors follow results." } },
    ],
    challenges: [
      {
        title: { ar: "تصميم غني على شاشة صغيرة", en: "A rich design on a small screen" },
        problem: { ar: "رسوم مخصصة مثل عجلة الحياة ومخطط المفاتيح السبعة يجب أن تبقى واضحة على الهاتف وباتجاه عربي.", en: "Custom visuals like the Life Wheel and the Seven Keys diagram had to stay clear on phones, right-to-left." },
        solution: { ar: "بناء كل عنصر بشكل متجاوب من البداية، واختباره على مقاسات الهاتف والحاسوب.", en: "Built every element responsive from the start and tested it at phone and desktop sizes." },
      },
      {
        title: { ar: "التسجيل دون خسارة الزائر", en: "Sign-up without losing the visitor" },
        problem: { ar: "طلب إنشاء حساب قبل رؤية التقرير قد يجعل الزائر يغادر.", en: "Asking for an account before showing the report can make visitors leave." },
        solution: { ar: "نماذج تسجيل ودخول سريعة داخل الصفحة نفسها، مع إبقاء المقاييس مجانية.", en: "Quick sign-up and login forms inline on the same page, while keeping the assessments free." },
      },
    ],
    screens: [
      shot("alruaa", "home", 7000, 9660, "الصفحة الرئيسية", "Home"),
      shot("alruaa", "courses", 2974, 11112, "كتالوج الدورات", "Course catalogue"),
      shot("alruaa", "course", 3816, 9404, "صفحة دورة PMP", "PMP course page"),
      shot("alruaa", "life-wheel", 3678, 7008, "عجلة الحياة", "Life Wheel"),
      shot("alruaa", "personality", 3654, 7412, "مفاتيح الشخصية السبعة", "Seven Personality Keys"),
      shot("alruaa", "perceptual", 3456, 7936, "أنماط الإدراك", "Perceptual Patterns"),
      shot("alruaa", "login", 900, 1688, "تسجيل الدخول", "Login"),
    ],
  },

  /* ───────────────────────────── 02 · Car Mediator app ───────────────────────────── */
  {
    slug: "car-mediator",
    index: "02",
    year: "2026",
    accent: "#3ce0c0",
    client: { ar: "شركة ناشئة سعودية", en: "Saudi startup" },
    role: { ar: "مطوّر Full Stack للجوال · Flutter وLaravel", en: "Full Stack Mobile Developer · Flutter & Laravel" },
    context: { ar: "عميل سعودي · قبل الإطلاق", en: "Saudi client · Pre-launch" },
    title: { ar: "وسيط سيارات: تطبيق لقطع الغيار وخدمات السيارات", en: "Car Mediator: Car Parts & Services App" },
    short: { ar: "تطبيق وسيط سيارات", en: "Car Mediator App" },
    tagline: {
      ar: "تطبيق يربط صاحب السيارة بتجار قطع الغيار: يطلب القطعة، يستقبل العروض، يتفاوض بالمحادثة، ويتابع الشحن حتى الاستلام.",
      en: "An app connecting car owners with parts dealers: request a part, receive offers, negotiate in chat and track shipping until delivery.",
    },
    summary: {
      ar: "تطبيق جوال لشركة ناشئة سعودية في سوق قطع غيار وخدمات السيارات، بنيته كاملاً: تطبيق Flutter بواجهتين (للعميل وللتاجر)، وخادم Laravel يدير الطلبات والعروض والمحادثات اللحظية والشحن عبر SMSA والإشعارات. يرسل العميل طلبه في أحد ستة أقسام، فيصل إلى التجار المختصين في مدينته، ثم يتواصل معهم ويتابع الشحنة خطوة بخطوة.",
      en: "A mobile app for a Saudi startup in the car parts and services market, built end to end: a Flutter app with two experiences (customer and dealer) and a Laravel backend that handles requests, offers, real-time chat, SMSA shipping and notifications. Customers post a request in one of six categories, it reaches the right dealers in their city, and they chat and track the shipment step by step.",
    },
    problem: {
      ar: "البحث عن قطعة غيار يعني اتصالات كثيرة بالتجار، وأسعاراً غير واضحة، وشحناً لا يمكن متابعته.",
      en: "Finding a car part means many calls to dealers, unclear prices and shipping that cannot be tracked.",
    },
    solution: {
      ar: "طلب واحد يصل إلى كل التجار المناسبين، وعروض ومحادثة داخل التطبيق، وتقييم للتاجر، وشحن مدمج مع SMSA ببوليصة ورقم تتبع، ومتابعة لكل مرحلة.",
      en: "One request reaches every relevant dealer, with in-app offers and chat, dealer ratings, and SMSA-integrated shipping with a waybill, tracking number and every stage visible.",
    },
    stats: [
      { value: 6, label: { ar: "أقسام للخدمات", en: "Service categories" }, note: { ar: "سيارات مستعملة، قطع تشليح وجديدة، سطحة، معدات، إكسسوارات", en: "Used cars, scrap and new parts, towing, equipment, accessories" } },
      { value: 7, label: { ar: "مراحل لتتبع الشحن", en: "Shipping tracking stages" }, note: { ar: "من موافقة العميل حتى استلام الشحنة", en: "From customer approval to delivery" } },
      { value: 2, label: { ar: "واجهتان في تطبيق واحد", en: "Experiences in one app" }, note: { ar: "العميل والتاجر", en: "Customer and dealer" } },
      { value: 187, label: { ar: "ملف Dart", en: "Dart files" }, note: { ar: "حوالي 17 ألف سطر في تطبيق Flutter", en: "About 17K lines in the Flutter app" } },
    ],
    floats: [
      { ar: "Flutter + Laravel", en: "Flutter + Laravel" },
      { ar: "شحن عبر SMSA", en: "SMSA shipping" },
      { ar: "محادثة لحظية", en: "Real-time chat" },
    ],
    responsibilities: [
      { ar: "بناء تطبيق Flutter بواجهتين منفصلتين للعميل والتاجر، بدعم كامل للعربية.", en: "Built the Flutter app with separate customer and dealer experiences, fully in Arabic." },
      { ar: "تطوير خادم Laravel وواجهات API للطلبات والعروض والمحادثات والشحن.", en: "Developed the Laravel backend and APIs for requests, offers, chat and shipping." },
      { ar: "محادثة لحظية عبر WebSocket (Laravel Reverb)، وإشعارات فورية عبر Firebase.", en: "Real-time chat over WebSocket (Laravel Reverb) and push notifications via Firebase." },
      { ar: "تكامل الشحن مع SMSA: إنشاء البوليصة، ورقم التتبع، ومراحل الشحن.", en: "SMSA shipping integration: waybills, tracking numbers and shipping stages." },
      { ar: "نماذج طلب ديناميكية حسب القسم، وتخزين محلي للبيانات الثابتة لتسريع التطبيق.", en: "Dynamic request forms per category, and local caching of static data for speed." },
    ],
    features: [
      { title: { ar: "طلب يصل لكل التجار المناسبين", en: "One request, every relevant dealer" }, text: { ar: "يختار العميل القسم ويملأ نموذجاً مخصصاً له، فيصل الطلب إلى التجار المختصين في مدينته.", en: "The customer picks a category and fills a form tailored to it; the request reaches specialised dealers in their city." } },
      { title: { ar: "محادثة وعروض داخل التطبيق", en: "In-app chat and offers" }, text: { ar: "محادثة لحظية مع التاجر، مع إرسال الصور والموقع، وزر مباشر لواتساب.", en: "Real-time chat with the dealer, with photos and location, plus a direct WhatsApp button." } },
      { title: { ar: "شحن مدمج مع SMSA", en: "Built-in SMSA shipping" }, text: { ar: "طلب شحن من المحادثة، ودفع رسوم الشحن، وبوليصة يمكن تحميلها ومشاركتها، ورقم تتبع.", en: "Request shipping from the chat, pay the fees, and download or share the waybill with a tracking number." } },
      { title: { ar: "تتبع الشحنة بسبع مراحل", en: "Seven-stage shipment tracking" }, text: { ar: "من موافقة العميل ومراجعة الإدارة حتى تأكيد الشحن واستلام الشحنة.", en: "From customer approval and admin review to shipping confirmation and delivery." } },
      { title: { ar: "لوحة خاصة بالتاجر", en: "Dealer dashboard" }, text: { ar: "طلبات العملاء الجديدة، والردود والمحادثات، والتخصصات والمدن، وسداد عمولة التطبيق.", en: "New customer requests, replies and chats, specialties and cities, and paying the app commission." } },
      { title: { ar: "تقييم وإشعارات", en: "Ratings and notifications" }, text: { ar: "تقييم التاجر بعد التعامل، وإشعارات فورية لكل جديد.", en: "Rate the dealer after a deal, with instant notifications for every update." } },
    ],
    stack: [
      { group: { ar: "الجوال", en: "Mobile" }, items: ["Flutter", "Dart", "Provider", "Hive"] },
      { group: { ar: "الخلفية", en: "Backend" }, items: ["PHP", "Laravel", "REST APIs", "Laravel Reverb"] },
      { group: { ar: "التكاملات", en: "Integrations" }, items: ["Firebase Messaging", "WebSocket", "SMSA"] },
      { group: { ar: "البيانات", en: "Data" }, items: ["MySQL", "Local caching"] },
    ],
    flow: [
      { id: "req", title: { ar: "طلب العميل", en: "Customer request" }, text: { ar: "يختار القسم ويملأ النموذج.", en: "Picks a category and fills the form." } },
      { id: "match", title: { ar: "توزيع على التجار", en: "Dealer matching" }, text: { ar: "يصل الطلب للتجار حسب التخصص والمدينة.", en: "Sent to dealers by specialty and city." } },
      { id: "chat", title: { ar: "عروض ومحادثة", en: "Offers and chat" }, text: { ar: "تفاوض لحظي عبر WebSocket.", en: "Real-time negotiation over WebSocket." } },
      { id: "ship", title: { ar: "الشحن عبر SMSA", en: "SMSA shipping" }, text: { ar: "دفع الرسوم وإنشاء البوليصة.", en: "Fees paid and waybill created." } },
      { id: "deliver", title: { ar: "التتبع والاستلام", en: "Tracking and delivery" }, text: { ar: "سبع مراحل حتى الاستلام والتقييم.", en: "Seven stages to delivery and rating." } },
    ],
    challenges: [
      {
        title: { ar: "تطبيق واحد لجمهورين", en: "One app, two audiences" },
        problem: { ar: "العميل والتاجر يحتاجان شاشات ومهام مختلفة تماماً.", en: "Customers and dealers need completely different screens and tasks." },
        solution: { ar: "فصل الواجهتين حسب الدور، مع مشاركة المحادثة والإشعارات والحساب.", en: "Separate experiences per role, sharing chat, notifications and account." },
      },
      {
        title: { ar: "شحن يمكن الوثوق به", en: "Shipping people can trust" },
        problem: { ar: "الشحن بين مدن المملكة يحتاج دفعاً ومتابعة واضحة لكل خطوة.", en: "Shipping across Saudi cities needs payment and clear tracking at every step." },
        solution: { ar: "تكامل مع SMSA ببوليصة ورقم تتبع، ومراحل واضحة مع موعد نهائي للدفع.", en: "SMSA integration with a waybill and tracking number, clear stages and a payment deadline." },
      },
    ],
    screens: [
      { id: "home-customer", label: { ar: "الرئيسية للعميل", en: "Customer home" }, mobile: { src: "/projects/car-mediator/home-customer.webp", w: 720, h: 1184 } },
      { id: "chat", label: { ar: "المحادثة مع التاجر", en: "Chat with the dealer" }, mobile: { src: "/projects/car-mediator/chat.webp", w: 720, h: 1184 } },
      { id: "shipping", label: { ar: "متابعة الشحن", en: "Shipping tracking" }, mobile: { src: "/projects/car-mediator/shipping.webp", w: 720, h: 1184 } },
      { id: "waybill", label: { ar: "بوليصة SMSA", en: "SMSA waybill" }, mobile: { src: "/projects/car-mediator/waybill.webp", w: 720, h: 1184 } },
      { id: "home-vendor", label: { ar: "لوحة التاجر", en: "Dealer home" }, mobile: { src: "/projects/car-mediator/home-vendor.webp", w: 720, h: 1184 } },
    ],
  },

  /* ───────────────────────────── 03 · Career Path ───────────────────────────── */
  {
    slug: "career-path",
    index: "03",
    year: "2026",
    accent: "#3ce0c0",
    live: "https://career-path-front.vercel.app/",
    liveLabel: "career-path-front.vercel.app",
    github: "https://github.com/HeshamMosad3/CareerBackend",
    client: { ar: "مشروع التخرج · الجامعة المصرية للتعلم الإلكتروني", en: "Graduation project · EELU" },
    duration: { ar: "9 أشهر · أكتوبر 2025 – يونيو 2026", en: "9 months · Oct 2025 – Jun 2026" },
    role: { ar: "قائد الفريق ومطوّر الخلفية بـ .NET", en: "Team lead & .NET backend developer" },
    context: { ar: "مشروع التخرج · تقدير A+", en: "Graduation project · Graded A+" },
    title: { ar: "المسار الوظيفي: منصة توظيف بالذكاء الاصطناعي", en: "Career Path: AI-Powered Career Platform" },
    short: { ar: "المسار الوظيفي", en: "Career Path" },
    tagline: {
      ar: "منصة تبني ملفك المهني، وتحلل مهاراتك، وتطابقك مع الوظائف المناسبة بالذكاء الاصطناعي.",
      en: "A platform that builds your profile, analyses your skills and matches you with the right jobs using AI.",
    },
    summary: {
      ar: "مشروع تخرجي الحاصل على تقدير A+. قدت فريقاً موزعاً على ثلاثة مسارات (الخلفية، والواجهة، والذكاء الاصطناعي)، وبنيت الخلفية بـ ASP.NET Core وفق المعمارية النظيفة. تقدم المنصة تصفح الوظائف، ومتابعة الطلبات، وخرائط تعلّم ذكية، وتحليلاً بالذكاء الاصطناعي، ومجتمعاً للمنشورات.",
      en: "My A+ graduation project. I led a team split across three tracks (backend, frontend and AI) and built the backend with ASP.NET Core using Clean Architecture. The platform offers job browsing, application tracking, AI roadmaps, AI analysis and a community feed.",
    },
    problem: {
      ar: "الباحث عن عمل يتنقل بين مواقع وملفات متفرقة، ولا يعرف ما المهارات التي تنقصه للوظيفة التي يريدها.",
      en: "Job seekers jump between scattered sites and files, without knowing which skills they lack for the job they want.",
    },
    solution: {
      ar: "منصة واحدة تجمع الوظائف، ومتابعة الطلبات، وتحليل المهارات، وخرائط تعلّم شخصية، بواجهات API واضحة يستهلكها فريق الواجهة ووحدة الذكاء الاصطناعي.",
      en: "One platform for jobs, application tracking, skill analysis and personal learning roadmaps, behind clear APIs used by both the frontend team and the AI module.",
    },
    stats: [
      { text: "A+", label: { ar: "تقدير المشروع", en: "Project grade" }, note: { ar: "أعلى تقدير في مشروع التخرج", en: "Top graduation-project grade" } },
      { value: 9, label: { ar: "أشهر من التطوير", en: "Months of development" }, note: { ar: "أكتوبر 2025 – يونيو 2026", en: "Oct 2025 – Jun 2026" } },
      { value: 3, label: { ar: "مسارات فريق قدتها", en: "Team tracks I led" }, note: { ar: "الخلفية، الواجهة، الذكاء الاصطناعي", en: "Backend, frontend, AI" } },
      { value: 5, label: { ar: "وحدات في المنصة", en: "Platform modules" }, note: { ar: "الوظائف، المتابعة، الخرائط، التحليل، المجتمع", en: "Jobs, tracker, roadmaps, analysis, community" } },
    ],
    floats: [
      { ar: "تقدير A+", en: "Graded A+" },
      { ar: "قائد الفريق", en: "Team lead" },
      { ar: "ASP.NET Core", en: "ASP.NET Core" },
    ],
    responsibilities: [
      { ar: "قيادة الفريق وتنسيق العمل بين مسارات الخلفية والواجهة والذكاء الاصطناعي.", en: "Led the team and coordinated the backend, frontend and AI tracks." },
      { ar: "تصميم معمارية الخلفية وفق المعمارية النظيفة بـ ASP.NET Core.", en: "Designed the backend with Clean Architecture on ASP.NET Core." },
      { ar: "بناء واجهات REST API وتصميم قاعدة بيانات SQL Server.", en: "Built the REST APIs and designed the SQL Server database." },
      { ar: "تحديد عقود API وإدارة الفروع والمراجعات على GitHub.", en: "Defined API contracts and managed branches and reviews on GitHub." },
    ],
    features: [
      { title: { ar: "مطابقة الوظائف بالذكاء الاصطناعي", en: "AI job matching" }, text: { ar: "خوارزمية تطابق ملف المستخدم مع الفرص الأنسب.", en: "An algorithm matches each profile with the best-fitting opportunities." } },
      { title: { ar: "متابعة الطلبات", en: "Application tracker" }, text: { ar: "تتبع كل وظيفة تقدمت لها ومرحلتها في مكان واحد.", en: "Track every application and its stage in one place." } },
      { title: { ar: "خرائط تعلّم ذكية", en: "AI roadmaps" }, text: { ar: "خطة تعلم شخصية لسد فجوة المهارات.", en: "A personal learning plan to close skill gaps." } },
      { title: { ar: "تحليل بالذكاء الاصطناعي ومقابلات تجريبية", en: "AI analysis and mock interviews" }, text: { ar: "تحليل للمهارات ومقابلات تفاعلية للتدريب.", en: "Skill analysis and interactive practice interviews." } },
      { title: { ar: "مجتمع ومنشورات", en: "Community posts" }, text: { ar: "مساحة لتبادل الخبرات بين المستخدمين.", en: "A space for users to share experience." } },
      { title: { ar: "خطط مجانية ومميزة", en: "Free and premium plans" }, text: { ar: "حساب مجاني، وخطة مميزة لتحليلات أعمق ومطابقة ذات أولوية.", en: "A free account, and a premium plan for deeper insights and priority matching." } },
    ],
    stack: [
      { group: { ar: "الخلفية", en: "Backend" }, items: ["C#", "ASP.NET Core", "REST APIs", "Clean Architecture"] },
      { group: { ar: "البيانات", en: "Data" }, items: ["SQL Server", "EF Core"] },
      { group: { ar: "التعاون", en: "Collaboration" }, items: ["Git", "GitHub", "Code review"] },
      { group: { ar: "النشر", en: "Deployment" }, items: ["Vercel"] },
    ],
    flow: [
      { id: "ui", title: { ar: "الواجهة", en: "Frontend" }, text: { ar: "ما يراه الباحث عن عمل.", en: "What the job seeker sees." } },
      { id: "api", title: { ar: "طبقة الـ API", en: "API layer" }, text: { ar: "نقاط دخول REST موحّدة.", en: "Unified REST entry points." } },
      { id: "app", title: { ar: "منطق العمل", en: "Application layer" }, text: { ar: "قواعد العمل معزولة عن التفاصيل.", en: "Business rules isolated from detail." } },
      { id: "ai", title: { ar: "وحدة الذكاء الاصطناعي", en: "AI module" }, text: { ar: "المطابقة والتحليل والخرائط.", en: "Matching, analysis and roadmaps." } },
      { id: "db", title: { ar: "SQL Server", en: "SQL Server" }, text: { ar: "تخزين منظم وآمن.", en: "Organised, secure storage." } },
    ],
    challenges: [
      {
        title: { ar: "قيادة ثلاثة مسارات بالتوازي", en: "Leading three tracks in parallel" },
        problem: { ar: "الخلفية والواجهة والذكاء الاصطناعي تتطور في الوقت نفسه وتعتمد على بعضها.", en: "Backend, frontend and AI evolved at the same time and depended on each other." },
        solution: { ar: "عقود API متفق عليها مبكراً، وفروع منظمة، ومراجعات للكود على GitHub.", en: "API contracts agreed early, organised branches and code reviews on GitHub." },
      },
    ],
    timeline: [
      { when: "10 / 2025", text: { ar: "انطلاق المشروع وتصميم المعمارية وتقسيم الفريق.", en: "Kick-off, architecture design and team split." } },
      { when: "06 / 2026", text: { ar: "التسليم النهائي والحصول على تقدير A+.", en: "Final delivery, graded A+." } },
    ],
    screens: [
      shot("career-path", "home", 3292, 8466, "الصفحة الرئيسية", "Landing page"),
      shot("career-path", "signin", 980, 1848, "تسجيل الدخول", "Sign in"),
    ],
  },

  /* ───────────────────────────── 04 · QR Attendance ───────────────────────────── */
  {
    slug: "qr-attendance",
    index: "04",
    year: "2025",
    visual: "qr",
    accent: "#c4a7ff",
    github: "https://github.com/HeshamMosad3/Qr-Attendance-System",
    client: { ar: "مشروع جامعي · الجامعة المصرية للتعلم الإلكتروني", en: "University project · EELU" },
    duration: { ar: "شهر واحد · سبتمبر 2025", en: "1 month · Sep 2025" },
    role: { ar: "مطوّر Full Stack .NET", en: "Full Stack .NET Developer" },
    context: { ar: "مشروع جامعي · نظام حضور ذكي", en: "University project · Smart attendance" },
    title: { ar: "نظام الحضور الذكي بتقنية QR", en: "Smart QR Attendance System" },
    short: { ar: "الحضور الذكي بـ QR", en: "Smart QR Attendance" },
    tagline: {
      ar: "تسجيل حضور الطلاب في ثوانٍ، بلا أوراق وبلا تلاعب.",
      en: "Student attendance in seconds, with no paper and no cheating.",
    },
    summary: {
      ar: "نظام ويب متكامل لإدارة الحضور الجامعي: يعرض المحاضر رمز QR يتجدد تلقائياً، ويمسحه الطالب بهاتفه، ثم يتحقق النظام من وجوده الفعلي داخل القاعة قبل تسجيل حضوره.",
      en: "A complete web system for university attendance: the lecturer displays a self-renewing QR code, students scan it with their phones, and the system confirms they are physically in the room before recording them.",
    },
    problem: {
      ar: "كشوف الحضور الورقية بطيئة ويسهل التلاعب بها، ورمز QR الثابت يمكن تصويره وإرساله لطالب غائب.",
      en: "Paper attendance sheets are slow and easy to fake, and a static QR code can be photographed and sent to an absent student.",
    },
    solution: {
      ar: "رمز يتجدد كل 30 ثانية ويظهر لحظياً على شاشة المحاضر، مع التحقق من موقع الطالب عبر GPS، وصلاحيات مستقلة لكل دور في النظام.",
      en: "A code that renews every 30 seconds and appears live on the lecturer screen, combined with GPS location checks and separate permissions for every role.",
    },
    stats: [
      { value: 30, suffix: "s", label: { ar: "دورة تجديد الرمز", en: "Code renewal cycle" }, note: { ar: "رمز جديد تلقائياً كل 30 ثانية", en: "A fresh code every 30 seconds" } },
      { value: 85, prefix: "~", suffix: "ms", label: { ar: "زمن التحديث اللحظي", en: "Live update latency" }, note: { ar: "عبر SignalR بدلاً من التحديث المتكرر", en: "Over SignalR instead of polling" } },
      { value: 3, label: { ar: "أدوار بصلاحيات مستقلة", en: "Roles with separate access" }, note: { ar: "المسؤول، المحاضر، الطالب", en: "Admin, Lecturer, Student" } },
      { value: 2, label: { ar: "صيغ للتقارير", en: "Report formats" }, note: { ar: "Excel وPDF", en: "Excel and PDF" } },
    ],
    features: [
      { title: { ar: "رمز QR متجدد", en: "Self-renewing QR" }, text: { ar: "خدمة خلفية تولّد رمزاً جديداً كل 30 ثانية لكل محاضرة نشطة.", en: "A background service generates a new code every 30 seconds for each active lecture." } },
      { title: { ar: "التحقق من الموقع", en: "Location check" }, text: { ar: "معادلة Haversine تحسب المسافة بين الطالب والقاعة بدقة.", en: "The Haversine formula measures the distance between the student and the room." } },
      { title: { ar: "تحديث لحظي", en: "Live updates" }, text: { ar: "يظهر الحضور على شاشة المحاضر فوراً دون إعادة تحميل الصفحة.", en: "Attendance appears on the lecturer screen instantly, without reloading." } },
      { title: { ar: "حماية متعددة الطبقات", en: "Layered security" }, text: { ar: "صلاحيات حسب الدور، وحدّ لعدد الطلبات، وسجلّ لكل عملية.", en: "Role-based access, rate limiting and an audit log of every action." } },
      { title: { ar: "تقارير وتنبيهات", en: "Reports and alerts" }, text: { ar: "تصدير بصيغتي Excel وPDF، وبريد إلكتروني تلقائي عند الغياب.", en: "Excel and PDF export, plus automatic absence e-mails." } },
      { title: { ar: "تطبيق قابل للتثبيت", en: "Installable app" }, text: { ar: "يعمل كتطبيق على الهاتف، مع وضع داكن، وماسح QR مدمج، ولوحة تحليلات برسوم بيانية.", en: "Installs like an app, with dark mode, a built-in QR scanner and an analytics dashboard." } },
    ],
    stack: [
      { group: { ar: "الخلفية", en: "Backend" }, items: ["C#", "ASP.NET Core MVC 8", "EF Core", "SignalR", "Background Services"] },
      { group: { ar: "البيانات", en: "Data" }, items: ["SQL Server"] },
      { group: { ar: "الواجهة", en: "Frontend" }, items: ["HTML5", "CSS3", "JavaScript", "PWA"] },
      { group: { ar: "الأمان", en: "Security" }, items: ["RBAC", "Rate Limiting", "Audit Logging"] },
    ],
    flow: [
      { id: "svc", title: { ar: "خدمة خلفية", en: "Background service" }, text: { ar: "تولّد رمزاً جديداً كل 30 ثانية.", en: "Generates a new code every 30 seconds." } },
      { id: "hub", title: { ar: "قناة SignalR", en: "SignalR hub" }, text: { ar: "تدفع الرمز إلى شاشة المحاضر لحظياً.", en: "Pushes the code to the lecturer screen live." } },
      { id: "scan", title: { ar: "هاتف الطالب", en: "Student phone" }, text: { ar: "يمسح الرمز ويرسل موقعه.", en: "Scans the code and sends its location." } },
      { id: "check", title: { ar: "طبقة التحقق", en: "Validation" }, text: { ar: "تتأكد من صلاحية الرمز والمسافة.", en: "Checks the code and the distance." } },
      { id: "db", title: { ar: "SQL Server", en: "SQL Server" }, text: { ar: "يُسجَّل الحضور ويُحدَّث التقرير.", en: "Attendance is stored and reports update." } },
    ],
    challenges: [
      {
        title: { ar: "منع مشاركة الرمز", en: "Preventing code sharing" },
        problem: { ar: "قد يصوّر الطالب الرمز ويرسله إلى زميل غائب.", en: "A student could photograph the code and send it to an absent friend." },
        solution: { ar: "رمز قصير العمر (30 ثانية) مع التحقق من الموقع بمعادلة Haversine.", en: "A short-lived code (30 seconds) plus Haversine location verification." },
      },
      {
        title: { ar: "سرعة دون إرهاق الخادم", en: "Speed without server strain" },
        problem: { ar: "تحديث الصفحة كل ثانية يستهلك موارد كبيرة.", en: "Refreshing the page every second wastes server resources." },
        solution: { ar: "اتصال لحظي عبر SignalR بزمن استجابة يقارب 85ms.", en: "A live SignalR connection with roughly 85ms latency." },
      },
    ],
    timeline: [{ when: "09 / 2025", text: { ar: "التصميم والتطوير والنشر كتطبيق ويب قابل للتثبيت.", en: "Designed, built and shipped as an installable web app." } }],
  },
];

export const upcoming: Upcoming[] = [];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Display order across the site: 01 Dar Al-Ruya, 02 upcoming app, 03 Career Path, 04 QR. */
export type Entry = { kind: "project"; p: Project } | { kind: "upcoming"; u: Upcoming };
export const ordered: Entry[] = [
  ...projects.map((p) => ({ kind: "project" as const, p })),
  ...upcoming.map((u) => ({ kind: "upcoming" as const, u })),
].sort((a, b) => (a.kind === "project" ? a.p.index : a.u.index).localeCompare(b.kind === "project" ? b.p.index : b.u.index));
