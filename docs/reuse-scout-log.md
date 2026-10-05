# TAKAVEN Reuse Scout Log

Checkpoint record for the required “has someone already solved this?” review.
Only discoveries that materially reduce work are recorded here.

| Repository | Relevant component / pattern | Recommendation | Integration cost | Risk | Decision |
|---|---|---|---|---|---|
| [`utopusc/invitation-builder`](https://github.com/utopusc/invitation-builder) | Public `/i/[slug]`, Supabase invitations/RLS, editor, preview, countdown, RSVP | REUSE / ADAPT | Low to medium | Unverified licence; renderer duplication | Approved operational base; preserve first, adapt behind engine. |
| [`Relaxkartikey/prior-gsap-animation-portfolio-website-template`](https://github.com/Relaxkartikey/prior-gsap-animation-portfolio-website-template) | Frame/canvas loading, responsive tiers, preload and fallback thinking | REFERENCE / PATTERN | Medium | Large payload and unverified media/code rights | Use lifecycle ideas only in Phase 1; original bounded placeholder assets. |
| [`Mohitscodiclab/ZYPHORA`](https://github.com/Mohitscodiclab/ZYPHORA) | No-backend builder, URL share, QR/export | REFERENCE | High if transplanted | No persisted RSVP/owner workflow; licence unclear | Do not use as operational base. |
| [`norafrank-official/Invitation-Generator`](https://github.com/norafrank-official/Invitation-Generator) | Guest tokens, RSVP management, QR | REFERENCE | Medium | Flask/SQLite/admin security and licence | Defer personalised guest workflow. |
| [`criix23/Wedding-Website-Template`](https://github.com/criix23/Wedding-Website-Template) | Mobile visual polish, countdown, map treatment | PATTERN | Medium | Wedding-specific assets and Mapbox assumptions | No code/assets copied in Phase 1. |
| [`Olawill/Ceremonia`](https://github.com/Olawill/Ceremonia) | EventEngine, section registry, theme vocabulary from README | REFERENCE | High | Source inaccessible; SaaS scope too broad | Keep only the architectural pattern in Phase 0 docs. |

## Phase 1 reuse checkpoints

- RSVP: existing `submitRSVP` action and invitation RSVP form retained.
- Countdown: existing invitation page countdown retained.
- Public route: existing `/i/[slug]` retained.
- Preview/editor: existing invitation-builder editor and preview retained.
- Theme selection: new registry is a thin boundary over existing fields, not a
  replacement renderer.
- Animation loading: new opening is bounded and independent; PRIOR is pattern
  reference only.
- Mobile media: original SVG placeholder plus skip/reduced-motion behavior;
  no third-party media copied.
