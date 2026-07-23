-- SGU University ERP - Database Seed File for Admin User
-- Email: admin@sgu.edu.eg
-- Password: Admin@SGU2026!

INSERT INTO users (
  id,
  university_id,
  email,
  password_hash,
  first_name_en,
  last_name_en,
  role,
  status,
  failed_login_attempts,
  created_at,
  updated_at
) VALUES (
  'e2b10a24-9dfc-4014-a957-c373685e13d1',
  'd4a94639-653a-4428-bc88-918b8f2d506a',
  'admin@sgu.edu.eg',
  '$2b$12$uVNPt9a3RQd4b/QKReO.6OxCtzFKlJ8.xWnMZ0nFSadXnyqHRwpIi',
  'System',
  'Admin',
  'super_admin',
  'active',
  0,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
