# Application architecture

Hosting target: Vercel. Frontend: Next.js App Router, React, TypeScript, Tailwind CSS and GSAP ScrollTrigger.

```text
website/
  public/
    brand/
    images/home/
    images/interiors/
    images/projects/<project>/
    images/studio/
  src/
    app/
      layout.tsx
      page.tsx
      projects/page.tsx
      projects/[slug]/page.tsx
      services/page.tsx
      contact/page.tsx
      careers/page.tsx
      book-consultation/page.tsx
      privacy/page.tsx
      not-found.tsx
    components/
      layout/       # SiteHeader, SiteFooter
      ui/           # LinkButton
      home/         # HomeMotion, ScrollHero, InteriorGallery
      projects/     # ProjectCard, ProjectBrowser
      contact/      # EnquiryForm
    content/        # site, projects, services, asset-manifest
    types/
    styles/
      globals.css
      experience.css
  tests/e2e/
```

Route files compose pages. Reusable elements live in components, editable text and project records in content, and shared types in types. Project galleries share one template. Page composition remains server-rendered; client components handle navigation, filtering, enquiries and motion.

HomeMotion wraps server-rendered homepage sections with a motion preference context. ScrollHero and InteriorGallery own their respective GSAP timelines. Shared reveals use scoped selectors and do not trigger React renders on scroll. GSAP loads only when motion is enabled. Layout-effect cleanup restores pinned elements before React removes them during navigation. Measurements refresh after fonts load and when viewport size changes.

Desktop uses an expanding three-scene hero and a horizontal gallery. Portrait phones use the shorter hero and a native horizontal gallery. Short phone landscape screens use an ordinary hero. Reduced-motion users start with ordinary scrolling and may explicitly enable animation using the visible control. The preference is stored in session storage for this browser session.

The current portfolio uses three projects identified in Zarin's supplied portfolio, with real design visualizations and previous-practice credits. The six projects named in the questionnaire remain the eventual target portfolio; completing that list needs image-to-project mapping. The anonymous room sequence does not invent project locations, client names or ownership claims.

Semantic colour tokens, responsive typography, keyboard-accessible navigation, visible focus, labelled forms and meaningful alt text support usability. ESLint, TypeScript, production builds, Playwright flow checks and visual reviews verify changes. The asset manifest records every optimized source copy; the originals are preserved.

Contact and consultation forms validate fields and prepare a mailto draft with a copy fallback. CMS, server contact delivery, paid consultation booking, payments and domain connection remain separate implementation decisions. The client review build is excluded from search indexing. Vercel should use `website` as its root directory.
