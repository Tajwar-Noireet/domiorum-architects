# Discover us and shared interactions

The founder profile now lives at `/discover`, linked from desktop and mobile navigation, the homepage studio introduction and the footer. The homepage retains a short practice introduction and interior imagery, with no founder portrait or biography.

`website/src/content/team.ts` contains Zarin's profile and project associations; future employee profiles can use the same structure. Current Domiorum projects appear together, followed by a separate previous-experience section for Selim Residence. That work retains the credit for Zarin Nawar as Associate Architect at Innova Architects and Ar Sanjida Shams as Project Architect. Doctors Residence retains its approved exterior cover only.

The page reuses Jost, navy, ivory, gold, the supplied portrait, ProjectCard, HoverText and LinkButton. No stock images, employees or authorship claims were added.

## Motion references

- [Origin UI Menu Button](https://21st.dev/@originui/components/button/menu-button): the public usage example informed the three SVG strokes that morph into a close icon. The header retains its keyboard trap and Escape dismissal.
- [Flame Button](https://21st.dev/@ayushmxxn/components/flame-button): the public description informed a local recreation of a cursor-reactive warm glow. Component source was unavailable through the public page. Existing FlowButton fill, arrow exchange and lift are retained; a restrained gold glow sits above the fill and below the text.

Clickable links and buttons receive hover/focus movement. CSS `translate` keeps link movement independent of GSAP and Framer transforms. Glow tracking uses one delegated passive pointer listener and requestAnimationFrame rather than React state updates for each movement. Touch devices avoid sticky hover effects.

The mobile menu animates height and opacity. Closed content is immediately inert and hidden from assistive technology. Escape, outside pointer input and route selection dismiss it. Short screens can scroll through every link. The enquiry selector animates its listbox and supports keyboard selection, type-ahead, Escape/Tab dismissal and submitted form values. A native select remains available before hydration and with JavaScript disabled. Questions retain native details/summary behavior with progressive CSS disclosure motion where supported.

Operating-system reduced motion suppresses hover movement, glow tracking and panel transitions. Existing homepage and project scroll controls remain independent.

## Verification

ESLint, TypeScript and production build passed. Browser checks covered founder placement, separate credits, navigation, keyboard and touch dropdown selection, enquiry draft values, no-JavaScript fallback, short-screen scrolling, WCAG accessibility checks, motion reset and reduced motion. Existing homepage, portfolio and project-gallery scrolling checks passed. Desktop and phone previews were inspected in the in-app browser.

The 21st CLI is not installed here. Public reference research and local checks were used; no hosted 21st review was claimed and no local source/design context was uploaded.
