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

This is the proposed structure; these application files have not been generated yet.

Keep route files focused on page composition. Put reusable elements in components, editable text and project records in content, and shared types in types. Project galleries use a single template. Prefer Server Components; use client components for interactive controls only.

Start with six project records and clearly identified image placeholders. Replace placeholders with approved client assets later. No invented project facts, testimonials, affiliations, or statistics.

Use semantic color tokens, responsive typography, keyboard-accessible navigation, visible focus, labeled forms, meaningful alt text, and reduced-motion support. Verify with TypeScript, ESLint, production build, and meaningful Playwright checks once the app exists.

CMS, contact delivery, paid consultation booking, payment handling, and domain connection remain separate implementation decisions.
