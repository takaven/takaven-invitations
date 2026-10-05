# TAKAVEN Invitations — Phase 1 Approved Scope

Status: approved in principle; repository created under `takaven`.

## Objective

Prove the smallest reusable vertical slice:

```text
open public URL
  -> placeholder football cinematic opening
  -> impact transition
  -> dynamic invitation
  -> mobile RSVP
```

## In scope

1. Create `takaven-invitations` under the exact approved GitHub owner.
2. Import/adapt `utopusc/invitation-builder`; do not recreate its operational
   plumbing.
3. Add only the minimum typed boundaries:
   - `EventConfig`
   - `ThemeDefinition`
   - `OpeningExperience`
4. Preserve the existing public invitation and RSVP flow.
5. Add one placeholder football opening using PRIOR-inspired frame/canvas,
   preload, mobile-tier, skip, and fallback mechanics.
6. Prove the flow on a real mobile viewport and report the gate results.

## Out of scope

- polished football assets;
- additional themes or event-specific openings;
- self-service SaaS, billing, roles, or analytics;
- Instagram/social integrations;
- proprietary media hosting;
- commercial release or public redistribution;
- licensing cleanup beyond provenance records and explicit release gating.

## Prototype licensing posture

The prototype may adapt architecture and code under a recorded provenance
register while remaining internal and undistributed. Third-party media/assets
must not be copied. Commercial release remains blocked until each reused code
source has a verified license or written permission.

## Stop gate

Stop after demonstrating or disproving:

- opening URL on mobile;
- cinematic sequence completion or skip;
- transition into the generic invitation shell;
- dynamic name/age reveal;
- date, venue, countdown, directions, and RSVP;
- persisted RSVP response;
- fallback under reduced motion, missing media, and slow-loading conditions.
