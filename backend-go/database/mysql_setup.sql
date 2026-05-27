-- MVSR Alumni Portal - MySQL Database Setup Script
-- Password: Shiva@56

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS mvsr_alumni 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE mvsr_alumni;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
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
    role ENUM('admin', 'alumni', 'student', 'faculty') NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    approved_by INT,
    approved_at TIMESTAMP NULL,
    approval_notes TEXT,
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
    INDEX idx_role (role),
    INDEX idx_is_active (is_active),
    INDEX idx_approval_status (approval_status),
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
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

-- Insert sample admin user (password: admin123 hashed with bcrypt)
INSERT INTO users (
    first_name, last_name, email, password, roll_number, country_code, 
    phone_number, address, college, department, passout_year, role, 
    is_verified, is_active, approval_status, approved_by, approved_at, approval_notes, profile_bio, profile_company, profile_role,
    profile_experience_years, profile_industry, profile_location,
    profile_website, profile_skills, profile_achievements,
    profile_interests, profile_image, social_linkedin, social_github,
    social_twitter, social_facebook, preferences_email_notifications,
    preferences_push_notifications, preferences_show_email,
    preferences_show_phone, preferences_show_profile,
    preferences_allow_messages, preferences_show_connections,
    preferences_theme, preferences_language, preferences_timezone
) VALUES (
    'Admin', 'User', 'admin@mvsr.edu.in', 
    '$2b$12$ZnYeAMBsx.rDpjQsFG9WTuWNOqe9c0BK.pt1sxQQMFU5W34PUe7QG',
    'ADMIN001', '+91', '9876543200', 'MVSR Engineering College, Hyderabad', 
    'mvsr', 'Administration', 2020, 'admin', TRUE, TRUE, 'approved', NULL, NOW(), 'Pre-seeded admin account',
    'System Administrator for MVSR Alumni Portal', 'MVSR Engineering College',
    'System Administrator', 5, 'Education', 'Hyderabad, Telangana',
    'https://mvsrec.edu.in',
    JSON_ARRAY('System Administration', 'Database Management', 'Network Security'),
    JSON_ARRAY('Best IT Administrator 2023', 'System Excellence Award'),
    JSON_ARRAY('Technology', 'Education', 'Innovation'),
    'https://ui-avatars.com/api/?name=Admin+User&background=DC2626&color=fff',
    'https://linkedin.com/in/mvsr-admin', 'https://github.com/mvsr-admin',
    '', '', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
    'light', 'en', 'Asia/Kolkata'
) ON DUPLICATE KEY UPDATE email = email;

-- Create a user for testing database connection
SELECT 'Database setup completed successfully!' AS status;
SELECT 'MVSR Alumni Portal Database' AS database_name;
SELECT 'Shiva@56' AS password_used;
SELECT NOW() AS setup_completed_at;
