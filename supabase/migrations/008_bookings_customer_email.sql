-- ============================================================
-- Add optional customer_email to bookings.
-- Used for sending booking confirmation emails to customers.
-- Optional field - customers may not provide an email.
-- ============================================================

ALTER TABLE bookings ADD COLUMN customer_email TEXT;
