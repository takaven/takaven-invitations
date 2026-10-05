# TAKAVEN Invitations

TAKAVEN Invitations is a reuse-first interactive invitation engine.

The current branch contains the approved Phase 0 audit and the first Phase 1
vertical slice, adapted from `utopusc/invitation-builder`. Existing public
invitation rendering and RSVP remain the operational foundation.

The first new boundary is deliberately small:

```text
EventConfig -> ThemeDefinition -> OpeningExperience -> InvitationShell -> RSVP
```

Football is selected by configuration and uses a placeholder stadium/kick
opening. It is not a separate invitation page.

## Next step

The repository is `takaven/takaven-invitations` and remains public for
independent review during Phase 1.

See `docs/phase-0-recommendation.md`, `docs/phase-1-approved-scope.md`,
`docs/source-register.md`, `docs/reuse-scout-log.md`, and `docs/drift-log.md`.

For local visual validation only, set `TAKAVEN_DEMO_MODE=true` and open
`/i/football-demo`. This fixture bypasses data fetching but deliberately keeps
the production invitation shell and RSVP implementation unchanged.
