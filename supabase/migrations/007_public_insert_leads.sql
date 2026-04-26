-- ============================================================
-- Allow public INSERT into leads (for /api/contact form submissions)
-- without requiring service-role bypass.
--
-- SELECT/UPDATE/DELETE remain admin-only via the existing
-- "admin_all" policy. Public clients can only create new leads,
-- never read or modify existing ones.
-- ============================================================

CREATE POLICY "public_insert" ON leads
  FOR INSERT
  WITH CHECK (true);
