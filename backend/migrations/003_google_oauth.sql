--------------------------------------------------
-- GOOGLE OAUTH SUPPORT
--------------------------------------------------

ALTER TABLE users
ADD COLUMN provider VARCHAR(20)
NOT NULL
DEFAULT 'local';

ALTER TABLE users
ADD COLUMN google_id VARCHAR(255);

ALTER TABLE users
ALTER COLUMN password_hash
DROP NOT NULL;

ALTER TABLE users
ADD CONSTRAINT chk_provider
CHECK (
    provider IN (
        'local',
        'google'
    )
);

CREATE UNIQUE INDEX idx_users_google_id
ON users(google_id);