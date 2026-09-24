# Backend status

The restored Supabase project is being retained and cleaned rather than rebuilt from zero.

Core RLS-enabled tables: `chairs`, `requests`, `chair_feedback`, `photo_chairs_photos`, `game_progress`, `app_content`.

Current app authentication uses Supabase anonymous sign-in. Anonymous Supabase users assume the Postgres `authenticated` role, allowing per-user ownership without profiles, email addresses, or passwords.

Current RPCs used by the baseline:
- `find_chairs_v2(text)`
- `take_chair(uuid)`

The search and take RPCs use privileged database execution because they must count other users’ active requests to calculate seat availability atomically. Execution is restricted to authenticated sessions.

Photo retention is handled by `photo-chairs-cleanup`, scheduled hourly through `pg_cron` + `pg_net`. A manual verification on 2026-09-23 removed both the expired metadata row and the actual Storage object.

Only the Supabase publishable key belongs in client-side code. Never expose a service-role key.
