# TAKAVEN INVITATIONS — PHASE 1.1 VALIDATION REPORT

## 1. VERDICT

**PASS WITH ISSUES**

The narrow code-level validation and mobile pre-visual checks pass. Real
Supabase execution is blocked because no valid project URL/anon key was supplied
to this checkout, and the available management token returned `401 Unauthorized`.
The repository is not being represented as having passed real persistence.

## 2. SUPABASE ENVIRONMENT

No `.env.local` or equivalent project configuration was present. The process had
an access-token variable, but querying Supabase project metadata returned 401.
No credential values were printed, persisted, or committed.

The repository still contains only `.env.example` and uses the existing
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` contract.

## 3. REAL INVITATION DATA TEST

Blocked pending valid Supabase configuration. The existing query path remains:

- published invitation lookup by slug;
- existing `/i/[slug]` route;
- existing invitation renderer selected by event type;
- existing operator dashboard queries.

The local demo fixture was not used as evidence of real database connectivity.

## 4. RSVP END-TO-END RESULT

Not passed against a real database. The existing `submitRSVP` path remains the
only persistence path.

Narrow safety fixes added:

- server-side published/RSVP-enabled invitation check before insert;
- name and guest-count validation;
- visible controlled error state in the Football birthday RSVP form;
- no fake local persistence layer.

## 5. RLS / PUBLIC ACCESS RESULT

Static review found the inherited INSERT policy allowed RSVP for any published
invitation, even when `show_rsvp=false`. This was corrected in both:

- `supabase/schema.sql`; and
- `supabase/migrations/20251006_phase_1_1_rsvp_guard.sql`.

The intended policy is now: public/anonymous INSERT is allowed only when the
referenced invitation is `published` and `show_rsvp=true`; authenticated owners
can SELECT their own responses through the existing policy.

The deployed policy still requires execution against the owner’s project before
it can be marked runtime-verified.

## 6. TIMEZONE / COUNTDOWN RESULT

The inherited countdown used only `event_date`, ignoring `event_time` and the
configured timezone. The Football path now resolves date + time against the
configured IANA timezone through `getEventTimestamp`.

Local browser validation at 390×844 using UTC and Indian/Mauritius contexts
showed the same event time (`16:30`) and equivalent countdown values within the
seconds elapsed between checks.

## 7. MOBILE END-TO-END RESULT

Local pre-visual flow passed at 390×844:

- opening renders;
- skip works;
- reduced motion bypasses the opening;
- dynamic name/age reveal appears;
- invitation and RSVP remain visible;
- reload works;
- body width remains 390px with no horizontal overflow.

Real-data mobile RSVP remains blocked by missing Supabase configuration.

## 8. PERFORMANCE BASELINE

Measured locally in the development browser context at 390×844:

- HTML: approximately 73.5 KB;
- JavaScript transfer: approximately 1.30 MB;
- CSS transfer: approximately 23 KB;
- placeholder opening request: approximately 866 bytes in browser transfer;
- source SVG: 566 bytes;
- 33 resource requests observed.

These are development-route observations, not production CDN budgets. Keep the
future mobile cinematic payload bounded around the existing 250 KB registry
budget until real assets prove otherwise. Keep frame sequence, video, Lottie,
and WebGL open until actual Football assets are measured; no heavyweight format
is approved by this phase.

Target behavior remains: invitation accessible immediately after the short
opening, and always reachable through skip, reduced motion, or failure fallback.

## 9. CHANGES MADE

- Added timezone-aware event timestamp resolution.
- Updated Football countdown to use date, time, and timezone.
- Added server-side RSVP payload and invitation-state validation.
- Added RLS migration enforcing `show_rsvp=true` for public inserts.
- Added controlled RSVP error messaging to the Football invitation shell.
- Updated `docs/drift-log.md`.

No architecture, source base, RSVP model, or theme boundary was redesigned.

## 10. REUSE SCOUT

No new repository materially changed implementation. The approved
`invitation-builder` RSVP/data flow remains the source of truth.

## 11. DRIFT GUARD

- **PASS:** no new RSVP architecture, database, backend, theme, page, or SaaS
  subsystem was introduced.
- **PASS:** Football remains configuration-driven.
- **PASS:** existing operator response workflow remains unchanged.
- **WARNING:** real Supabase runtime and deployed RLS are not yet verified.
- **BLOCK:** none.

## 12. TESTS / BUILD

- `npx tsc --noEmit` — PASS.
- `npm run build` — PASS.
- Local mobile Chrome checks — PASS for opening, skip, reduced motion, reload,
  timezone invariance, RSVP visibility, and no overflow.
- Focused lint reports inherited upstream errors in the large BirthdayPage and
  action files; no unrelated lint cleanup was performed.
- Real Supabase persistence/operator visibility — BLOCKED by missing valid
  environment credentials.

## 13. KNOWN ISSUES

- Real invitation read, RSVP persistence, operator response visibility, and
  deployed RLS still require an owner-supplied Supabase project configuration.
- Existing full-repository lint debt remains.
- Next.js middleware deprecation remains inherited.
- Performance figures are development observations.

## 14. COMMIT SHA

Phase 1.1 validation changes:

`654dae7f12a1100e6b386e6c30b7ee81ed7cc0c0`

Starting approved Phase 1 commit:

`317ed24925c529f4bcc4540cdf6faa23e33d658e`

## 15. RECOMMENDATION

**Do not begin premium Football visual production yet.**

The code is ready for the final environment check, but TAKAVEN needs a valid
Supabase project URL and anon key—or an owner-authorized connected Supabase
environment—before Phase 1.1 can be marked fully passed.
