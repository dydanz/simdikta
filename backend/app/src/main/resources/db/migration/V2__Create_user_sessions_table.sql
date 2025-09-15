-- Create user_sessions table for session management

CREATE TABLE IF NOT EXISTS user_sessions (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expire_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    
    CONSTRAINT fk_user_sessions_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_status ON user_sessions(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expire_at ON user_sessions(expire_at);