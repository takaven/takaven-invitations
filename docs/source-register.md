# TAKAVEN Source Register

This register records material reuse and provenance for the Phase 1 prototype.
It is an engineering record, not a commercial licensing clearance. Direct
distribution remains blocked until each reused source has a verified licence or
written permission.

| Source | Upstream commit | Relevant material | TAKAVEN destination | Mode | Changes / asset posture | Licence status |
|---|---|---|---|---|---|---|
| [`utopusc/invitation-builder`](https://github.com/utopusc/invitation-builder) | `4ba571fc131212c20e1ea0d66a939360ed55e60f` | Next.js app, Supabase data model, dashboard/editor, public route, invitation renderers, RSVP | Application root; `src/app/i/[slug]`, `src/components/invitation`, `src/lib`, `src/types`, `supabase` | ADAPTED | Imported as the operational base. Existing renderer and RSVP remain in place behind the TAKAVEN engine boundary. No third-party sample media was added beyond the upstream base during this prototype step. | README claims MIT; no `LICENSE` file was present in the audited snapshot. Verify before release. |
| [`prior-gsap-animation-portfolio-website-template`](https://github.com/Relaxkartikey/prior-gsap-animation-portfolio-website-template) | `8b2092b89cd87922bca3a9556f8fb258b48c393f` | Canvas/frame-sequence, preloader, mobile tier, skip/fallback mechanics | `src/components/invitation/football-opening.tsx` contract and bounded placeholder implementation | PATTERN | No PRIOR code, frames, video, or remote media copied. The Phase 1 opening is a small CSS/SVG placeholder with the same lifecycle goals. | README/JSON-LD claims MIT; no `LICENSE` file and media rights unverified. |
| [`Mohitscodiclab/ZYPHORA`](https://github.com/Mohitscodiclab/ZYPHORA) | `c2dc1c4130039ea6a7c952414028f635fa8ca2d1` | URL-state builder, share/export ideas | None in Phase 1 | REFERENCE | No code or branded output reused. | README claims MIT; no `LICENSE` file in audited snapshot. |
| [`norafrank-official/Invitation-Generator`](https://github.com/norafrank-official/Invitation-Generator) | `b586c8d4d16b2747c6d7625ce8c004cfb08d5cfd` | Guest token/RSVP workflow | None in Phase 1 | REFERENCE | Personalised guest links deliberately deferred. | No clear licence found; no direct reuse. |
| [`criix23/Wedding-Website-Template`](https://github.com/criix23/Wedding-Website-Template) | `75f11fe9ae48c1c57c5c146760811acd0869f6a6` | Mobile visual treatment, countdown/map references | None in Phase 1 | PATTERN | No wedding sample assets or Mapbox implementation copied. | README claims MIT; no `LICENSE` file in audited snapshot. Sample media has separate rights. |
| [`Olawill/Ceremonia`](https://github.com/Olawill/Ceremonia) | Not accessible anonymously during Phase 0 | EventEngine vocabulary and section-registry ideas from README/indexed metadata | `docs/phase-0-recommendation.md` only | PATTERN | No source code copied; SaaS complexity intentionally excluded. | Not verifiable. |

## Phase 1 TAKAVEN additions

- `src/lib/engine/contracts.ts` — minimal `EventConfig`, `ThemeDefinition`,
  and `OpeningExperience` contracts.
- `src/lib/engine/event-config.ts` — maps the existing invitation row into the
  generic boundary while retaining `custom_fields` as a migration bridge.
- `src/lib/engine/theme-registry.ts` — selects the Football opening by config.
- `src/components/invitation/invitation-engine.tsx` — opening/reveal lifecycle
  around the existing invitation shell.
- `src/components/invitation/football-opening.tsx` — placeholder opening with
  skip, reduced-motion, and media-failure-safe behavior.
- `public/takaven/opening/football-placeholder.svg` — original TAKAVEN placeholder
  artwork created for engineering validation.

## Phase 2 TAKAVEN additions

- `src/components/invitation/football-opening.tsx` — original procedural Canvas
  2D opening. It uses no third-party code, media, model, audio, or frame assets.
  It adapts the lifecycle goals identified in the PRIOR, Cinematic, Emirates
  Sport Club, and scroll-hero references without copying their implementation.
- `src/components/invitation/football-theme-frame.tsx` — original Football
  matchday chrome around the existing invitation shell; no RSVP/countdown/data
  logic is duplicated.
- `src/lib/supabase/middleware.ts` — narrow local demo-mode bypass for `/i/*`
  routes, guarded by `TAKAVEN_DEMO_MODE=true`; production auth behavior is
  unchanged.

### Phase 2 reference-only discoveries

The targeted scout also reviewed `Remilya/scroll-hero` (MIT),
`m1ckc3s/ripple` (license not surfaced), and
`Akash-AIML/stadium-os-fifa2026` (license not surfaced). None was copied into
the product. They remain recorded in `docs/reuse-scout-log.md` as future
mechanism references only.

## Phase 2.1 visual master additions

- `src/components/invitation/football-visual-master.tsx` — new TAKAVEN-owned
  asset-backed opening layer. It preserves the existing `onComplete`, skip,
  reduced-motion, bounded preload, and failure-fallthrough contract. No
  third-party source code was copied.
- `public/takaven/football/stadium.webp` — generated TAKAVEN project backdrop,
  compressed to approximately 110 KB.
- `public/takaven/football/player.webp` — generated TAKAVEN project foreground
  cutout, compressed to approximately 79 KB.
- `public/takaven/football/ball.webp` — generated TAKAVEN project foreground
  object, compressed to approximately 85 KB.

The three raster assets were created for this project and do not contain
third-party logos, sample media, or customer-specific data. Names, ages, dates,
venue and RSVP content remain HTML/configuration-driven.

## Phase 2.2 visual correction additions

- `src/components/invitation/football-invitation-body.tsx` — TAKAVEN-owned
  Football presentation adapter. It changes only the visual composition and
  reuses the shared `BirthdayCountdown` and `RSVPForm` functionality.
- `src/components/invitation/birthday-functional-sections.tsx` — extracted
  shared countdown and RSVP presentation/behavior from the inherited birthday
  renderer so the Football adapter does not duplicate event logic or the
  `submitRSVP` path.
- `public/takaven/football/child-player.webp` — generated TAKAVEN project
  foreground character, a rear-facing stylised child footballer with a blank
  jersey back. The event age is rendered as HTML over the jersey at runtime.
  The asset is project-owned generated media; no third-party character, logo,
  model, frame or sample media was copied.
- `src/components/invitation/football-visual-master.tsx` and
  `src/app/globals.css` — adapted to reference the child runner and animate it
  through the existing opening lifecycle. This is ADAPTED TAKAVEN code, not a
  transplanted implementation.

The Phase 2.2 scout references (`pixijs/pixijs-skills`,
`JimboPicton/sprite-pose-agent`, `Code4Community/CodeStrikers`,
`openfootmanager/openfootmanager`, `JosephMaynard/playoverlay`, and
`Zaker237/scoreboardsweb`) remain REFERENCE-only. Their code and assets were
not copied. Licence status is recorded in the reuse scout log where surfaced;
commercial release still requires a separate licence review for the inherited
upstream base and generated-media terms.
