-- Initial Admin User (password: password)
-- Password hash generated with BCrypt (10 rounds)
INSERT INTO users (username, password, role) 
SELECT 'admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- Default Season
INSERT INTO seasons (name, active, locked, created_at)
SELECT 'Local Test Season 1', TRUE, FALSE, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM seasons WHERE name = 'Local Test Season 1');
