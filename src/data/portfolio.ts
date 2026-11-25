// =====================================================================
//  كل محتوى الموقع هنا. عدّلي البيانات دي بس والموقع كله هيتحدث.
//  All site content lives here. Replace the placeholders with your data.
// =====================================================================

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  longDescription?: string;
  tags: string[];
  /** Put images in /public/projects and use "/projects/my-image.jpg" */
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
};

export const profile = {
  firstName: "SOHILA",
  lastName: "EBRAHIM",
  role: "Full Stack Developer",
  location: "Based in Egypt",
  availability: "Available for work & freelance",
  signature: "Sohila Ebrahim",
  intro:
    "Full stack developer building fast, scalable web and mobile products, from polished animated front-ends to solid back-ends and dashboards.",
  email: "sohilaebrahim6789@gmail.com",
  phone: "+20 102 678 9767",
  year: "2026",
  cvUrl: "", // e.g. "/cv.pdf" after adding the file to /public
  socials: [
    { label: "GitHub", href: "https://github.com/sohilaebrahim00" },
    { label: "Email", href: "mailto:sohilaebrahim6789@gmail.com" },
  ],
};

export const services = [
  {
    title: "Web Development",
    description:
      "Interfaces built with intention: responsive, accessible and easy to use on every screen.",
    points: ["Next.js & React apps", "Responsive layouts", "Performance first"],
  },
  {
    title: "Motion & Interaction",
    description:
      "Scroll-driven storytelling and micro-interactions that make a product feel alive.",
    points: ["GSAP timelines", "Smooth scroll with Lenis", "Creative transitions"],
  },
  {
    title: "Advanced Solutions",
    description:
      "Dashboards, e-commerce and integrations that solve real business problems.",
    points: ["Progressive Web Apps", "Complex integrations", "Admin dashboards"],
  },
  {
    title: "Code Optimization",
    description:
      "Clean, typed, maintainable code that scales with your team and your product.",
    points: ["TypeScript everywhere", "Core Web Vitals", "Refactoring legacy code"],
  },
];

export const experience = [
  {
    role: "Full Stack Developer",
    company: "Client & agency projects",
    period: "2026 — Present",
    description:
      "Building websites, web apps, mobile apps and back-end APIs for clients in the US and the Middle East: roadside assistance platforms, chauffeur booking apps, restaurants with online ordering and immersive 3D e-commerce.",
  },
];

export const projects: Project[] = [
  {
    slug: "4d-lifestyle",
    title: "4D Lifestyle \u2014 3D E-Commerce Experience",
    category: "E-Commerce",
    year: "2026",
    description: "Immersive 3D shopping experience with real-time product scenes, smooth scroll storytelling and Stripe checkout.",
    tags: ["Next.js", "React Three Fiber", "GSAP", "Lenis", "Stripe", "Supabase"],
    image: "/projects/4d-lifestyle.webp",
    liveUrl: "https://4dlifestyle.netlify.app",
    githubUrl: "https://github.com/sohilaebrahim00/4d-life-style",
    featured: true,
  },
  {
    slug: "tra-roadside",
    title: "TRA \u2014 Texas Roadside Assistance",
    category: "Web App",
    year: "2026",
    description: "Roadside assistance platform with live maps, service requests and SMS notifications.",
    tags: ["Next.js", "Supabase", "GSAP", "Leaflet", "Twilio"],
    image: "/projects/tra-roadside.webp",
    liveUrl: "https://tra-roadside.vercel.app",
    githubUrl: "https://github.com/sohilaebrahim00/tra-roadside",
    featured: true,
  },
  {
    slug: "oha-roadside",
    title: "OHA Roadside Assistance",
    category: "Website",
    year: "2026",
    description: "Animated roadside assistance website with 3D visuals and smooth scrolling.",
    tags: ["React", "Vite", "GSAP", "Lenis", "Three.js", "Firebase"],
    image: "/projects/oha-roadside.jpg",
    liveUrl: "https://www.oha-roadside.com",
    featured: true,
  },
  {
    slug: "lct-universal",
    title: "LCT Universal \u2014 Chauffeur Service",
    category: "Website",
    year: "2026",
    description: "Luxury chauffeur service website with cinematic motion and 3D scenes.",
    tags: ["React", "Vite", "TanStack Router", "GSAP", "Three.js"],
    image: "/projects/lct-universal.jpg",
    liveUrl: "https://lctuniversal.com",
    githubUrl: "https://github.com/sohilaebrahim00/lct",
    featured: true,
  },
  {
    slug: "old-damascus",
    title: "Old Damascus Restaurant",
    category: "Restaurant",
    year: "2026",
    description: "Multilingual restaurant website with online ordering connected to Clover POS.",
    tags: ["Next.js", "Supabase", "Clover POS", "next-intl"],
    image: "/projects/old-damascus.webp",
    liveUrl: "https://www.olddamascustx.com",
    githubUrl: "https://github.com/sohilaebrahim00/old-damascus",
    featured: true,
  },
  {
    slug: "lct-customer-app",
    title: "LCT Universal \u2014 Customer App",
    category: "Mobile App",
    year: "2026",
    description: "Mobile app for booking chauffeur rides with payments and live trip status.",
    tags: ["React Native", "Expo", "Supabase", "Stripe"],
    image: "/projects/lct-customer-app.jpg",
    liveUrl: "https://lctapp.netlify.app",
    githubUrl: "https://github.com/sohilaebrahim00/lct-universal-customer-app",
  },
  {
    slug: "lct-driver-app",
    title: "LCT Universal \u2014 Driver App",
    category: "Mobile App",
    year: "2026",
    description: "Driver app for accepting and managing chauffeur trips.",
    tags: ["Expo", "Supabase"],
  },
  {
    slug: "lct-dispatch-dashboard",
    title: "LCT Universal \u2014 Dispatch Dashboard",
    category: "Dashboard",
    year: "2026",
    description: "Admin dispatch dashboard with live maps, bookings and analytics charts.",
    tags: ["React", "Vite", "Leaflet", "Recharts"],
  },
  {
    slug: "lct-backend",
    title: "LCT Universal \u2014 Backend API",
    category: "Backend API",
    year: "2026",
    description: "REST and real-time API powering the LCT apps, with payments and WebSockets.",
    tags: ["Express", "PostgreSQL", "Stripe", "WebSockets"],
    githubUrl: "https://github.com/sohilaebrahim00/lct-universal-backend",
  },
  {
    slug: "texas-battery-replacement",
    title: "Texas Battery Replacement",
    category: "Website",
    year: "2026",
    description: "SEO-focused service website generated by a custom static-site generator.",
    tags: ["Node.js", "esbuild", "Three.js", "SEO"],
    image: "/projects/texas-battery-replacement.png",
    liveUrl: "https://texasbatteryreplacement.com",
  },
  {
    slug: "alola-developments",
    title: "Al Ola Developments",
    category: "Real Estate",
    year: "2026",
    description: "Real estate developer website with scroll-driven animations.",
    tags: ["Next.js", "GSAP", "Lenis"],
    image: "/projects/alola-developments.webp",
    liveUrl: "https://aloladevelopments.com",
  },
  {
    slug: "salam-restaurant",
    title: "Salam Restaurant",
    category: "Restaurant",
    year: "2026",
    description: "Restaurant website with menu and serverless functions.",
    tags: ["React", "Vite", "shadcn/ui", "Netlify Functions"],
    image: "/projects/salam-restaurant.jpg",
    liveUrl: "https://salamtx.com",
  },
  {
    slug: "dr-monzer-allan",
    title: "Dr. Monzer Allan",
    category: "Web App",
    year: "2026",
    description: "Doctor website and installable PWA with mobile builds.",
    tags: ["React", "Vite", "Capacitor", "PWA", "Supabase"],
    image: "/projects/dr-monzer-allan.webp",
    liveUrl: "https://monzerallan.com",
    githubUrl: "https://github.com/sohilaebrahim00/drmonzerallancom-new",
  },
  {
    slug: "64west-store",
    title: "64West Building Materials \u2014 Store",
    category: "E-Commerce",
    year: "2026",
    description: "Building materials store for web and mobile.",
    tags: ["React", "Vite", "Capacitor"],
    image: "/projects/64west-store.jpg",
    liveUrl: "https://64westbm.com",
  },
  {
    slug: "64west-order-api",
    title: "64West \u2014 Order API",
    category: "Backend API",
    year: "2026",
    description: "Order management API with file storage and SMS notifications.",
    tags: ["NestJS", "Prisma", "PostgreSQL", "S3", "Twilio"],
  },
  {
    slug: "budget-floors-n-walls",
    title: "Budget Floors N Walls",
    category: "Website",
    year: "2026",
    description: "Flooring and walls company website.",
    tags: ["React", "Vite"],
    image: "/projects/budget-floors-n-walls.jpg",
    liveUrl: "https://budgetfloorsnwalls.com",
  },
  {
    slug: "ajh-marketing",
    title: "AJH Marketing",
    category: "Website",
    year: "2026",
    description: "Marketing agency website with Stripe payments.",
    tags: ["HTML", "CSS", "JavaScript", "Express", "Stripe"],
    image: "/projects/ajh-marketing.webp",
    liveUrl: "https://ajh.marketing",
  },
  {
    slug: "devware-website",
    title: "DevWare Agency Website",
    category: "Website",
    year: "2026",
    description: "Bilingual (EN/AR) agency website showcasing client work.",
    tags: ["HTML", "JavaScript", "EN/AR"],
    image: "/projects/devware-website.webp",
    liveUrl: "https://devware-website.netlify.app",
  },
  {
    slug: "foundex-fencing",
    title: "Foundex Fencing",
    category: "Website",
    year: "2026",
    description: "Fencing company website.",
    tags: ["HTML", "CSS", "JavaScript"],
    image: "/projects/foundex-fencing.jpg",
    liveUrl: "https://foundex.solutions",
  },
  {
    slug: "traqq-app",
    title: "TRAQQ Mobile App",
    category: "Mobile App",
    year: "2026",
    description: "Cross-platform mobile app built with Flutter and Firebase.",
    tags: ["Flutter", "Firebase"],
    image: "/projects/traqq-app.webp",
    liveUrl: "https://mytraqq.com",
  },
  {
    slug: "devware-motion",
    title: "DevWare Motion",
    category: "Video",
    year: "2026",
    description: "Programmatic motion videos built with React and Three.js.",
    tags: ["Remotion", "React", "Three.js"],
  },
];

export const stack = [
  { group: "Frontend", items: ["TypeScript", "React", "Next.js", "Vite", "Tailwind CSS", "shadcn/ui", "GSAP", "Lenis", "Three.js", "React Three Fiber"] },
  { group: "Mobile", items: ["React Native", "Expo", "Flutter", "Capacitor", "PWA"] },
  { group: "Backend", items: ["Node.js", "Express", "NestJS", "Prisma", "PostgreSQL", "Supabase", "Firebase", "WebSockets"] },
  { group: "Integrations", items: ["Stripe", "Twilio", "Clover POS", "Leaflet", "AWS S3"] },
  { group: "Tools", items: ["Git", "GitHub", "Vercel", "Netlify", "Figma", "Remotion"] },
];

// Add real testimonials here; the section stays hidden while this list is empty.
export const testimonials: { name: string; role: string; quote: string }[] = [];

export const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
