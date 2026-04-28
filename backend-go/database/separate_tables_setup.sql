-- MVSR Alumni Portal - Separate Admin and Alumni Tables
-- Password: Shiva@56

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS mvsr_alumni 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE mvsr_alumni;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS news;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS gallery;

-- Create admin table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    department VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    profile_bio TEXT,
    admin_role VARCHAR(100) DEFAULT 'Administrator',
    permissions JSON,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create alumni table
CREATE TABLE alumni (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    country_code VARCHAR(10) DEFAULT '+91',
    phone_number VARCHAR(20),
    address TEXT,
    college VARCHAR(50) DEFAULT 'mvsr',
    department VARCHAR(100),
    passout_year INT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_bio TEXT,
    profile_company VARCHAR(255),
    profile_role VARCHAR(255),
    profile_experience_years INT DEFAULT 0,
    profile_industry VARCHAR(100),
    profile_location VARCHAR(255),
    profile_website VARCHAR(255),
    profile_skills JSON,
    profile_achievements JSON,
    profile_interests JSON,
    profile_image VARCHAR(500),
    social_linkedin VARCHAR(500),
    social_github VARCHAR(500),
    social_twitter VARCHAR(500),
    social_facebook VARCHAR(500),
    preferences_email_notifications BOOLEAN DEFAULT TRUE,
    preferences_push_notifications BOOLEAN DEFAULT TRUE,
    preferences_show_email BOOLEAN DEFAULT TRUE,
    preferences_show_phone BOOLEAN DEFAULT TRUE,
    preferences_show_profile BOOLEAN DEFAULT TRUE,
    preferences_allow_messages BOOLEAN DEFAULT TRUE,
    preferences_show_connections BOOLEAN DEFAULT TRUE,
    preferences_theme VARCHAR(20) DEFAULT 'light',
    preferences_language VARCHAR(10) DEFAULT 'en',
    preferences_timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_roll_number (roll_number),
    INDEX idx_department (department),
    INDEX idx_passout_year (passout_year),
    INDEX idx_is_active (is_active),
    INDEX idx_is_verified (is_verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(255),
    organizer VARCHAR(255),
    category VARCHAR(100),
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_date (event_date),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create news table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author VARCHAR(255),
    category VARCHAR(100),
    image_url VARCHAR(500),
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_published (is_published),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    company VARCHAR(255),
    location VARCHAR(255),
    salary_range VARCHAR(100),
    job_type VARCHAR(50),
    experience_required VARCHAR(100),
    skills_required JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active),
    INDEX idx_company (company)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create gallery table
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    category VARCHAR(100),
    tags JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create a user_type mapping table for authentication
CREATE TABLE user_credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_type ENUM('admin', 'alumni') NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    FOREIGN KEY (user_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES alumni(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create a view for unified user queries
CREATE VIEW all_users AS
SELECT 
    id, first_name, last_name, email, 'admin' as user_type, 
    phone_number, address, department, is_active, 
    profile_bio, last_login, created_at, updated_at,
    NULL as roll_number, NULL as passout_year,
    NULL as profile_company, NULL as profile_role,
    NULL as profile_experience_years, NULL as profile_industry,
    NULL as profile_location, NULL as profile_website,
    NULL as profile_skills, NULL as profile_achievements,
    NULL as profile_interests, NULL as profile_image,
    NULL as social_linkedin, NULL as social_github,
    NULL as social_twitter, NULL as social_facebook,
    NULL as preferences_email_notifications,
    NULL as preferences_push_notifications,
    NULL as preferences_show_email,
    NULL as preferences_show_phone,
    NULL as preferences_show_profile,
    NULL as preferences_allow_messages,
    NULL as preferences_show_connections,
    NULL as preferences_theme, NULL as preferences_language,
    NULL as preferences_timezone
FROM admins

UNION ALL

SELECT 
    id, first_name, last_name, email, 'alumni' as user_type,
    phone_number, address, department, is_active,
    profile_bio, last_login, created_at, updated_at,
    roll_number, passout_year, profile_company, profile_role,
    profile_experience_years, profile_industry, profile_location,
    profile_website, profile_skills, profile_achievements,
    profile_interests, profile_image, social_linkedin,
    social_github, social_twitter, social_facebook,
    preferences_email_notifications, preferences_push_notifications,
    preferences_show_email, preferences_show_phone,
    preferences_show_profile, preferences_allow_messages,
    preferences_show_connections,
    preferences_theme, preferences_language, preferences_timezone
FROM alumni;

-- Verification queries
SELECT 'Database setup completed successfully!' AS status;
SELECT 'MVSR Alumni Portal Database' AS database_name;
SELECT 'Shiva@56' AS password_used;
SELECT NOW() AS setup_completed_at;
SELECT 'Separate admin and alumni tables created' AS structure;
