# Application architecture

Hosting: Vercel. Frontend: Next.js App Router, React, TypeScript, Tailwind CSS.

```text
website/
  public/
    brand/
    images/placeholders/
    images/projects/<project-slug>/
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
    components/
      layout/       # SiteHeader, MobileMenu, SiteFooter
      ui/           # Button, Container, FormField
      home/         # Hero, FeaturedProjects
      projects/     # ProjectCard, ProjectGallery, ProjectFacts
      services/
      contact/
      careers/
      booking/
    content/        # site, home, projects, services, careers
    types/
    lib/
    styles/globals.css
  tests/e2e/
```

This structure is implemented. A privacy page, a branded 404 and browser tests are also included.

Keep route files focused on page composition. Put reusable elements in components, editable text and project records in content, and shared types in types. Project galleries use a single template. Prefer Server Components; use client components for interactive controls only.

The first build uses three projects identified in Zarin's supplied portfolio, with real supplied design visualizations and explicit previous-practice credits. The six projects named in the questionnaire remain the eventual target portfolio; more image-to-project mapping is needed before completing that list. No invented project facts, testimonials, affiliations or statistics.

Use semantic color tokens, responsive typography, keyboard-accessible navigation, visible focus, labeled forms, meaningful alt text, and reduced-motion support. Verify with TypeScript, ESLint, production build, and meaningful Playwright checks once the app exists.

GSAP is loaded for desktop motion when allowed by user preferences. A layout-effect cleanup restores pinned DOM before React removes it during navigation. Native scrolling remains intact. Small screens and reduced-motion users get a static hero.

Contact and consultation forms validate fields and prepare a mailto draft with a copy fallback. CMS, server contact delivery, paid consultation booking, payments and domain connection remain separate implementation decisions.
