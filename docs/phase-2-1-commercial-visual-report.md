# TAKAVEN INVITATIONS — PHASE 2.1 COMMERCIAL VISUAL REPORT

## 1. Verdict

**PASS WITH ISSUES.** The Football opening is now materially stronger than the
procedural Phase 2 version and remains isolated behind the existing
`OpeningExperience` contract. It is ready for owner review as a commercial
visual master candidate, but final public release still needs art-direction and
asset approval.

## 2. Visual mechanism comparison

| Mechanism | Mobile quality | Reuse | Payload / reliability | Decision |
|---|---|---|---|---|
| Authored short video | High ceiling, strong pacing | Good if master video remains generic | Larger payload, autoplay and codec concerns | Future option |
| Image/frame sequence | High ceiling with authored frames | Good, but every sequence needs production | Can become very large | Lifecycle reference only |
| AI-generated cinematic clip | Potentially high | Good for a generic master, but needs a production pipeline | Asset provenance and delivery workflow not yet established | Deferred |
| Layered 2D + existing motion stack | Strong with authored assets | Excellent; HTML/config remains dynamic | Approximately 273 KB compressed visual assets, no new runtime | **Selected** |
| Lightweight WebGL / Three.js | High technical ceiling | More expensive to maintain and test | Runtime, model, GPU and mobile failure surface | Rejected for this phase |

## 3. Selected approach

TAKAVEN now uses an asset-backed 2D master: a generated stadium backdrop,
isolated footballer and isolated ball, animated with CSS keyframes inside the
existing React opening boundary. Framer Motion continues to own the existing
reveal overlay; no GSAP or 3D dependency was added.

This keeps the visual media layer replaceable. A future authored video or frame
sequence can replace the three image layers without changing event data,
public routing, RSVP, countdown or the invitation shell.

## 4. Reuse Scout findings

The round-two targeted search is recorded in `docs/reuse-scout-log.md`.
Useful patterns came from configurable video/image heroes, canvas frame
lifecycle references, clip-path handoffs and reduced-motion cleanup patterns.
No discovered repository supplied a licence-clear, production-ready Football
master that would save more work than the selected approach.

## 5. What was reused

- Existing `EventConfig`, `ThemeDefinition`, `OpeningExperience` and registry.
- Existing `InvitationEngine` completion/reveal contract.
- Existing invitation shell, countdown, venue/directions, RSVP and public route.
- Existing Framer Motion dependency for the dynamic reveal.
- Existing Football theme frame and matchday vocabulary.

## 6. What was created new

- `src/components/invitation/football-visual-master.tsx`.
- `public/takaven/football/stadium.webp`.
- `public/takaven/football/player.webp`.
- `public/takaven/football/ball.webp`.
- Scoped visual-master CSS in `src/app/globals.css`.
- `scripts/phase-2-1-mobile-check.cjs` for repeatable mobile evidence.

## 7. Commercial Football experience

1. Stadium/tunnel backdrop establishes a dark, wet, floodlit matchday world.
2. Premium campaign typography introduces “The moment before the moment.”
3. A foreground footballer enters the composition as the striking subject.
4. The ball accelerates from the lower pitch toward the camera and fills the
   frame.
5. A restrained flash/ring impact hides the handoff.
6. The existing dynamic reveal renders `AIDEN TURNS 10`.
7. The existing invitation continues with the matchday shell and RSVP flow.

Names, ages, dates, venue and RSVP data remain configuration/HTML-driven.

## 8. Personalisation model

The media master contains no customer name, age, date, venue or RSVP data.
These remain supplied by `EventConfig` and the existing invitation renderer.

## 9. Mobile results

Validated at 390×844 with Playwright:

- opening renders;
- Skip is visible and completes the handoff;
- invitation heading and RSVP control remain visible;
- no horizontal overflow;
- reduced motion bypasses the opening;
- missing player asset falls through to the invitation;
- invitation remains readable and usable after both fallbacks.

## 10. Performance

| Asset | Compressed size |
|---|---:|
| `stadium.webp` | 109,532 bytes |
| `player.webp` | 78,572 bytes |
| `ball.webp` | 85,056 bytes |
| Total | 273,160 bytes |

There is no video, audio, frame sequence, WebGL runtime or external asset
dependency. The opening has a bounded seven-second asset fallback and a
six-point-eight-second normal handoff timer.

## 11. Visual evidence

Evidence is in `outputs/phase2-1-evidence/`:

- `football-opening-mobile.png`
- `football-build-up-mobile.png`
- `football-impact-mobile.png`
- `football-invitation-mobile.png`
- `football-reduced-motion-mobile.png`
- `football-asset-failure-mobile.png`

## 12. Creative Director verdict

**NEEDS OWNER REVIEW.** The result now reads as a premium sports campaign
direction rather than a procedural engineering demo. It should not yet be
treated as the final TAKAVEN commercial master until the owner approves the
generated player treatment, typography, and brand direction.

## 13. RSVP parallel status

Still blocked by environment only. Real Supabase URL/anon-key credentials were
not available. No alternative persistence layer was introduced.

## 14. Drift Guard

No unresolved BLOCK findings. No second theme, SaaS expansion, new database,
duplicated RSVP, customer media pipeline, or architecture rewrite was added.

## 15. Tests / build

- Focused ESLint: PASS.
- `git diff --check`: PASS.
- `npm run build`: PASS with the existing middleware deprecation warning.
- `node scripts/phase-2-1-mobile-check.cjs`: PASS.
- Clean browser console on a fresh live tab: no errors.

## 16. Known issues

- Final asset/art-direction approval is outstanding.
- The generated player is a reusable master subject, not customer-specific
  personalisation.
- Real Supabase RSVP persistence remains unvalidated.
- The current test harness uses the demo fixture for visual validation.

## 17. Commit SHA

Recorded in the final handoff after commit creation.

## 18. Recommendation

Proceed to owner review of the visual master. Do not begin a second theme or a
larger media pipeline until the Football art direction is explicitly approved.
