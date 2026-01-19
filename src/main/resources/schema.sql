CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    invite_code VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS seasons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    active BOOLEAN NOT NULL,
    locked BOOLEAN NOT NULL,
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    season_id BIGINT NOT NULL,
    tmdb_id VARCHAR(255),
    title VARCHAR(255),
    poster_path VARCHAR(255),
    overview VARCHAR(5000),
    release_date VARCHAR(50),
    runtime INTEGER,
    selected BOOLEAN NOT NULL DEFAULT FALSE,
    selected_at BIGINT,
    CONSTRAINT fk_ticket_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_ticket_season FOREIGN KEY (season_id) REFERENCES seasons (id)
);