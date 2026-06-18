-- Admin audit log — append-only record of mutating admin actions.
-- Service-role key (server-side routes) bypasses RLS to INSERT.
-- Authenticated admins may SELECT (for future dashboard view).
-- No UPDATE or DELETE is permitted via any client role.

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id        uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  ts        timestamptz DEFAULT now()             NOT NULL,
  actor_id  text                                  NOT NULL,
  action    text                                  NOT NULL,
  meta      jsonb
);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- Admins (authenticated JWT) may read their own audit trail
DROP POLICY IF EXISTS "Authenticated read admin_audit_log" ON admin_audit_log;
CREATE POLICY "Authenticated read admin_audit_log"
  ON admin_audit_log FOR SELECT
  TO authenticated
  USING (true);

-- INSERT / UPDATE / DELETE blocked for all JWT-authenticated clients
-- (service-role key on the server bypasses RLS entirely)
