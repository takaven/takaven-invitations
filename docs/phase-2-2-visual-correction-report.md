# TAKAVEN INVITATIONS — PHASE 2.2 VISUAL CORRECTION REPORT

Date: 2026-10-06

## 1. VERDICT

PASS WITH ISSUES — the rejected adult-player direction has been replaced and
the invitation body now carries a coherent Football matchday visual system.
The implementation is ready for owner review, but it is still a generated-art
master rather than a final commissioned campaign asset.

## 2. OWNER FEEDBACK ADDRESSED

- Kept the approved stadium/tunnel image.
- Removed the adult player asset from the product and replaced it with a
  rear-facing child runner in a generic navy/emerald kit.
- Added the event age as a dynamic HTML jersey number rather than baking it into
  the asset.
- Replaced the generic birthday body with a matchday hierarchy: MATCHDAY,
  fixture title, kickoff metadata, countdown board, venue/map, match details and
  squad RSVP.
- Removed Football's giant purple age treatment, party decorations and generic
  birthday-card presentation.

## 3. REUSE SCOUT FINDINGS

The targeted Phase 2.2 search covered child animation, sprite sheets, character
run cycles, sports broadcast UI, scoreboards, matchday graphics and football
landing pages. No licence-clear drop-in child footballer or kick-to-camera
sequence materially reduced the work.

Useful references were `pixijs/pixijs-skills` for a future frame-backed
`AnimatedSprite` lifecycle, `JimboPicton/sprite-pose-agent` for a possible
authored run-cycle workflow, `openfootmanager/openfootmanager` and
`JosephMaynard/playoverlay` for broadcast information hierarchy, and
`Zaker237/scoreboardsweb` for responsive fixture composition. They remain
reference-only. No code, sample media, models or game runtime was copied.

The detailed decision record is in [`docs/reuse-scout-log.md`](./reuse-scout-log.md).

## 4. CHILD ANIMATION APPROACH

The selected approach is a TAKAVEN-owned transparent raster character with a
bounded CSS motion timeline inside the existing `OpeningExperience` contract.

| Option | Decision | Reason |
|---|---|---|
| Sprite/frame sequence | Defer | Strong future option, but authored frames are not yet available and add payload. |
| Layered illustrated character | Defer | Could support kit variants, but would require producing multiple coordinated layers now. |
| Transparent short video | Defer | Highest motion fidelity, but adds encoding, autoplay, transfer and fallback complexity. |
| AI-generated motion clip | Defer | No reusable/licence-clear pipeline; customer-specific regeneration is out of scope. |
| Lightweight 3D | Reject for this slice | Runtime and model-loading risk are disproportionate to one opening. |
| Single stylised character + CSS motion | Selected | Fastest controlled improvement with low payload, dynamic jersey number and existing fallbacks. |

The new character is `public/takaven/football/child-player.webp` at 64,760
bytes. It is viewed from behind, contains no face, logo, number or customer
data, and is animated as an entering/running figure. The old adult
`player.webp` was removed.

## 5. OPENING EXPERIENCE

The opening now runs:

1. Approved floodlit stadium/tunnel atmosphere.
2. Child footballer enters from the tunnel, seen from behind.
3. Dynamic jersey number reflects the configured age.
4. Ball builds from the pitch and travels toward the camera.
5. Ball fills the viewport and the existing impact flash/ring masks the handoff.
6. Existing dynamic reveal presents the celebrant and age.
7. The matchday invitation body is already mounted behind the transition, so the
   user lands in the same stadium world rather than an unrelated birthday page.

Skip, reduced motion and asset-failure completion remain in the existing
opening component. No opening-specific RSVP or event-data logic was added.

## 6. INVITATION BODY REDESIGN

Football now uses `FootballInvitationBody`, a presentation adapter selected by
the existing `theme_id` configuration. It reuses the extracted shared
`BirthdayCountdown` and `RSVPForm` components and the existing `submitRSVP`
action.

The visual hierarchy is:

- stadium-backed MATCHDAY hero;
- `{name}'s {age}th birthday` and fixture date/time;
- home fixture / squad strip;
- countdown-to-kickoff board;
- THE VENUE with directions and map;
- MATCH DETAILS with message, date, kickoff and hosts;
- YOU'RE ON THE TEAM with the existing RSVP behavior restyled as squad selection;
- restrained Takaven FC footer.

The generic birthday renderer is still used for non-Football invitations.

## 7. CONTINUITY REVIEW

The opening and body share the same dark stadium palette, emerald pitch accent,
uppercase broadcast labels, thin rules, rectangular glass panels and floodlit
imagery. The body no longer falls into the old purple birthday-card aesthetic.

Continuity reviewer result: PASS for the engineering master, with owner review
still required for final campaign art direction.

## 8. PERSONALISATION

The following remain runtime/configuration-driven:

- celebrant name;
- age;
- date and time;
- configured timezone;
- venue and address;
- map/directions URL;
- countdown;
- hosts/message;
- RSVP submission and confirmation.

The age is also rendered as the jersey number without regenerating the child
asset. Customer-specific image generation is not required.

## 9. MOBILE RESULTS

Validated against the local production server at 390×844:

- opening loads and Skip is visible;
- child runner, kick/flight and impact states render;
- matchday hero, countdown, venue and RSVP all render;
- no horizontal overflow;
- reduced-motion opens directly into the invitation;
- missing child asset falls through to the invitation;
- desktop 1440px validation also completed with no horizontal overflow.

Evidence is in [`outputs/phase2-2-evidence/`](../outputs/phase2-2-evidence/).

## 10. PERFORMANCE

Measured production resource entries for the opening media:

| Asset | Decoded size | Transfer size |
|---|---:|---:|
| `stadium.webp` | 109,532 bytes | 109,832 bytes |
| `child-player.webp` | 64,760 bytes | 65,060 bytes |
| `ball.webp` | 85,056 bytes | 85,356 bytes |
| Total | 259,348 bytes | 260,248 bytes |

The opening remains video-free, WebGL-free and audio-free. Skip reached the
invitation in approximately 2.6 seconds in a local production-browser check;
the user does not have to wait for the full sequence. Reduced motion and a
failed opening asset bypass the sequence. Real slow-network timings still need
to be captured against a deployed environment.

## 11. VISUAL EVIDENCE

- [Opening tunnel](../outputs/phase2-2-evidence/01-opening-tunnel-mobile.png)
- [Child runner](../outputs/phase2-2-evidence/02-child-runner-mobile.png)
- [Kick / ball flight](../outputs/phase2-2-evidence/03-kick-flight-mobile.png)
- [Impact](../outputs/phase2-2-evidence/04-impact-mobile.png)
- [Matchday hero](../outputs/phase2-2-evidence/05-matchday-hero-mobile.png)
- [Countdown](../outputs/phase2-2-evidence/06-countdown-mobile.png)
- [RSVP](../outputs/phase2-2-evidence/07-rsvp-mobile.png)
- [Reduced motion](../outputs/phase2-2-evidence/08-reduced-motion-mobile.png)
- [Asset failure fallback](../outputs/phase2-2-evidence/09-asset-failure-mobile.png)
- [Desktop hero](../outputs/phase2-2-evidence/10-desktop-matchday.png)

## 12. CREATIVE DIRECTOR VERDICT

COMMERCIAL MASTER CANDIDATE / NEEDS OWNER REVIEW.

The output is materially stronger than the rejected Phase 2.1 execution: the
child is age-appropriate, rear-facing and integrated into the tunnel/pitch
composition, while the invitation body now reads as a designed matchday
experience. It should not yet be described as a final commissioned Football
campaign until the owner reviews the evidence and decides whether the generated
character art is sufficiently distinctive.

## 13. DRIFT GUARD

PASS. No unresolved BLOCK findings.

- No second theme.
- No new database, backend, SaaS, billing or social functionality.
- Football remains configuration-selected.
- RSVP/countdown/location logic remains shared.
- Existing stadium asset was reused.
- No third-party code or media was copied from the scout references.

## 14. RSVP STATUS

The existing RSVP action and form behavior are preserved and rendered inside
the new Football squad presentation. The local demo flow exposes the submit
control and confirmation state. Real Supabase persistence remains a parallel
environment-validation item because credentials are still unavailable; no fake
or alternative persistence layer was introduced.

## 15. TESTS / BUILD

- Focused ESLint on changed files: new Football files clean; inherited
  `birthday-page.tsx` still reports two existing `react-hooks/set-state-in-effect`
  errors and two legacy unused-icon warnings.
- `npm run build`: PASS after allowing the inherited Google font downloads.
- `git diff --check`: PASS.
- Playwright production-browser flow: PASS for 390×844 and 1440px; Skip,
  reduced motion, asset failure, body sections and overflow checks included.

The Next middleware deprecation warning is inherited and not part of this
visual correction.

## 16. KNOWN ISSUES

- The child is a single animated keyframe rather than a true run-cycle or
  authored kick animation. The motion reads as an approach/transition master,
  but final premium production may warrant a short authored transparent clip or
  frame sequence.
- Real Supabase RSVP persistence and operator visibility are still blocked by
  missing environment credentials.
- The inherited renderer has existing lint debt outside this visual slice.
- Final generated-art licensing/commercial terms and the inherited upstream
  base licence still need release review.

## 17. COMMIT SHA

Recorded in the final handoff after integration commit.

## 18. RECOMMENDATION

Proceed to owner review of the revised Football master. Do not build another
theme or expand product scope yet. If the owner approves the visual direction,
the next narrow step should be either final commissioned Football media or a
small authored run-cycle/transparent clip experiment, while Supabase validation
continues separately.
