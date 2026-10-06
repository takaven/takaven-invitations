# TAKAVEN INVITATIONS — PHASE 2 FOOTBALL REPORT

## 1. Verdict

**PASS WITH ISSUES.** The Football vertical slice is materially beyond the
placeholder and proves the reusable cinematic-to-invitation integration on a
390×844 mobile viewport. It is not yet the final commercial art direction:
the player is intentionally a procedural engineering silhouette and needs an
owner-approved visual production pass later.

## 2. Reuse scout discoveries

The targeted search is recorded in `docs/reuse-scout-log.md`. The most useful
additional references were `Remilya/scroll-hero` for canvas frame lifecycle,
`m1ckc3s/ripple` for a possible future impact shader, and the football-specific
procedural references `fifacher` and `striker-3d`. None was copied into TAKAVEN.

The selected approach is original procedural Canvas 2D: it avoids importing a
full Three.js game, third-party models, sample media, or a large frame payload.

## 3. What was reused

- `utopusc/invitation-builder`: public invitation route, existing invitation
  renderer, countdown, map/directions, RSVP action/form, Supabase model, and
  operator response workflow.
- Phase 1 `EventConfig`, `ThemeDefinition`, `OpeningExperience`, registry, and
  `InvitationEngine` boundary.
- PRIOR/Cinematic/Emirates/scroll-hero lifecycle principles only: bounded
  loading, skip, reduced-motion, fallback, and mobile-first media discipline.

No third-party code, video, image sequence, audio, model, or sample asset was
copied for the Football opening.

## 4. What was built new

- `football-opening.tsx`: original stadium, floodlight, player, kick,
  ball-to-camera, impact-ring and canvas animation lifecycle.
- `football-theme-frame.tsx`: matchday scoreboard chrome around the existing
  shell; it does not duplicate invitation or RSVP logic.
- Football-specific labels/palette in the existing birthday renderer, gated by
  `custom_fields.theme_id === 'football'`.
- Narrow `TAKAVEN_DEMO_MODE` middleware bypass for `/i/*` only, so the public
  demo fixture can be reviewed without Supabase credentials. Production routes
  still use the existing Supabase session path.

## 5. Football experience

1. Stadium darkness, floodlights, bowl and pitch establish the setting.
2. A player silhouette approaches the ball.
3. The kick pushes the ball toward the viewer.
4. The ball expands into a luminous impact/ring transition.
5. The existing engine reveals the dynamic `Aiden turns 10` layer.
6. The existing invitation shell continues with Football palette, matchday
   copy, countdown, venue/directions and RSVP.

## 6. Mobile results

Validated at 390×844 with touch emulation:

- Skip is visible and completes the handoff.
- Natural completion reaches the invitation.
- Reduced-motion hides the cinematic layer and leaves the invitation usable.
- Canvas-unavailable simulation falls through to the invitation.
- No horizontal overflow was observed.
- RSVP controls remain reachable in the existing shell.

## 7. Performance

The added opening has **zero network media payload**: it is procedural Canvas 2D
with no video, frames, model, audio or external asset dependency. On the local
demo run, the full inherited page measured approximately 1.27 MB JavaScript,
24 KB CSS, and 33 Next resources. That JS figure is the existing application
baseline, not a Football media payload; it remains a future optimization area.

## 8. Visual evidence

Evidence is in `outputs/phase2-evidence/`:

- `football-opening-mobile.png`
- `football-kick-mobile.png`
- `football-flight-mobile.png`
- `football-reveal-mobile.png`
- `football-invitation-mobile.png`
- `football-matchday-mobile.png`
- `football-rsvp-mobile.png`

## 9. RSVP parallel validation

**BLOCKED by environment only.** No Supabase URL/anon key is configured. The
parallel validator confirmed that an access token alone is insufficient. No
alternative persistence layer was added and no claim of real persistence is
made by this phase.

## 10. Drift guard

No unresolved BLOCK findings. The repository has no second theme, no football
route, no duplicate RSVP, no SaaS expansion, no billing, and no new database or
media pipeline. Warnings remain for final Football artwork and real Supabase
validation.

## 11. Tests/build

- `npm run build` — PASS.
- Focused ESLint on the new cinematic/frame/engine/registry/middleware files —
  PASS.
- Playwright mobile demo harness — PASS for normal, skip, dynamic reveal,
  reduced motion, Canvas fallback, RSVP visibility and horizontal overflow.

## 12. Recommendation

Approve the architecture and vertical slice for owner review. Do not call this
commercial-ready yet: the next approved phase should replace the procedural
player silhouette with authored Football art or a measured asset-backed master,
while preserving this same `OpeningExperience` contract and mobile fallback
behavior. Complete real Supabase validation in parallel when credentials are
available.
