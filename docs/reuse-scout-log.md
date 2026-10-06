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

## Phase 2 targeted football/cinematic checkpoint — 2026-10-06

The required targeted search was completed before replacing the placeholder opening.
The conclusion is to transplant mechanisms, not third-party game code or sample media.

| Repository | Relevant component / pattern | Technology | Recommendation | Integration cost | Performance / licensing risk | Decision |
|---|---|---|---|---|---|---|
| [`tahsinmert/emirates-sport-club`](https://github.com/tahsinmert/emirates-sport-club) | Video-centric football hero, preloader, page transition, mobile simplification | SvelteKit, GSAP, muted video | REFERENCE / ADAPT | Medium | MIT; video payload and Svelte components do not transplant cleanly | Use the pacing, preloader and mobile fallback principles. Do not import the Svelte/video stack. |
| [`TidyFactor/Cinematic`](https://github.com/TidyFactor/Cinematic) | Canvas frame-sequence lifecycle, bounded preload, missing-asset and reduced-motion fallbacks | Canvas, numbered JPG sequence, GSAP guidance | REFERENCE / PATTERN | Low for lifecycle; high for media production | MIT; frame payload can become very large; source explicitly warns against video scrubbing | Keep the lifecycle and fallback ideas. Do not copy the repo's media or commit to frame sequences before real Football assets are tested. |
| [`unknown11-svg/Soccer_ThreeJS`](https://github.com/unknown11-svg/Soccer_ThreeJS) | Procedural football scene with player, ball, camera and stadium | Three.js | REFERENCE | High | License file exists, but a full game/3D scene is far beyond the invitation need | Do not transplant the game. The procedural scene concept supports a lightweight canvas proof instead. |
| [`acherm/fifacher`](https://github.com/acherm/fifacher) | Procedural pitch, stadium, player, ball and camera systems | Three.js, procedural geometry | REFERENCE | High | Game loop, controls and audio would add unnecessary product surface | Ignore as an implementation dependency; borrow only the idea of procedural, asset-light football visuals. |
| [`kendrekaran/striker-3d`](https://github.com/kendrekaran/striker-3d) | Procedural football/stadium with optional GLB player and graceful player fallback | Three.js, GLB, Web Audio | REFERENCE | High | External character asset has separate provenance; 3D runtime cost is material on phones | Do not import. Its fallback discipline reinforces the non-blocking opening requirement. |
| [`shnwz3/TravelScroll-Animation`](https://github.com/shnwz3/TravelScroll-Animation) | Canvas image-sequence scrubbing and spatial typography | Next.js, GSAP, Framer Motion, Canvas | REFERENCE / PATTERN | Medium | Sequence payload and scroll coupling are unnecessary for a timed opening | Keep as an option for a future asset-backed master; not used in this slice. |
| [`Remilya/scroll-hero`](https://github.com/Remilya/scroll-hero) | Canvas frame scrub, poster fallback, Save-Data/reduced-motion handling and teardown | Canvas, vanilla JS | REFERENCE / PATTERN | Low for lifecycle; medium for a future frame-backed master | MIT; still requires a real media budget and authored frames | Scout found it after the first search. Keep as the strongest future frame-sequence reference; do not add it to the current timed opening. |
| [`m1ckc3s/ripple`](https://github.com/m1ckc3s/ripple) | Shader-based ripple/displacement impact transition | React, WebGL fragment shader | REFERENCE / OPTIONAL | Medium to high | Licence not surfaced in the scout result; WebGL adds mobile failure surface | Consider only after the procedural impact is judged insufficient. Not imported in Phase 2. |
| [`Akash-AIML/stadium-os-fifa2026`](https://github.com/Akash-AIML/stadium-os-fifa2026) | Floating stadium/football hero, particles and shader grass | React, Three.js/WebGL | REFERENCE | High | Licence not surfaced; unnecessary runtime weight | Reference only. Full 3D was deliberately rejected for this slice. |

### Phase 2 decision

For the first premium proof, TAKAVEN will use a new, procedural Canvas 2D opening
inside the existing `OpeningExperience` boundary. This is the smallest mechanism
that can show stadium atmosphere, player approach, kick, ball-to-camera and impact
without importing a game engine or a large third-party media payload. The visual
language is original TAKAVEN code; no third-party code, footage, frames, models,
audio or sample assets are copied.

## Phase 2.1 commercial visual mechanism round — 2026-10-06

The second targeted search compared asset-backed sports hero patterns before
implementation. The decision was based on mechanism reuse, not on copying a
third-party visual identity or media.

| Mechanism / reference | Evidence found | Recommendation | Phase 2.1 decision |
|---|---|---|---|
| Authored short video | [`rairamalho/hero-text-gsap-ramalho`](https://github.com/rairamalho/hero-text-gsap-ramalho) demonstrates a configurable image/video hero with overlay and lazy-loaded media. | ADAPT PATTERN | Keep as a future option; no production video is available yet and autoplay/video transfer would add an unnecessary first dependency. |
| Image/frame sequence | [`Remilya/scroll-hero`](https://github.com/Remilya/scroll-hero) and [`TidyFactor/Cinematic`](https://github.com/TidyFactor/Cinematic) provide canvas lifecycle, poster fallback, and reduced-motion patterns. | REUSE LIFECYCLE / REFERENCE MEDIA | Keep the loading/fallback discipline; do not import a frame sequence until authored frames justify the payload. |
| AI-generated cinematic clip | No directly reusable, licence-clear GitHub implementation was found that materially reduces TAKAVEN production time. | IGNORE FOR THIS PASS | Avoid introducing a generation pipeline or customer-specific media dependency. |
| Layered 2D + existing motion stack | [`adrianhajdin/award-winning-website`](https://github.com/adrianhajdin/award-winning-website) demonstrates media handoffs and clip-path transitions; [`free-gsap-effects/parallax-hero`](https://github.com/jaydickinson/free-gsap-effects) documents layered timeline cleanup and reduced-motion behavior. | ADAPT PATTERN | SELECTED. Use compressed TAKAVEN-authored raster layers with CSS animation and the existing Framer Motion/runtime boundary; no GSAP dependency added. |
| Lightweight WebGL / Three.js | Football/game references such as [`midnight-kicks`](https://github.com/kuiralabs/midnight-kicks) show the fidelity ceiling of a full 3D scene. | REFERENCE ONLY | Rejected for this invitation master because runtime, character assets, and mobile failure surface are disproportionate. |

### Phase 2.1 decision

The selected mechanism is an asset-backed 2D master: a generated stadium
backdrop, isolated footballer and isolated ball, animated with a bounded CSS
timeline and the existing `OpeningExperience` completion contract. The assets are
new TAKAVEN project media, not copied from any repository. The total compressed
asset set is approximately 273 KB before transfer overhead, with no video,
WebGL runtime, audio or third-party model dependency.

## Phase 2.2 art-direction correction round — 2026-10-06

The required targeted search covered child character animation, football/soccer
sprites, matchday/broadcast UI, scoreboards and cinematic sports landing pages.
The result was to reuse patterns, not import a game or a stock media package.

| Repository | Relevant component / pattern | Recommendation | Decision |
|---|---|---|---|
| [`pixijs/pixijs-skills`](https://github.com/pixijs/pixijs-skills) | `AnimatedSprite` lifecycle for walk/run/explosion frame playback | REFERENCE | Useful if authored child frames arrive later; not imported for one opening scene. |
| [`JimboPicton/sprite-pose-agent`](https://github.com/JimboPicton/sprite-pose-agent) | Character reference to run-cycle/sprite-sheet workflow | REFERENCE | Production aid only; no runtime dependency or generated frames copied. |
| [`Code4Community/CodeStrikers`](https://github.com/Code4Community/CodeStrikers) | Browser football player/ball layering and movement concepts | REFERENCE | Game logic is unnecessary for TAKAVEN; no code or assets copied. |
| [`openfootmanager/openfootmanager`](https://github.com/openfootmanager/openfootmanager) | Matchday broadcast design language: navy, emerald, condensed hierarchy | REFERENCE / ADAPT | Adapted visual principles into TAKAVEN-owned CSS; no source code copied. |
| [`JosephMaynard/playoverlay`](https://github.com/JosephMaynard/playoverlay) | Broadcast score bug, match clock and scoreboard information hierarchy | REFERENCE | Confirmed the restrained broadcast hierarchy; desktop operator application is not relevant to the invitation runtime. |
| [`Zaker237/scoreboardsweb`](https://github.com/Zaker237/scoreboardsweb) | Responsive football fixture/scoreboard composition | REFERENCE | MIT surfaced in repository metadata; not transplanted because it solves a different data product. |
| [`TidyFactor/Cinematic`](https://github.com/TidyFactor/Cinematic) | Bounded frame loading, failure and reduced-motion fallback | REUSE LIFECYCLE / REFERENCE | Existing opening contract retains this discipline; authored child asset remains TAKAVEN-owned. |

### Phase 2.2 decision

No search result provided a licence-clear, drop-in child footballer or a
commercially suitable kick-to-camera sequence. The selected approach is a
TAKAVEN-owned transparent child runner asset, dynamically overlaid with the
event age as the jersey number, and animated through the existing CSS opening
timeline. The invitation body uses a new Football presentation adapter while
reusing the existing countdown and RSVP components. No third-party code, sample
media, character model or scoreboard implementation was copied.
