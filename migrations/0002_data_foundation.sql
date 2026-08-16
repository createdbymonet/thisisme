PRAGMA foreign_keys = ON;

CREATE TABLE companies (
  company_code TEXT PRIMARY KEY CHECK (length(company_code) >= 16),
  company_name_ciphertext TEXT NOT NULL,
  company_name_iv TEXT NOT NULL,
  encryption_version INTEGER NOT NULL CHECK (encryption_version > 0),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE access_codes (
  id TEXT PRIMARY KEY,
  company_code TEXT NOT NULL,
  code_hash TEXT NOT NULL UNIQUE,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used_at TEXT,
  use_count INTEGER NOT NULL DEFAULT 0 CHECK (use_count >= 0),
  FOREIGN KEY (company_code) REFERENCES companies(company_code) ON DELETE CASCADE
);

CREATE INDEX access_codes_company_code_idx ON access_codes(company_code);

CREATE TABLE private_profile (
  id TEXT PRIMARY KEY,
  legal_name_ciphertext TEXT NOT NULL,
  legal_name_iv TEXT NOT NULL,
  employment_ciphertext TEXT NOT NULL,
  employment_iv TEXT NOT NULL,
  education_ciphertext TEXT NOT NULL,
  education_iv TEXT NOT NULL,
  certifications_ciphertext TEXT NOT NULL,
  certifications_iv TEXT NOT NULL,
  resume_ciphertext TEXT NOT NULL,
  resume_iv TEXT NOT NULL,
  encryption_version INTEGER NOT NULL CHECK (encryption_version > 0),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE testimonials (
  id TEXT PRIMARY KEY,
  author_name_ciphertext TEXT NOT NULL,
  author_name_iv TEXT NOT NULL,
  relationship_ciphertext TEXT NOT NULL,
  relationship_iv TEXT NOT NULL,
  comment_ciphertext TEXT NOT NULL,
  comment_iv TEXT NOT NULL,
  display_preference TEXT NOT NULL CHECK (display_preference IN ('full_name', 'partial_name', 'anonymous')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  encryption_version INTEGER NOT NULL CHECK (encryption_version > 0),
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT
);

CREATE TABLE settings (
  setting_key TEXT PRIMARY KEY,
  value_ciphertext TEXT NOT NULL,
  value_iv TEXT NOT NULL,
  encryption_version INTEGER NOT NULL CHECK (encryption_version > 0),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
