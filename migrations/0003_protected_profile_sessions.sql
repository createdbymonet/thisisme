CREATE TABLE protected_profile_sessions (
  session_id_hash TEXT PRIMARY KEY,
  company_code TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_code) REFERENCES companies(company_code) ON DELETE CASCADE
);

CREATE INDEX protected_profile_sessions_company_code_idx
  ON protected_profile_sessions(company_code);

CREATE INDEX protected_profile_sessions_expires_at_idx
  ON protected_profile_sessions(expires_at);
