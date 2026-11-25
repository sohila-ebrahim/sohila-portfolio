// =====================================================================
//  كل محتوى الموقع هنا. عدّلي البيانات دي بس والموقع كله هيتحدث.
//  All site content lives here. Edit this file and the whole site updates.
// =====================================================================

/** Filter groups used by the tabs above the projects list. */
export const projectKinds = ["Websites", "Web apps", "E-commerce", "Mobile apps", "Dashboards", "Backend"] as const;
export type ProjectKind = (typeof projectKinds)[number];

export type Project = {
  slug: string;
  title: string;
  /** Short label shown above the title, e.g. "Restaurant · Online ordering" */
  category: string;
  kind: ProjectKind;
  year: string;
  description: string;
  longDescription?: string;
  tags: string[];
  /** Put images in /public/projects and use "/projects/my-image.webp" */
  image?: string;
  /** Verified public URL. Leave empty for private client work. */
  liveUrl?: string;
  githubUrl?: string;
  /** false when the site refuses to load inside an iframe (X-Frame-Options / CSP) */
  embeddable?: boolean;
  featured?: boolean;
};

export const profile = {
  firstName: "SOHILA",
  lastName: "EBRAHIM",
  shortName: "SOHILA",
  role: "Full Stack Developer",
  roles: ["Full Stack Developer", "Front-end Engineer", "Creative Developer"],
  location: "Egypt",
  availability: "Available for work & freelance",
  signature: "Sohila Ebrahim",
  intro:
    "Full stack developer building fast, scalable web and mobile products, from polished animated front-ends to solid back-ends and dashboards.",
  bio: [
    "I'm a full stack developer who ships real products for real businesses: roadside-assistance platforms with live dispatch, chauffeur booking apps, restaurants with online ordering, real-estate sites and immersive 3D brand experiences.",
    "I care about the details users feel: fast loading, smooth motion, clear flows and code that stays easy to grow. From the first sketch to deployment, I handle the front-end, the back-end and everything in between.",
  ],
  email: "sohilaebrahim6789@gmail.com",
  phone: "+20 102 678 9767",
  whatsapp: "https://wa.me/201026789767",
  year: "2026",
  cvUrl: "", // e.g. "/cv.pdf" after adding the file to /public
  socials: [
    { label: "GitHub", href: "https://github.com/sohilaebrahim00" },
    { label: "WhatsApp", href: "https://wa.me/201026789767" },
    { label: "Email", href: "mailto:sohilaebrahim6789@gmail.com" },
  ],
};

export const services = [
  {
    title: "Web Development",
    description:
      "Modern, responsive websites built around your brand and goals: landing pages, business and agency sites, restaurants and real-estate showcases.",
    points: ["Landing pages & business websites", "Bilingual sites (EN / AR / ES)", "SEO & Core Web Vitals"],
  },
  {
    title: "Web Apps & E-Commerce",
    description:
      "Full products with accounts, payments and dashboards: booking flows, online ordering, stores and admin panels that run day-to-day operations.",
    points: ["Next.js & React apps", "Stripe, Clover POS & payments", "Admin & dispatch dashboards"],
  },
  {
    title: "Mobile Apps",
    description:
      "Cross-platform apps for iOS and Android that share one codebase, with maps, live tracking, notifications and payments.",
    points: ["React Native & Expo", "Flutter", "Capacitor & PWAs"],
  },
  {
    title: "Back-end & Integrations",
    description:
      "APIs and data layers that power the apps: authentication, real-time updates, file storage, SMS and email notifications.",
    points: ["Node.js, Express & NestJS", "Supabase, PostgreSQL & Prisma", "Twilio, Resend & WebSockets"],
  },
  {
    title: "Motion & Interaction",
    description:
      "Scroll-driven storytelling, 3D scenes and micro-interactions that make a product feel alive without slowing it down.",
    points: ["GSAP & ScrollTrigger", "Three.js & React Three Fiber", "Smooth scroll with Lenis"],
  },
];

export const experience = [
  {
    role: "Full Stack Developer",
    company: "Freelance & client projects",
    period: "2026 — Present",
    points: [
      "Delivered 30+ websites, web apps, mobile apps and APIs for clients in the US, Egypt, the Gulf and the UK.",
      "Built a full roadside-assistance platform (public site, GPS request flow, live driver tracking, dispatch dashboard).",
      "Shipped a chauffeur booking ecosystem: website, customer app, driver app, dispatch dashboard and back-end API.",
      "Integrated payments and operations tools: Stripe, Clover POS, Twilio SMS, Resend email and Supabase.",
    ],
  },
  {
    role: "Web Developer",
    company: "DevWare — software studio",
    period: "2025 — 2026",
    points: [
      "Built and launched real-estate, restaurant, education and corporate websites for Egyptian and Gulf brands.",
      "Developed internal systems: CRM / ERP, clinic and radiology platforms and a real-estate sales system.",
      "Focused on bilingual (Arabic / English) layouts, performance and SEO.",
    ],
  },
];

const d = "2026";

export const projects: Project[] = [
  // ordered: most visually impressive first; the first 5 are the featured cards
  {
    slug: "4d-lifestyle",
    title: "4D Lifestyle — Holistic Coaching",
    category: "Brand site · Booking",
    kind: "Websites",
    year: d,
    description: "Immersive brand site for a holistic life-coaching practice, with 3D scenes, smooth scroll and online booking.",
    longDescription: "A brand experience for 4D Lifestyle with React Three Fiber scenes, GSAP + Lenis scroll storytelling, Stripe payments and Supabase-backed content.",
    tags: ["Next.js", "React Three Fiber", "GSAP", "Lenis", "Stripe", "Supabase"],
    image: "/projects/4d-lifestyle.webp",
    liveUrl: "https://4dlifestyle.netlify.app",
    githubUrl: "https://github.com/sohilaebrahim00/4d-life-style",
    embeddable: false,
    featured: true,
  },
  {
    slug: "lct-universal",
    title: "LCT Universal — Executive Transportation",
    category: "Website · Booking",
    kind: "Websites",
    year: d,
    description: "Cinematic website for a chauffeured transportation company in Dallas–Fort Worth, with fleet, services and quote booking.",
    longDescription: "Website for LCT Universal Executive Transports: a cinematic hero, fleet and service pages, 3D touches and a booking / quote flow..",
    tags: ["React", "Vite", "TypeScript", "TanStack Router", "GSAP", "Three.js", "Tailwind CSS"],
    image: "/projects/lct-universal.webp",
    liveUrl: "https://lct-universal.netlify.app",
    githubUrl: "https://github.com/sohilaebrahim00/lct",
    embeddable: false,
    featured: true,
  },
  {
    slug: "oha-roadside",
    title: "OHA Roadside Assistance",
    category: "Website · Admin",
    kind: "Websites",
    year: d,
    description: "Bilingual (EN / ES) 24/7 roadside assistance site with a battery finder, request form, city pages and an admin page.",
    longDescription: "Every page is pre-rendered to static HTML in English and Spanish, and only the interactive parts load JavaScript: the battery finder, the request form, the city search and the careers form. Requests land in an admin page for the team.",
    tags: ["React", "Vite", "TypeScript", "GSAP", "Lenis", "Three.js", "Firebase"],
    image: "/projects/oha-roadside.webp",
    liveUrl: "https://www.oha-roadside.com",
    embeddable: true,
    featured: true,
  },
  {
    slug: "alola-developments",
    title: "Al Ola Developments",
    category: "Real estate",
    kind: "Websites",
    year: d,
    description: "Cinematic bilingual website for a real-estate developer, with scroll-driven animations.",
    tags: ["Next.js", "TypeScript", "GSAP", "Lenis"],
    image: "/projects/alola-developments.webp",
    liveUrl: "https://www.aloladevelopments.com",
    embeddable: true,
    featured: true,
  },
  {
    slug: "old-damascus",
    title: "Old Damascus Restaurant",
    category: "Restaurant · Online ordering",
    kind: "E-commerce",
    year: d,
    description: "Bilingual Mediterranean restaurant website with online ordering connected to Clover POS.",
    longDescription: "A bilingual restaurant website built with Next.js. The menu syncs with Clover POS and orders go through hosted checkout, with Supabase for data and a fallback seed menu.",
    tags: ["Next.js", "TypeScript", "Supabase", "Clover POS", "next-intl", "Tailwind CSS"],
    image: "/projects/old-damascus.webp",
    liveUrl: "https://6ad4a0469c9c1d55231871a0--oldda.netlify.app/",
    githubUrl: "https://github.com/sohilaebrahim00/old-damascus",
    embeddable: false,
    featured: true,
  },
  {
    slug: "tra-roadside",
    title: "TRA — Texas Roadside Assistance",
    category: "Platform · Dispatch",
    kind: "Web apps",
    year: d,
    description: "Roadside assistance platform with a GPS request flow, live driver tracking, a driver portal and a dispatch dashboard.",
    longDescription: "A production roadside-assistance platform for Dallas–Fort Worth: a mobile-first public site, a multi-step request flow with live GPS, secure live driver tracking for customers, a mobile driver portal and a role-based admin / dispatch dashboard with SMS updates.",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "GSAP", "Leaflet", "Twilio"],
    image: "/projects/tra-roadside.webp",
    liveUrl: "https://www.txroadsideassistance.com",
    githubUrl: "https://github.com/sohilaebrahim00/tra-roadside",
    embeddable: true,
  },
  {
    slug: "salam-restaurant",
    title: "Salam Juice & Mutbaq",
    category: "Restaurant · Ordering",
    kind: "E-commerce",
    year: d,
    description: "Yemeni mutabbaq and juice restaurant in Richardson, TX, with menu and online ordering.",
    tags: ["React", "Vite", "TypeScript", "shadcn/ui", "Netlify Functions"],
    image: "/projects/salam-restaurant.webp",
    liveUrl: "https://salamtx.com",
    embeddable: true,
  },
  {
    slug: "dr-monzer-allan",
    title: "Dr. Monzer Allan — Nutrition & Wellness",
    category: "Website · PWA",
    kind: "Web apps",
    year: d,
    description: "Arabic website and installable PWA for a nutrition specialist and pharmacist, with mobile builds.",
    tags: ["React", "Vite", "TypeScript", "Capacitor", "PWA", "Supabase"],
    image: "/projects/dr-monzer-allan.webp",
    liveUrl: "https://drmonzerallan.netlify.app",
    githubUrl: "https://github.com/sohilaebrahim00/drmonzerallancom-new",
    embeddable: false,
  },
  {
    slug: "velora",
    title: "Velora — Luxury Travel & Concierge",
    category: "Travel · Booking",
    kind: "Web apps",
    year: d,
    description: "Luxury travel and concierge booking app: flights, hotels, visa concierge and rentals in one search.",
    tags: ["React", "Vite", "TypeScript"],
    image: "/projects/velora.webp",
    liveUrl: "https://velora-six-rho.vercel.app",
    embeddable: true,
  },
  {
    slug: "ajh-marketing",
    title: "AJH Marketing",
    category: "Agency",
    kind: "Websites",
    year: d,
    description: "Site for a marketing agency working across Dallas, London, Abu Dhabi, Amman and Cairo.",
    tags: ["Next.js", "Stripe", "Motion"],
    image: "/projects/ajh-marketing.webp",
    liveUrl: "https://ajh.marketing",
    embeddable: true,
  },
  {
    slug: "westway-collision",
    title: "Westway Collision Center",
    category: "Automotive",
    kind: "Websites",
    year: d,
    description: "Premium collision-repair and auto-body shop website in Dallas, TX.",
    tags: ["React", "Vite", "Responsive"],
    image: "/projects/westway.webp",
    liveUrl: "https://collisionwestway.com",
    embeddable: true,
  },
  {
    slug: "budget-floors-n-walls",
    title: "Budget Floors N Walls",
    category: "Showroom · Catalog",
    kind: "Websites",
    year: d,
    description: "Website for a Dallas flooring showroom: hardwood, vinyl, tile and carpet catalog with estimates.",
    tags: ["React", "Vite", "TypeScript", "React Router"],
    image: "/projects/budget-floors-n-walls.webp",
    liveUrl: "https://budgetfloorsnwalls.com",
    embeddable: true,
  },
  {
    slug: "traqq",
    title: "TRAQQ — Private Transportation",
    category: "Website · Mobile app",
    kind: "Mobile apps",
    year: d,
    description: "Door-to-door shuttle and airport transfers in DFW, plus a Flutter app for Google Play and the App Store.",
    tags: ["Flutter", "Dart", "Firebase", "Android", "iOS"],
    image: "/projects/traqq.webp",
    liveUrl: "https://mytraqq.com",
    embeddable: false,
  },
  {
    slug: "texas-battery-replacement",
    title: "Texas Battery Replacement",
    category: "Local business · SEO",
    kind: "Websites",
    year: d,
    description: "Fast, SEO-focused site for a mobile car-battery replacement service, generated by a custom static-site builder.",
    tags: ["Node.js", "esbuild", "Three.js", "SEO", "JSON-LD"],
    image: "/projects/texas-battery-replacement.webp",
    liveUrl: "https://texasbatteryreplacement.com",
    embeddable: false,
  },
  {
    slug: "64west-store",
    title: "64West Building Materials — Store",
    category: "E-commerce · Mobile",
    kind: "E-commerce",
    year: d,
    description: "Lumber and building-supply store in Tyler, TX: live stock, reserve with a deposit, pick up or get it delivered.",
    longDescription: "Storefront for a building-materials yard: browse live stock, reserve with a 30% deposit, then pick up at the yard or get delivery to the jobsite. The same code ships as a mobile app with Capacitor, backed by a NestJS order service.",
    tags: ["React", "Vite", "TypeScript", "Tailwind CSS", "Capacitor", "NestJS"],
    image: "/projects/64west-store.webp",
    liveUrl: "https://www.64westbm.com",
    embeddable: false,
  },
  {
    slug: "foundex-fencing",
    title: "Foundex Fencing",
    category: "Local business",
    kind: "Websites",
    year: d,
    description: "Website for a cedar and treated-timber fencing company in Houston, TX.",
    tags: ["HTML", "CSS", "JavaScript", "SEO"],
    image: "/projects/foundex-fencing.webp",
    liveUrl: "https://foundex.solutions",
    embeddable: false,
  },
  {
    slug: "altazaj",
    title: "Altazaj Food Industries",
    category: "Food industry",
    kind: "Websites",
    year: d,
    description: "Product website for a frozen-food manufacturer.",
    tags: ["WordPress", "Elementor"],
    image: "/projects/altazaj.webp",
    liveUrl: "https://altazaj-egy.com",
    embeddable: true,
  },
  {
    slug: "denisse-carrera",
    title: "Denisse Carrera",
    category: "Website",
    kind: "Websites",
    year: d,
    description: "Personal website built and deployed by Sohila on Netlify.",
    tags: ["Responsive", "Netlify"],
    liveUrl: "https://denissecarrera.netlify.app/",
    embeddable: false,
  },
  {
    slug: "devware-website",
    title: "DevWare — Studio Website",
    category: "Agency",
    kind: "Websites",
    year: d,
    description: "Bilingual (EN / AR) studio site with a particle hero, services, systems and a JSON-driven portfolio.",
    tags: ["HTML", "CSS", "JavaScript", "i18n"],
    image: "/projects/devware-website.webp",
    liveUrl: "https://devware-website.netlify.app",
    embeddable: false,
  },
  {
    slug: "64west-app",
    title: "64West — Mobile App",
    category: "Mobile app",
    kind: "Mobile apps",
    year: d,
    description: "Mobile version of the 64West store for contractors: browse stock, reserve and track orders.",
    tags: ["React", "Capacitor", "Android", "iOS"],
    image: "/projects/64west-app.webp",
    liveUrl: "https://64west.netlify.app",
    embeddable: false,
  },
  {
    slug: "physio-system",
    title: "Physiotherapy Center System",
    category: "Healthcare system",
    kind: "Dashboards",
    year: d,
    description: "Clinic management: patients, sessions, schedules, therapists and billing.",
    tags: ["Dashboard", "Booking", "Reports"],
    image: "/projects/sys-physio.webp",
  },
  {
    slug: "radiology-platform",
    title: "Radiology Centers Platform",
    category: "Healthcare system",
    kind: "Dashboards",
    year: d,
    description: "Multi-branch radiology platform: appointments, scans, reports and patient records.",
    tags: ["Dashboard", "Multi-branch", "Reports"],
    image: "/projects/sys-radiology.webp",
  },
  {
    slug: "crm-erp",
    title: "Company CRM & ERP",
    category: "Corporate system",
    kind: "Dashboards",
    year: d,
    description: "CRM and ERP for a company: leads, clients, sales pipeline, invoices and inventory.",
    tags: ["CRM", "ERP", "Dashboard"],
    image: "/projects/sys-crm-erp.webp",
  },
  {
    slug: "realestate-system",
    title: "Real Estate Developer System",
    category: "Real estate system",
    kind: "Dashboards",
    year: d,
    description: "Sales system for a developer: projects, units, reservations, installments and brokers.",
    tags: ["Dashboard", "Sales", "Reports"],
    image: "/projects/sys-realestate.webp",
  },
  {
    slug: "64west-order-api",
    title: "64West — Order Service API",
    category: "API",
    kind: "Backend",
    year: d,
    description: "NestJS order service: deposits, JWT auth, S3 uploads, scheduled jobs, SMS and email notifications.",
    tags: ["NestJS", "TypeScript", "Prisma", "PostgreSQL", "Twilio", "Resend"],
  },
  {
    slug: "devware-motion",
    title: "DevWare Motion",
    category: "Motion · Video",
    kind: "Web apps",
    year: d,
    description: "Programmatic promo videos rendered with Remotion, React and Three.js.",
    tags: ["Remotion", "React", "TypeScript", "Three.js"],
  },
  {
    slug: "al-reem-halal",
    title: "Al Reem Halal",
    category: "Restaurant",
    kind: "Websites",
    year: d,
    description: "Shawarma and taco restaurant website with menu.",
    tags: ["Responsive", "Menu"],
    image: "/projects/alreem.webp",
  },
  {
    slug: "el-adl-export",
    title: "El Adl Export",
    category: "Agri export",
    kind: "Websites",
    year: d,
    description: "Website for an agricultural export company.",
    tags: ["Responsive", "Arabic / English"],
    image: "/projects/eladl.webp",
  },
];

export const liveProjects = projects.filter((p) => p.liveUrl);

/**
 * Sohila's real stack, taken from the package.json files of her projects.
 * `icon` = simple-icons export name (see src/lib/icons.ts); empty = monogram badge.
 */
export const stack: { group: string; items: { name: string; icon?: string }[] }[] = [
  {
    group: "Frontend Development",
    items: [
      { name: "React", icon: "siReact" },
      { name: "Next.js", icon: "siNextdotjs" },
      { name: "TypeScript", icon: "siTypescript" },
      { name: "JavaScript", icon: "siJavascript" },
      { name: "HTML", icon: "siHtml5" },
      { name: "CSS", icon: "siCss" },
      { name: "Tailwind CSS", icon: "siTailwindcss" },
      { name: "Vite", icon: "siVite" },
      { name: "Zustand" },
      { name: "TanStack Query", icon: "siReactquery" },
      { name: "React Hook Form", icon: "siReacthookform" },
      { name: "Zod", icon: "siZod" },
      { name: "React Router", icon: "siReactrouter" },
      { name: "GSAP", icon: "siGsap" },
      { name: "Framer Motion", icon: "siFramer" },
      { name: "Three.js", icon: "siThreedotjs" },
      { name: "Lenis" },
      { name: "React Native", icon: "siReact" },
      { name: "Expo", icon: "siExpo" },
      { name: "Flutter", icon: "siFlutter" },
      { name: "Capacitor", icon: "siCapacitor" },
    ],
  },
  {
    group: "Backend & Database",
    items: [
      { name: "Node.js", icon: "siNodedotjs" },
      { name: "Express", icon: "siExpress" },
      { name: "NestJS", icon: "siNestjs" },
      { name: "Supabase", icon: "siSupabase" },
      { name: "PostgreSQL", icon: "siPostgresql" },
      { name: "Prisma", icon: "siPrisma" },
      { name: "Firebase", icon: "siFirebase" },
      { name: "WebSockets", icon: "siSocketdotio" },
      { name: "REST APIs" },
    ],
  },
  {
    group: "Integrations & Tools",
    items: [
      { name: "Stripe", icon: "siStripe" },
      { name: "Clover POS" },
      { name: "Twilio" },
      { name: "Resend", icon: "siResend" },
      { name: "Leaflet Maps", icon: "siLeaflet" },
      { name: "Recharts" },
      { name: "AWS S3" },
      { name: "Axios", icon: "siAxios" },
      { name: "Vitest", icon: "siVitest" },
      { name: "Jest", icon: "siJest" },
      { name: "Playwright" },
      { name: "ESLint", icon: "siEslint" },
      { name: "Prettier", icon: "siPrettier" },
      { name: "Git", icon: "siGit" },
      { name: "GitHub", icon: "siGithub" },
      { name: "Vercel", icon: "siVercel" },
      { name: "Netlify", icon: "siNetlify" },
    ],
  },
];

/** Add certificates here: { title, issuer, year, url? }. The tab stays hidden while empty. */
export const certificates: { title: string; issuer: string; year: string; url?: string }[] = [];

// Add real testimonials here; the section stays hidden while this list is empty.
export const testimonials: { name: string; role: string; quote: string }[] = [];

export const stats = [
  { value: projects.length, suffix: "+", label: "Projects delivered" },
  { value: liveProjects.length, suffix: "", label: "Live client sites" },
  { value: stack.reduce((n, g) => n + g.items.length, 0), suffix: "+", label: "Technologies" },
];

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Stack", href: "#portfolio" },
  { label: "Contact", href: "#contact" },
];
