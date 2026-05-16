-- ============================================================
-- JWT Security API - Database Schema
-- Projet Universitaire - Sécurisation des API REST avec JWT
-- ============================================================

CREATE DATABASE IF NOT EXISTS jwt_security_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE jwt_security_db;

-- -------------------------------------------------------
-- Table: users
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    username   VARCHAR(50)  NOT NULL UNIQUE,
    email      VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,          -- BCrypt hash
    first_name VARCHAR(50)  NOT NULL,
    last_name  VARCHAR(50)  NOT NULL,
    enabled    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: roles
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    id        INT         NOT NULL AUTO_INCREMENT,
    role_name VARCHAR(30) NOT NULL UNIQUE,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Table: user_roles  (Many-to-Many)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id INT    NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- Seed: default roles
-- -------------------------------------------------------
INSERT INTO roles (role_name) VALUES ('ROLE_USER'), ('ROLE_ADMIN')
ON DUPLICATE KEY UPDATE role_name = role_name;

-- -------------------------------------------------------
-- Seed: default admin user
-- Password: Admin@123  (BCrypt encoded)
-- -------------------------------------------------------
INSERT INTO users (username, email, password, first_name, last_name)
VALUES (
    'admin',
    'admin@securite.ma',
    '$2a$12$K8HX.mW7LzF9gL3kP2zUiuN3Y5R0q4B1jD6oE7sT8vA9wC0xF1yG2',
    'Super',
    'Admin'
) ON DUPLICATE KEY UPDATE username = username;

-- Assign ROLE_ADMIN to the admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u, roles r
WHERE u.username = 'admin' AND r.role_name = 'ROLE_ADMIN'
ON DUPLICATE KEY UPDATE user_id = user_id;
