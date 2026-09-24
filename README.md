# The Other Chair

Live-connected rebuild baseline for the Other Chair mobile-first social app.

## Current state
- Mobile-first dark pewter Art Deco shell
- English/Korean toggle
- Supabase anonymous sign-in
- Shared Offer a Chair flow
- Shared Take a Chair/search flow
- Atomic Take Chair RPC
- Local fallback if Supabase cannot initialize
- Beacon screen
- Hourly 72-hour photo cleanup deployed in Supabase

## Files
- `index.html` — app shell
- `styles.css` — baseline design system
- `app.js` — UI routing and screen behavior
- `backend.js` — Supabase adapter and local fallback
- `config.js` — public backend configuration
- `docs/DECISIONS.md` — canonical product/design decisions
- `docs/BACKEND.md` — backend status and safety notes
- `supabase/functions/photo-chairs-cleanup/index.ts` — deployed cleanup function
- `assets/` — approved artwork only

## Next
1. Put these files into the `JediJillsDroids/other-chair` GitHub repository.
2. Deploy that repository to Netlify.
3. Test Offer/Take from two different devices/browser profiles.
4. Promote approved portrait artwork into `assets/`.
5. Wire approved game interactions into the live shell.

The ordinary ChatGPT GitHub connector is read-only, so the repository push must be performed through Codex or GitHub itself.
