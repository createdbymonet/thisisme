ALTER TABLE protected_profile_sessions ADD COLUMN analytics_session_id TEXT;

CREATE TABLE analytics_sessions (
  id TEXT PRIMARY KEY,
  company_code TEXT NOT NULL,
  started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_activity_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ended_at TEXT,
  FOREIGN KEY (company_code) REFERENCES companies(company_code) ON DELETE CASCADE
);

CREATE TABLE analytics_events (
  id TEXT PRIMARY KEY,
  analytics_session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('page_view', 'section_view', 'private_profile_view', 'resume_download', 'engagement')),
  page_key TEXT CHECK (page_key IN ('home', 'recommend', 'access', 'private')),
  section_key TEXT CHECK (section_key IN ('hero', 'skills', 'experience', 'projects', 'about', 'testimonials', 'contact', 'protected-profile')),
  duration_ms INTEGER CHECK (duration_ms IS NULL OR (duration_ms >= 0 AND duration_ms <= 300000)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (analytics_session_id) REFERENCES analytics_sessions(id) ON DELETE CASCADE
);

CREATE INDEX analytics_sessions_company_idx ON analytics_sessions(company_code);
CREATE INDEX analytics_sessions_activity_idx ON analytics_sessions(last_activity_at);
CREATE INDEX analytics_events_session_idx ON analytics_events(analytics_session_id);
CREATE INDEX analytics_events_created_idx ON analytics_events(created_at);
