# Shibori website review and Domiorum response

Reviewed 7 October 2026. This is a live website and content review, with direct browser inspection of desktop pages and the mobile homepage. Recommendations are design judgments, not measured conversion results.

## Decision

Domiorum should compete through a distinctive presentation of real design work, useful explanations for homeowners and clear project enquiries. Keep the approved navy, ivory and gold identity, Jost typography, drafting cursors, exploded house and interior scroll sequence. Invest in project evidence rather than adding generic luxury claims or more stock photographs.

## Coverage

| Page | What was inspected |
| --- | --- |
| [Homepage](https://shiboribd.com/) | Hero, section sequence, navigation, CTAs, FAQs, footer and mobile presentation |
| [About](https://shiboribd.com/about) | Studio positioning, people, proof and next steps |
| [Services](https://shiboribd.com/services) | Service range, descriptions, destinations and FAQs |
| [Portfolio](https://shiboribd.com/portfolio) | Categories, project previews and navigation |
| [Cozy Dining Area](https://shiboribd.com/portfolio/interior-design/1) | Project facts, narrative, image provenance and comparison interface |
| [Blogs](https://shiboribd.com/blogs) | Listing content, authorship and editorial consistency |
| [Contact](https://shiboribd.com/contact) | Contact information, enquiry fields, labels and selection controls |

No enquiry was submitted. Backend delivery, bookings, client identities, project ownership and analytics were not verified. No comparative Lighthouse, ranking or field-performance results are claimed. Observations may change as Shibori updates its site.

## What Shibori does well

The [homepage](https://shiboribd.com/) establishes an image-led visual identity quickly. Large interiors, confident typography and restrained colours give the work room to breathe. The mobile hero fits the inspected 390 × 844 viewport without horizontal document overflow. The overall sequence covers studio, process, services and work, giving visitors several routes into the practice.

The [portfolio](https://shiboribd.com/portfolio) groups different disciplines, making a broad offer easier to browse. Project previews lead to a detail page rather than stopping at a gallery. That is a useful pattern when enough genuinely distinct work exists to support categories.

The [contact form](https://shiboribd.com/contact) asks about project type and area. Those details are useful for evaluating a brief and make the conversation more specific than a generic message box.

## Where Domiorum can do better

### 1. Make every next step match its label

On the [homepage](https://shiboribd.com/), a project CTA points to an empty fragment. The terms and licence footer links also point to empty fragments. Several process and service links share the portfolio destination. The repeated business-oriented FAQ topics are poorly matched to someone planning a home. The inspected mobile menu button has no accessible name or exposed expanded state; its complete interaction was not established.

For Domiorum, keep a small navigation and assign a specific destination to each action: a residence, its rooms, a service scope or an enquiry. Test destination and keyboard behaviour together. A visitor should know what happens before clicking.

### 2. Treat imagery as evidence, with clear provenance

The inspected [Cozy Dining Area detail](https://shiboribd.com/portfolio/interior-design/1) includes project facts and an overview/concept/process structure. Its overview and comparison images include direct Unsplash URLs. For example, `photo-1618221195710-dd6b41faaea6` is reused in the overview, concept and after view. `photo-1600210492486-724fe5c67fb0` and `photo-1616486338812-3dadae4b4ace` appear in both before and after groups. This establishes reuse, not whether the described project or client is authentic. The inspected comparison DOM did not expose a semantic slider control.

Domiorum already has supplied high-definition visualizations and recorded credits. Show the apartment area, the design brief, circulation/storage decisions and related room views together. Make the visualization status and previous-practice credits visible. Do not construct a transformation story from unrelated stock images.

### 3. Explain what the service actually covers

The [services page](https://shiboribd.com/services) presents interiors, architecture, visualization, furniture and construction. Service actions lead to the portfolio rather than service-specific scope. Some framing discusses brand experience, and its FAQs again concern business advice. The breadth is apparent; the homeowner's next decision is less clear.

Domiorum should answer three practical questions for each service: Is this suitable for my situation? What do we discuss? What documentation or support needs to be agreed? Describe scope boundaries without promising fixed fees, approval outcomes or construction delivery that the studio has not confirmed.

### 4. Let visitors identify the person behind the studio

The inspected [about page](https://shiboribd.com/about) emphasises philosophy and broad design outcomes. A named founder or team biography was not present in the inspected body content. A visitor gets positioning but limited information about the individual who will lead the work.

Domiorum's existing founder portrait and verified biography are useful differentiators. Keep Zarin's role visible and distinguish work at Innova Architects from projects commissioned directly by Domiorum. Add verified qualifications, genuine press or consented client feedback only when supplied. Numerical claims and testimonial portraits are unnecessary substitutes for that evidence.

### 5. Make the enquiry usable without a mouse

The [contact page](https://shiboribd.com/contact) exposes name, email, phone and message fields, plus project-type and area buttons. In the inspected DOM, the visible fields lacked associated HTML labels and accessible labels; displayed required asterisks were not accompanied by native required attributes. Selection buttons lacked an exposed pressed state. A hero action also diverts to the portfolio. These are interface observations, not a conclusion about whether its backend works.

Domiorum already has associated labels, native validation and an honest email-draft flow. Add optional area and preferred timing fields so visitors can prepare a more useful brief. Preserve the explicit review-and-send step and clipboard failure fallback. A future direct submission service needs delivery verification and an appropriate privacy update before replacing this flow.

### 6. Keep editorial content specific and maintainable

The inspected [blog listing](https://shiboribd.com/blogs) shows nine entries with the same displayed date and author. Some headings and descriptions drift towards generic business advice. Article detail pages were outside this review, so their quality and functionality are not assessed.

Domiorum should publish fewer, useful articles only when there is real expertise to share: planning storage, reading an apartment layout, preparing a renovation brief, or understanding design stages. Give each an identifiable author, real date, practical examples and relevant imagery. Do not add a journal merely to fill navigation.

## Comparative priorities

| Priority | Domiorum action | How to verify it |
| --- | --- | --- |
| First | Replace the sparse home project card with a residence feature containing related views and facts | The feature fits phone and desktop; its links open the correct credited project |
| First | Add homeowner questions about preparation, existing apartments, fees/timing, scope and image type | Questions open with keyboard and touch; answers contain no invented promises |
| First | Make service suitability and scope explicit | Each service explains a real situation and the work to be agreed |
| First | Capture optional area and timing in the enquiry | Values survive into the reviewable draft and encoded email link |
| Next | Gather completed photographs, plans and consented feedback | Record source, role, date and permission alongside each item |
| Next | Add more genuinely distinct case studies as they become available | Each has its own brief, role, factual details and consistent image credit |
| Before launch | Confirm domain, indexing, metadata sharing images and form delivery choices | Check the deployed domain and actual delivery path; remove preview-only indexing restrictions only when launch is authorised |
| After launch | Measure enquiry quality and friction | Track meaningful project enquiries and form completion, then adjust based on evidence |

## Asset strategy

Use the supplied interior renderings for the hero and project presentation. Keep original source records and export suitable WebP sizes through the existing local image workflow. Preserve the removal of exterior/building pictures and the rejected living-room view.

Unsplash can support an explicitly editorial or mood-reference section if needed, but it should not represent Domiorum's commissioned work, a client home or a before/after result. If used later, select a coherent small set, retain source URLs and photographer information, check the applicable licence, and label the editorial context. No new stock images were needed for this implementation.

## Implemented response

The homepage now has a dedicated Selim Residence feature, two linked detail views, a short explanation of design decisions and a visible apartment-area fact. Existing project credits remain immediately below it. The room links land at the project gallery.

The services page now explains suitability and agreed scope for each of the four existing services. Both homepage and services include five practical native disclosure questions. The enquiry and consultation forms include optional area and timing fields and carry them into the email draft. Existing page slugs, primary navigation, brand, approved motion and custom cursor artwork remain in place.

Design direction: preservation and refinement of the established custom design, with variance 8, motion 6 and density 3. New project content uses clear image/copy hierarchy; FAQs stay still for reading. The three principal safeguards are truthful project attribution, specific working destinations, and tested mobile/keyboard behaviour. These improvements establish a stronger foundation; they do not prove a higher conversion rate without live measurement.

## Verification

ESLint, TypeScript and the Next.js production build pass. The full browser suite reports 39 passed and 15 intentionally skipped profile-specific checks. It covers all existing routes, loaded images, overflow, runtime errors, cursor behaviour, mobile navigation, motion preferences, the exploded house, enquiry validation and portfolio navigation. The new checks cover native disclosure keyboard operation and room links landing at the credited gallery. Area and timing are verified in the encoded enquiry draft. Desktop and narrow-phone layouts were also inspected visually; the existing automated homepage accessibility check found no violations in its tested state.

The preview remains a development site. These checks do not establish production email delivery or real-world Core Web Vitals. The root metadata still disables search indexing for this preview; launch readiness remains a separate deployment decision.
