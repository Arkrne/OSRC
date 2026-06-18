-- ============================================================
-- RLS Policies for Orange Square Realty
-- Run in Supabase SQL Editor or via: supabase db push
-- ============================================================

-- ── listings ──────────────────────────────────────────────
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Anyone can read published listings (public site)
DROP POLICY IF EXISTS "Public read listings" ON listings;
CREATE POLICY "Public read listings"
  ON listings FOR SELECT
  USING (true);

-- Only the configured admin UIDs can insert listings
DROP POLICY IF EXISTS "Admin insert listings" ON listings;
CREATE POLICY "Admin insert listings"
  ON listings FOR INSERT
  WITH CHECK (
    auth.uid()::text = ANY(
      string_to_array(current_setting('app.admin_uids', true), ',')
    )
  );

-- Only the configured admin UIDs can update listings
DROP POLICY IF EXISTS "Admin update listings" ON listings;
CREATE POLICY "Admin update listings"
  ON listings FOR UPDATE
  USING (
    auth.uid()::text = ANY(
      string_to_array(current_setting('app.admin_uids', true), ',')
    )
  );

-- Only the configured admin UIDs can delete listings
DROP POLICY IF EXISTS "Admin delete listings" ON listings;
CREATE POLICY "Admin delete listings"
  ON listings FOR DELETE
  USING (
    auth.uid()::text = ANY(
      string_to_array(current_setting('app.admin_uids', true), ',')
    )
  );

-- ── promos ────────────────────────────────────────────────
ALTER TABLE promos ENABLE ROW LEVEL SECURITY;

-- Anyone can read promos (shown on public site)
DROP POLICY IF EXISTS "Public read promos" ON promos;
CREATE POLICY "Public read promos"
  ON promos FOR SELECT
  USING (true);

-- Only admin UIDs can write promos
DROP POLICY IF EXISTS "Admin insert promos" ON promos;
CREATE POLICY "Admin insert promos"
  ON promos FOR INSERT
  WITH CHECK (
    auth.uid()::text = ANY(
      string_to_array(current_setting('app.admin_uids', true), ',')
    )
  );

DROP POLICY IF EXISTS "Admin update promos" ON promos;
CREATE POLICY "Admin update promos"
  ON promos FOR UPDATE
  USING (
    auth.uid()::text = ANY(
      string_to_array(current_setting('app.admin_uids', true), ',')
    )
  );

DROP POLICY IF EXISTS "Admin delete promos" ON promos;
CREATE POLICY "Admin delete promos"
  ON promos FOR DELETE
  USING (
    auth.uid()::text = ANY(
      string_to_array(current_setting('app.admin_uids', true), ',')
    )
  );

-- ── Storage: property-images bucket ───────────────────────
-- Public read (images displayed on site)
-- Admin-only write (enforced in /api/upload via service-role + UID check)
-- Note: Storage RLS is configured in Supabase Dashboard > Storage > Policies
-- The /api/upload route already enforces admin-only access at the app layer.
-- Add these via Dashboard if you want defense-in-depth at the storage layer:
--
--   SELECT: bucket_id = 'property-images'  (public)
--   INSERT: bucket_id = 'property-images' AND auth.uid()::text = ANY(admin_uids)
--   DELETE: bucket_id = 'property-images' AND auth.uid()::text = ANY(admin_uids)

-- ── Set admin UIDs as a DB-level config (call once after deploy) ───────────
-- Replace the UUID below with your real admin UID from Supabase Auth > Users
-- SELECT set_config('app.admin_uids', 'uid1,uid2', false);
--
-- Or set it as a postgres role parameter in supabase/config.toml:
--   [db.settings]
--   app.admin_uids = "your-uid-here"
