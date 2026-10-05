# TAKAVEN INVITATIONS — PHASE 0 RECOMMENDATION

Audit date: 2026-10-05

## Audit basis

The accessible repositories were cloned at shallow depth and inspected through
their route trees, source files, schemas, manifests, and README claims. The
audited snapshots were:

| Repository | Snapshot inspected | Result |
|---|---|---|
| [utopusc/invitation-builder](https://github.com/utopusc/invitation-builder) | `4ba571fc131212c20e1ea0d66a939360ed55e60f` | Accessible; full source audit |
| [Mohitscodiclab/ZYPHORA](https://github.com/Mohitscodiclab/ZYPHORA) | `c2dc1c4130039ea6a7c952414028f635fa8ca2d1` | Accessible; full source audit |
| [Relaxkartikey/prior-gsap-animation-portfolio-website-template](https://github.com/Relaxkartikey/prior-gsap-animation-portfolio-website-template) | `8b2092b89cd87922bca3a9556f8fb258b48c393f` | Accessible; full source audit |
| [Olawill/Ceremonia](https://github.com/Olawill/Ceremonia) | Not available anonymously; GitHub returned 404 to clone/API | README/indexed metadata only; no code reuse decision |
| [norafrank-official/Invitation-Generator](https://github.com/norafrank-official/Invitation-Generator) | `b586c8d4d16b2747c6d7625ce8c004cfb08d5cfd` | Accessible; full source audit |
| [criix23/Wedding-Website-Template](https://github.com/criix23/Wedding-Website-Template) | `75f11fe9ae48c1c57c5c146760811acd0869f6a7` | Accessible; full source audit |

The Ceremonia README remains useful as architectural evidence: it describes an
`EventEngine`, vocabulary system, CSS-variable themes, a split editor/iframe
preview, and a section registry. It was not treated as a source-code audit
because the repository was not retrievable with the available access.

## 1. VERDICT

**PROCEED WITH MODIFICATION.**

TAKAVEN should proceed, but it should adopt and simplify an existing invitation
platform rather than start a new application. The strongest base is
`utopusc/invitation-builder`, subject to two gates before direct reuse:

1. obtain a real upstream license file or written permission; its README says
   MIT, but the inspected clone has no `LICENSE` file and GitHub reports no
   declared license;
2. put a thin generic engine boundary in front of its current event-specific
   pages before adding cinematic themes.

The first implementation should remain a single product, a single deployment,
and a single data model. It should not become a subscription SaaS platform in
Phase 1.

## 2. RECOMMENDED BASE

### Primary base: `utopusc/invitation-builder`

This is the only candidate that already combines most of TAKAVEN's operational
needs in one Next.js application:

- Next.js App Router, React, TypeScript, Tailwind, Radix/shadcn-style UI;
- Supabase Auth and PostgreSQL schema with RLS;
- dashboard, create/edit flow, invitation list, response view, and settings;
- `/i/[slug]` public invitation route with metadata;
- event categories for wedding, birthday, graduation, baby shower, engagement,
  anniversary, corporate, party, religious, and other;
- theme tokens, color/font controls, animation selection, media URLs, host
  arrays, custom JSON fields, countdown, RSVP, view counting, and email hooks;
- a live preview that renders the real invitation page components;
- existing entry animations and separate event-specific invitation components.

This is a strong operational foundation, not yet a strong cinematic engine. Its
current renderer is a switch over several large, duplicated page components.
That is the first boundary to improve; it is not a reason to discard the base.

### What should not be the base

- **ZYPHORA:** excellent zero-backend prototype and export/share experiment,
  but the single `index.html` stores state in the URL, has no persisted RSVP or
  owner workflow, and cannot be the production data foundation.
- **PRIOR:** strong animation laboratory, but it is a vanilla portfolio template
  with approximately 140 MB of committed frame/video assets and no event model,
  editor, RSVP, or persistence.
- **Ceremonia:** conceptually closest to a mature engine, but inaccessible for
  code audit and explicitly includes billing, plan gates, multi-tenancy, Blob,
  analytics, registry, guestbook, and marketplace complexity that TAKAVEN does
  not need on Day 1.
- **Invitation-Generator:** useful internal guest workflow, but its Flask app
  exposes the admin routes without authentication and has no production-grade
  tenant boundary.
- **Wedding-Website-Template:** a good configured wedding experience and useful
  Three.js/Mapbox/Framer Motion references, but it is a single wedding site, not
  an invitation engine.

## 3. SOURCE REUSE MATRIX

| Capability | Source repo | Reuse method | Modification required | Licence consideration | Confidence |
|---|---|---|---|---|---|
| Event model | `invitation-builder` | Adapt directly | Preserve the core event fields; replace broad `custom_fields` usage with a typed `EventConfig` boundary and a generic event-category vocabulary | README claims MIT; no license file found, so direct copy waits for confirmation | High |
| Invitation renderer | `invitation-builder` | Adapt existing components | Keep proven sections and RSVP flow, but route through `EventEngine`/section registry rather than a growing page switch | Same license gate; keep attribution if MIT is confirmed | High |
| Editor | `invitation-builder` | Reuse for internal production | Hide unnecessary SaaS-style options; keep the form, live preview, save/publish, and draft model | Same license gate | High |
| Live preview | `invitation-builder` | Reuse and simplify | Preserve the real-component preview; make the preview accept the generic event config and opening-experience id | Same license gate | High |
| RSVP | `invitation-builder` | Adapt directly | Add server-side validation, published/show-RSVP checks, rate limiting or abuse protection, duplicate policy, and correct timezone/deadline handling | Same license gate; Resend remains a separate service dependency | High |
| Countdown | `invitation-builder`; `Wedding-Website-Template` | Reuse/adapt | Use one timezone-aware implementation; the wedding template is a reference for visual treatment, not the data source | Wedding repo claims MIT but has no license file; do not copy assets | High |
| Public URLs | `invitation-builder` | Reuse `/i/[slug]` | Keep the route; harden slug generation/uniqueness and add stable metadata/OG handling | Same license gate | High |
| Mobile architecture | `invitation-builder`; `Wedding-Website-Template`; PRIOR | Adapt patterns | Mobile-first invitation shell, touch-safe controls, lazy media, reduced-motion path, and mobile-specific cinematic asset tier | PRIOR license is unverified; use patterns until confirmed | High |
| Theme engine | `invitation-builder` | Adapt | Replace `theme_style` as the primary abstraction with typed theme tokens plus section/opening configuration; keep color/font controls | Same license gate | High |
| Theme vocabulary | Ceremonia README; `invitation-builder` | Reference/transplant pattern | Create a small vocabulary map for event categories; do not copy the inaccessible Ceremonia code | Ceremonia license cannot be verified | Medium |
| Animation primitives | `invitation-builder` | Reuse Framer Motion primitives | Keep existing section motion and simple reveals; avoid introducing GSAP globally | Same license gate; Framer Motion is a separate dependency | High |
| Cinematic opening | PRIOR | Transplant as isolated adapter | Extract frame manifest, responsive desktop/mobile folders, canvas renderer, preloader, idle loading, eviction window, and reduced-motion fallback into an `OpeningExperience` contract | README/JSON-LD claim MIT but no `LICENSE` file; frame/video asset rights are separate and unverified | High for pattern, low for direct code until licensed |
| Simple opening overlays | `invitation-builder` | Reuse/adapt | Keep envelope/curtain/confetti/cap/gift as low-cost fallback experiences and test fixtures | Same license gate; included media must be checked | High |
| Guest handling | Invitation-Generator | Reference and possibly transplant after permission | Map guest records to a future `InvitationRecipient` table only if personalised links are required; not needed for first public RSVP | No license found; no direct reuse without permission | Medium |
| Personalised URLs | Invitation-Generator | Reference | Token/link pattern is useful for WhatsApp guest targeting; separate from the public invitation slug | No license found; security review required | Medium |
| QR generation | ZYPHORA; Invitation-Generator | Adapt library pattern | Add QR only as a sharing utility; do not make QR the persistence mechanism | ZYPHORA says MIT but has no license file; Invitation-Generator has no license | Medium |
| Sharing | `invitation-builder`; ZYPHORA | Reuse/adapt | Keep persisted public URL as the source of truth; add copy/share/WhatsApp helpers later | License gates apply; do not copy ZYPHORA's branded output | High |
| Standalone export | ZYPHORA | Reference only | Defer until demand exists; exported ZIP cannot carry the full RSVP/published data model without a separate runtime | Same unverified MIT issue; exported third-party CDN/media rights need review | Medium |
| Maps/directions | `invitation-builder`; `Wedding-Website-Template` | Reuse simple map link first; reference Mapbox component | Start with venue address + external directions URL; defer Mapbox/3D map dependency until it earns its cost | Wedding sample map/assets are not reusable by default | High |
| Audio/music | `invitation-builder`; Ceremonia README | Adapt optional capability | Add audio only after user gesture, with mute control, preload budget, and no blocking dependency | Media rights and provider terms must be checked per asset | Medium |
| i18n | `Wedding-Website-Template`; Ceremonia README | Reference | Keep content data-language-neutral; introduce a small translation layer only when TAKAVEN has a real language requirement | Code license and font/media rights remain separate | Medium |
| Analytics | `invitation-builder`; Ceremonia README | Do not reuse initially | Keep only operational view count if needed; no PostHog/advanced analytics in Phase 1 | Avoid inheriting data/privacy burden | High |
| Billing/subscriptions | Ceremonia | Do not reuse | Explicitly exclude Stripe, plan gates, pricing tiers, white-label, and custom domains from Phase 1 | Avoid inheriting SaaS licensing and operational complexity | High |

## 4. TARGET ARCHITECTURE

### Runtime shape

Use one Next.js application with Supabase-backed event data:

```text
Published URL /i/[slug]
        |
        v
      EventEngine
        |
        +--> OpeningExperience (optional, swappable by id)
        |       |
        |       +--> preload / skip / reduced-motion fallback
        |       +--> onComplete()
        |
        +--> Transition (theme/experience-owned)
        |
        +--> InvitationShell
                |
                +--> Hero / event identity
                +--> Event details / venue / directions
                +--> Countdown
                +--> optional sections
                +--> RSVP
                +--> share/contact actions
```

### Domain contracts

The first real refactor should establish these conceptual contracts. They may
be implemented as TypeScript types and registries; they do not require a new
service or microservice.

```text
EventConfig
  category: birthday | wedding | engagement | ... | other
  hosts / celebrant
  title, subtitle, message
  dateTime + timezone
  venue + map/directions URL
  sections[]
  rsvp config
  media refs
  themeId
  openingExperienceId

ThemeDefinition
  id
  color/font/motion tokens
  section defaults/order
  openingExperienceId
  transitionId

OpeningExperience
  id
  preload(config, device)
  render(config, callbacks)
  skip / fallback behavior
  reduced-motion behavior
```

The existing base's `custom_fields` JSONB can remain as a migration bridge, but
new code should not spread untyped field names throughout page components.
`EventConfig` should be the only object passed into the renderer and editor.

### Storage and deployment

- Keep Supabase Auth/Postgres/RLS from `invitation-builder` for the first base.
- Keep public invitation media as URLs or a small static asset bundle during
  engineering validation. Add object storage only when customer media volume
  makes it necessary.
- Use the existing `/i/[slug]` route and one app deployment.
- Use external map/directions URLs before adding Mapbox.
- Use an internal operator workflow first; the editor should remain capable of
  becoming customer-facing later, but no billing, roles, or marketplace work is
  justified now.

### Theme/opening separation

A theme is not merely a color palette. It owns a visual vocabulary and chooses
an opening experience, but the event data and standard sections remain reusable.

```text
football theme
  -> football opening experience
  -> impact transition
  -> generic invitation shell with football tokens/sections

romantic theme
  -> envelope/curtain opening
  -> soft reveal
  -> same shell with romantic tokens/sections
```

This is the key architectural protection against building six unrelated
invitation websites.

## 5. WHAT WE WILL NOT BUILD

The following are intentionally excluded from Phase 0/Phase 1:

- subscription billing, pricing tiers, plan gates, and marketplace;
- CRM, marketing automation, social integrations, or Instagram APIs;
- customer mobile applications;
- microservices or a second backend;
- advanced analytics, PostHog, or event funnels;
- custom photo/gallery infrastructure beyond simple media references;
- proprietary media hosting before demand exists;
- a general-purpose animation editor;
- multiple polished themes before one generic base and one proof theme work;
- standalone export as a core workflow;
- Mapbox/Three.js maps unless a real invitation requires them;
- guest-specific links in the first football proof unless TAKAVEN needs them
  operationally; the initial RSVP can be invitation-level.

Existing source functionality is not automatically a requirement. We reuse only
what supports TAKAVEN's operating model.

## 6. NEW CODE REQUIRED

Only the following is genuinely TAKAVEN-specific:

1. a generic `EventConfig` and event-category vocabulary boundary;
2. a theme registry whose entries can choose an opening and transition;
3. the `EventEngine` lifecycle contract;
4. an opening-experience adapter interface and one football proof adapter;
5. transition/reveal coordination between opening and invitation shell;
6. football-specific content mapping such as name/age reveal copy;
7. hardened validation and timezone-aware event/RSVP behavior;
8. media/performance fallbacks for small mobile devices and reduced motion;
9. TAKAVEN-specific operator defaults, documentation, and acceptance tests.

Everything else should first be mapped to an inspected source implementation.

## 7. LICENSING ASSESSMENT

| Repository | Observed status | Reuse posture |
|---|---|---|
| `invitation-builder` | README says MIT; inspected clone has no `LICENSE`; GitHub API metadata reports no declared license | Strongest technical base, but no direct copy until upstream adds/ confirms MIT or grants written permission. If confirmed, preserve copyright notice and license text. |
| `ZYPHORA` | README says MIT and includes a license section; inspected clone has no `LICENSE`; GitHub metadata reports no declared license | Good prototype/reference. Direct reuse waits for a verifiable license file or permission. Preserve attribution if MIT is confirmed. |
| PRIOR | README says free/open-source; JSON-LD states MIT; inspected clone has no `LICENSE`; GitHub metadata reports no declared license | Use as animation reference first. Do not copy frame assets, remote videos, or code into a commercial product until license and asset rights are separately verified. |
| Ceremonia | Repository could not be fetched or inspected anonymously; license not verifiable | Reference only until the owner supplies access and a license. |
| Invitation-Generator | No license file or clear license statement found in the inspected repository | Reference only. Written permission is required for code reuse. |
| Wedding-Website-Template | README says MIT; inspected clone has no `LICENSE`; GitHub metadata reports no declared license | Reference/adapt only after license confirmation. Fonts include OFL text, but sample Freepik images are separately restricted and must not be copied into TAKAVEN. |

Third-party dependencies and media have their own terms. A repository-level MIT
claim would not grant rights to its sample images, remote video URLs, fonts with
different licenses, or paid APIs.

## 8. RISKS / DEAD ENDS

### Highest-risk items

1. **License ambiguity.** The strongest candidates describe themselves as MIT or
   open source but do not carry a license file in the inspected snapshot. This
   is a release blocker for direct transplantation.
2. **Renderer duplication in the base.** `invitation-builder` has separate large
   birthday, wedding, graduation, baby-shower, corporate, and fallback pages.
   Adding football as another page would recreate the architectural problem.
3. **Untyped custom fields.** The base stores age, couple names, timeline,
   opening choice, and other fields in JSONB. Without a typed boundary this will
   become a fragile cross-theme contract.
4. **RSVP hardening.** The current server action inserts form values with little
   validation and does not itself enforce every public invitation/RSVP toggle.
   Rate limiting, payload limits, deadline/timezone rules, and abuse handling are
   required before production.
5. **Cinematic payload size.** PRIOR's frame approach is technically useful,
   but the inspected repository contains roughly 140 MB of frames/video assets.
   Mobile delivery needs an asset budget, mobile frame tier, idle loading, and a
   skip/fallback path.
6. **Autoplay/audio assumptions.** Mobile browsers will not reliably autoplay
   sound. Audio must be optional, muted by default, and started by a user gesture.
7. **Date/time semantics.** Date and time fields must be paired with an event
   timezone. A browser-local countdown is not sufficient for an international
   product.
8. **Security leakage from internal tools.** Invitation-Generator has no visible
   admin authentication/CSRF boundary and uses a development secret by default;
   it cannot be exposed as a production admin surface.
9. **External map and media dependency.** The wedding template hardcodes a
   specific location and expects Mapbox; it is not a generic location module.
10. **Overbuilding from Ceremonia.** Clerk, Stripe, Neon, Blob, PostHog,
    multi-tenancy, plan gates, registry, guestbook, and custom domains would
    consume the schedule without proving the core product.

### Architectural drift guard

These rules remain active:

1. Reuse before rebuild.
2. Do not turn TAKAVEN into a generic SaaS project.
3. Keep event categories generic; do not design around birthdays only.
4. Validate one base and one proof theme before adding more themes.
5. Football is the first proof theme, not a special-case architecture.
6. Mobile/WhatsApp usability outranks desktop spectacle.
7. Visual quality is a core acceptance requirement.
8. Keep customer production simple.
9. Do not inherit features merely because a source repo contains them.
10. Do not rewrite a working reused component without a product or risk reason.

## 9. IMPLEMENTATION PLAN

This is the ordered plan after owner approval. It is not being executed in Phase
0.

### Phase 1 — License and base preparation

- confirm licenses/permissions for each copied source file;
- create the repository under the approved TAKAVEN owner;
- record upstream commit IDs and attribution in a source register;
- fork/adapt `invitation-builder` into a clean TAKAVEN branch;
- remove sample branding and unsafe/demo defaults;
- preserve the existing working public route and RSVP path while adding tests.

Deliverable: runnable base with provenance recorded and no cinematic feature yet.

### Phase 2 — Generic engine boundary

- define `EventConfig`, `ThemeDefinition`, `OpeningExperience`, and section
  contracts;
- map the current invitation fields into the typed config;
- route all event categories through a generic engine/section registry;
- keep existing renderer components as adapters during migration;
- keep the internal editor and real-component preview working.

Deliverable: one renderer contract that can select an opening experience without
duplicating the invitation shell.

### Phase 3 — Base invitation acceptance

- validate event details, venue/directions, countdown, and RSVP on a phone;
- harden server validation, RLS assumptions, deadline handling, and form abuse;
- verify public slug, metadata, share/copy link, and owner response view;
- add reduced-motion, no-audio, no-map, and media-failure fallbacks.

Deliverable: a strong ordinary invitation engine before cinematic work.

### Phase 4 — Cinematic adapter

- transplant only the needed PRIOR frame/canvas/preloader patterns;
- define a small asset manifest with desktop/mobile tiers;
- add a skip control and reduced-motion path;
- make the opening emit a single completion event into the engine;
- use placeholder frames/video first, not photorealistic AI assets.

Deliverable: a reusable opening slot that does not know how RSVP or sections are
implemented.

### Phase 5 — Football proof theme

- add the football theme token set and opening experience;
- sequence stadium atmosphere → player/ball approach → kick → ball-to-camera
  impact → transition;
- reveal dynamic `[NAME] TURNS [AGE]` from event data;
- render the standard event details, countdown, venue/directions, RSVP, and
  contact/share actions;
- test phone-first and WhatsApp-open behavior.

Deliverable: one coherent football invitation from URL open through RSVP.

### Phase 6 — Evidence-based expansion

Only after the football gate passes:

- add a second opening with the same contract;
- decide whether personalised guest links are commercially necessary;
- add media upload/storage only when operator volume justifies it;
- add additional event categories/themes as configuration plus reusable sections.

## 10. TIME ASSESSMENT

These are planning ranges, not promises:

| Work | Estimate |
|---|---:|
| Confirm owner access, licenses, and repository bootstrap | 1–4 hours once access is available |
| Source audit and reuse decision | Completed in this Phase 0; roughly 1 working day of equivalent effort |
| Base fork/adaptation and environment cleanup | 0.5–1.5 days |
| Generic engine boundary and renderer migration | 1–3 days |
| RSVP/timezone/mobile hardening | 0.5–1.5 days |
| Cinematic adapter with placeholder assets | 1–2 days |
| Football vertical slice | 1–3 days after the adapter, depending on asset quality |
| Device/accessibility/performance acceptance pass | 0.5–1 day |

The first strong working base should therefore be achievable in several focused
days, not months, if the reuse and license gates are respected. Custom cinematic
asset production is a separate creative schedule and should not be confused
with engineering reuse.

## 11. FIRST FOOTBALL PROOF

The proof must exercise the generic engine, not a football-only page:

1. Create one event record with category `birthday` or `party`, theme id
   `football`, celebrant name, age, event date/time/timezone, venue, and RSVP
   enabled.
2. Open `/i/[slug]` on a current mobile browser.
3. The selected opening adapter preloads a small mobile asset tier and shows a
   visible skip/reduced-motion option.
4. The stadium/player/ball sequence completes or is skipped.
5. The transition emits `onComplete()` and the generic invitation shell becomes
   visible without a route reload.
6. The reveal reads the celebrant name and age from `EventConfig` and displays
   `[NAME] TURNS [AGE]`.
7. The same shell renders date/time, countdown, venue, directions, optional
   contact/share actions, and RSVP.
8. Submitting RSVP stores one valid response and shows the success state; the
   operator can see it in the existing response workflow.
9. Reloading the public URL reproduces the experience; a slow network, missing
   media, reduced-motion preference, and no-audio browser still reach the
   invitation.
10. A second theme/opening can be selected by configuration without changing
    the football invitation shell or RSVP code.

This proves the product thesis: cinematic opening → transition → dynamic
invitation → mobile → RSVP.

## 12. REPOSITORY STATUS

- Remote GitHub repository `takaven/takaven-invitations` was created.
- It is currently public to support independent parallel review, with the
  owner's stated intention to make it private after execution is complete.
- Only the approved documentation-only bootstrap is being published in Phase 0.
- No product implementation was started.
- The local documentation-only bootstrap is staged at:
  `outputs/takaven-invitations-bootstrap/`

The local bootstrap contains only the minimum Phase 0 README and recommendation
document. It has no application code, dependencies, secrets, or deployment
configuration.

## 13. DECISIONS REQUIRED FROM OWNER

Only these items block the next phase:

1. Confirm whether TAKAVEN may directly reuse `invitation-builder` and the other
   candidates, or obtain upstream license files/written permission where the
   repositories currently make an unverified MIT/open-source claim.
3. Approve `invitation-builder` as the base with a controlled generic-engine
   refactor.
4. Confirm whether the first RSVP is invitation-level or must be personalised
   per guest from day one.

No owner decision is required to keep the scope small, defer billing, or use
placeholder cinematic assets; those are already constrained by this plan.

## 14. FINAL RECOMMENDATION

TAKAVEN should begin implementation **after** the repository-owner and licensing
gates are resolved.

The recommended foundation is:

```text
invitation-builder operational base
  + typed TAKAVEN EventEngine boundary
  + PRIOR-inspired isolated cinematic adapter
  + one generic football theme as proof
  + no billing, CRM, social APIs, or unnecessary infrastructure
```

This preserves the days-not-months objective while protecting TAKAVEN from the
two most likely failures: rebuilding solved invitation plumbing and coupling
the future theme system to one hardcoded birthday/wedding page.
