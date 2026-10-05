# TAKAVEN INVITATIONS — PHASE 1 EXECUTION REPORT

## 1. VERDICT

**PASS WITH ISSUES**

The first vertical slice runs locally and passes the architectural, mobile,
opening, skip, reduced-motion, reload, and invitation-shell checks. The live
Supabase RSVP write was not verifiable because this checkout intentionally used
placeholder Supabase credentials. The existing RSVP implementation was retained
rather than replaced with a fake local implementation.

## 2. WHAT WAS REUSED

- `utopusc/invitation-builder` at audited commit
  `4ba571fc131212c20e1ea0d66a939360ed55e60f` was imported as the operational
  base.
- Its Next.js App Router, Supabase schema/client, dashboard/editor, preview,
  public `/i/[slug]` route, event renderers, countdowns, map links, and
  `submitRSVP` server action remain in use.
- Its existing birthday renderer is used as the invitation shell for the
  Football fixture; TAKAVEN does not create a football-specific invitation page.
- PRIOR was used as a lifecycle/performance reference only: bounded loading,
  responsive tiers, skip, fallback, and reduced-motion behavior. No PRIOR code,
  frames, media, or sample assets were copied.
- ZYPHORA, Ceremonia, Invitation-Generator, and Wedding-Website-Template were
  retained as documented architectural/pattern references only. The exact
  decisions are in `docs/source-register.md` and `docs/reuse-scout-log.md`.

## 3. WHAT WAS BUILT NEW

- A minimal `EventConfig` migration boundary over the existing invitation row.
- `ThemeDefinition` and `OpeningExperience` registries with `default` and
  `football` selections.
- `InvitationEngine`, which owns opening lifecycle, skip, reveal, reduced-motion
  handling, and non-blocking fallback while rendering the existing shell below.
- A placeholder Football opening using original TAKAVEN CSS/SVG art:
  stadium atmosphere, player/ball approach, kick motion, impact/reveal overlay,
  skip, and automatic completion.
- Opt-in `TAKAVEN_DEMO_MODE` fixture at `/i/football-demo` so the public flow can
  be reviewed without silently changing production Supabase behavior.
- Small editor fields for theme, celebrant name, and timezone stored through the
  existing `custom_fields` migration bridge.
- Provenance, reuse-scout, drift, and Phase 1 execution documentation.
- A defensive change to the inherited Resend module so absent email credentials
  do not fail RSVP module evaluation before the existing database insert runs.

## 4. FILES / ARCHITECTURE CHANGED

The imported application is now the repository root. TAKAVEN-specific additions
are concentrated in:

- `src/lib/engine/contracts.ts`
- `src/lib/engine/event-config.ts`
- `src/lib/engine/theme-registry.ts`
- `src/components/invitation/invitation-engine.tsx`
- `src/components/invitation/football-opening.tsx`
- `src/app/i/[slug]/page.tsx`
- `public/takaven/opening/football-placeholder.svg`
- `src/lib/data/demo-invitation.ts`
- `src/lib/data/invitations.ts`
- `src/components/invitation/invitation-form.tsx`
- `src/lib/email/resend.ts`
- `docs/source-register.md`
- `docs/reuse-scout-log.md`
- `docs/drift-log.md`

The public route still selects an existing renderer by event category, then
wraps it in the generic engine. Football is configuration, not routing.

## 5. FOOTBALL VERTICAL SLICE

Verified local flow:

`/i/football-demo` → Football opening → player/ball placeholder sequence →
impact/reveal → `AIDEN TURNS 10` → existing birthday invitation shell → event
details/countdown/map/RSVP.

The opening can auto-complete or be skipped. Reduced motion completes it
immediately. If the cinematic layer fails, the child invitation remains the
existing renderer and is not replaced by a football-specific page.

## 6. MOBILE RESULTS

Validated with a real headless Chrome mobile context at **390×844**, touch
enabled, device scale factor 2:

- opening visible before interaction;
- Skip clickable and removes the opening;
- dynamic invitation and RSVP visible after skip;
- reduced-motion preference bypasses the opening immediately;
- `document.body.scrollWidth` remained 390px, with no horizontal overflow;
- reload returns to a usable invitation route.

The earlier z-index conflict with the inherited entry overlay was found and
resolved during this test.

## 7. RSVP RESULTS

The existing `submitRSVP` action and form were preserved. The local fixture
reaches the real action, but the write cannot succeed with
`https://example.supabase.co` placeholder configuration; the expected database
fetch failure is visible in the local server log. No fake RSVP store was added.

With real Supabase environment variables and the existing schema/RLS in place,
the preserved path is the one that must be validated before production use.

## 8. PERFORMANCE

- The placeholder cinematic payload is a 566-byte SVG plus CSS; no video,
  frame sequence, or audio is required.
- The registry records a 250 KB mobile opening budget for the Football adapter,
  leaving room for a future bounded asset manifest without accepting PRIOR's
  large reference payload as a default.
- No mandatory audio, remote cinematic media, or third-party sample assets were
  introduced.
- Existing Google font fetching may warn or fall back when the environment has
  no font network access; this is inherited base behavior.
- Production performance with real Football media remains a later visual-quality
  gate, not a claim made by this placeholder slice.

## 9. REUSE SCOUT FINDINGS

The most material findings were:

- Preserve `invitation-builder` public routing, renderer, RSVP, countdown, and
  editor instead of rewriting them.
- Use PRIOR's loading/eviction/mobile-tier ideas as patterns only; do not copy
  its large media payload or assets.
- Guest-token RSVP and URL-state ideas from adjacent repositories are deferred;
  they do not improve this first slice enough to justify integration cost.
- No additional repository discovered during the scout materially displaced the
  approved operational base.

## 10. DRIFT GUARD REPORT

- **PASS:** generic event/config boundary; Football selected by configuration;
  no `/football` invitation page.
- **PASS:** existing RSVP, countdown, public route, dashboard, and renderer
  remain reused.
- **PASS:** no billing, CRM, analytics platform, social API, microservice,
  second database, AI-media backend, or second cinematic theme.
- **PASS:** opening failure/skip/reduced motion cannot prevent access to the
  underlying invitation.
- **WARNING:** commercial licence verification is unresolved.
- **WARNING:** real Supabase-backed RSVP and production media budgets still need
  environment-specific validation.
- **WARNING:** inherited full-repository lint debt remains; focused TAKAVEN files
  pass. No unresolved **BLOCK** findings remain.

## 11. SOURCE REGISTER

Confirmed in `docs/source-register.md`. It records upstream commit, relevant
material, TAKAVEN destination, direct/adapted/pattern mode, asset posture, and
licensing status for every material source.

## 12. TESTS / BUILD

- `npm ci` — PASS; inherited audit reports 23 advisories and was not auto-fixed.
- `npx tsc --noEmit` — PASS.
- Focused ESLint for TAKAVEN engine/opening/route/email files — PASS.
- `npm run build` — PASS; Next.js 16.1.4 compiled, type-checked, and generated
  `/i/[slug]`.
- Full `npm run lint` — FAILS on inherited upstream lint debt (42 errors and 40
  warnings in the earlier baseline run). This was not mass-rewritten because the
  approved reuse rule requires preserving working upstream functionality.
- Mobile Chrome checks — PASS for opening, skip, reduced motion, reload,
  invitation visibility, RSVP visibility, and no horizontal overflow.

## 13. KNOWN ISSUES

- A real Supabase project URL/key and schema/RLS are required for end-to-end
  RSVP persistence.
- Resend/email delivery is optional and intentionally unconfigured locally.
- Full inherited lint is not green.
- Next.js reports the inherited `middleware` → `proxy` convention deprecation.
- The demo fixture is an internal review path, not a production content source.
- The placeholder opening proves integration mechanics, not final visual quality.
- Commercial release still requires licence/permission clearance for directly
  reused upstream code and any future media.

## 14. OWNER ACTIONS

1. Supply a real Supabase project configuration for the next environment-level
   RSVP verification.
2. Resolve or document commercial reuse permissions before external release.
3. Independently review the public repository and the `/i/football-demo` flow.

There are no owner approvals required to review this public prototype.

## 15. RECOMMENDATION

**Proceed to independent review, then approve the visual-quality Football phase
only after real Supabase RSVP validation and a measured media budget are added.**

Do not start a second theme, SaaS expansion, polished media production, or Phase
2 work from this report alone.
