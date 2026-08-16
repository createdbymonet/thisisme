CREATE TABLE admin_sessions (
  session_token_hash TEXT PRIMARY KEY,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX admin_sessions_expires_at_idx ON admin_sessions(expires_at);
