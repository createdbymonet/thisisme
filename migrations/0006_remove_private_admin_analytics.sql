-- Permanently remove data belonging to retired private/admin features.
-- Drop dependent tables before their parents; preserve testimonials and health.
DROP TABLE analytics_events;
DROP TABLE analytics_sessions;
DROP TABLE protected_profile_sessions;
DROP TABLE access_codes;
DROP TABLE companies;
DROP TABLE private_profile;
DROP TABLE admin_sessions;
DROP TABLE settings;
DROP TABLE testimonials;
DROP TABLE _infrastructure_health;
