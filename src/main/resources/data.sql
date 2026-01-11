-- Initial Admin User (password: password)
-- Password hash generated with BCrypt (10 rounds)
INSERT INTO users (username, password, role) 
SELECT 'admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');
