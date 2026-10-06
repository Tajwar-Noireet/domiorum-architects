# Domiorum Architects website

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4 and GSAP. Requires Node.js 20.9 or later.

## Run locally

```powershell
npm ci
npm run dev
```

Open http://localhost:3000. No environment variables or API keys are required for this version.

## Checks

```powershell
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

Browser tests cover desktop, phone and reduced motion using installed Google Chrome. Visual checks save screenshots to `../output/website-review/` at phone, tablet, desktop and landscape sizes and at three scroll positions. An axe-core check covers accessible controls in the animated scene. Change `launchOptions.channel` in `playwright.config.ts` to use a different installed browser, or install Playwright's Chromium and remove that option.

## Edit content

- `src/content/site.ts`: contact details and navigation.
- `src/content/projects.ts`: project descriptions, facts, credits and galleries.
- `src/content/services.ts`: services and proposed process.
- `src/content/asset-manifest.json`: provenance of selected image copies.
- `src/components/`: reusable presentation and interactive features.
- `src/styles/globals.css`: shared typography, palette and responsive layout.
- `src/styles/experience.css`: homepage composition and motion presentation.
- `src/components/home/HomeMotion.tsx`: motion preference and shared reveals.
- `src/components/home/ScrollHero.tsx`: expanding three-scene scroll sequence.
- `src/components/home/InteriorGallery.tsx`: horizontal room gallery and navigation.
- `DESIGN.md`: direction and reference decisions.

Source images and documents stay in the parent project folder. The script `../scripts/prepare-assets.py` prepares the selected WebP copies. It requires Pillow and pypdf and preserves the originals.

The homepage respects reduced-motion preferences by default. Its visible motion control stores an explicit choice in session storage. Portrait phones use a shorter hero sequence; the horizontal gallery uses native scrolling on phones. Short landscape screens use an ordinary hero.

## Vercel

Import the existing GitHub repository and set **Root Directory** to `website`. Framework preset: Next.js. Install: `npm ci`. Build: `npm run build`. Output directory: Next.js default. No environment variables are needed.

This is a client review build: robots metadata and `/robots.txt` prevent indexing. Remove that restriction after content, permissions, domain and launch approval are confirmed. Set `metadataBase`, canonical URLs, Open Graph metadata and a sitemap against the final domain then.

Enquiry forms currently prepare email drafts. Direct server delivery, appointment availability and paid checkout require separately configured services. No email is sent automatically by the website.
