-- Fix the user_credentials table to properly handle both admin and alumni references
USE mvsr_alumni;

-- Drop the problematic table
DROP TABLE IF EXISTS user_credentials;

-- Create a corrected user_credentials table without conflicting foreign keys
CREATE TABLE user_credentials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_type ENUM('admin', 'alumni') NOT NULL,
    admin_id INT NULL,
    alumni_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type),
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
    FOREIGN KEY (alumni_id) REFERENCES alumni(id) ON DELETE CASCADE,
    CHECK (
        (user_type = 'admin' AND admin_id IS NOT NULL AND alumni_id IS NULL) OR
        (user_type = 'alumni' AND alumni_id IS NOT NULL AND admin_id IS NULL)
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recreate the all_users view
DROP VIEW IF EXISTS all_users;

CREATE VIEW all_users AS
SELECT 
    a.id, a.first_name, a.last_name, a.email, 'admin' as user_type, 
    a.phone_number, a.address, a.department, a.is_active, 
    a.profile_bio, a.last_login, a.created_at, a.updated_at,
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
FROM admins a

UNION ALL

SELECT 
    al.id, al.first_name, al.last_name, al.email, 'alumni' as user_type,
    al.phone_number, al.address, al.department, al.is_active,
    al.profile_bio, al.last_login, al.created_at, al.updated_at,
    al.roll_number, al.passout_year, al.profile_company, al.profile_role,
    al.profile_experience_years, al.profile_industry, al.profile_location,
    al.profile_website, al.profile_skills, al.profile_achievements,
    al.profile_interests, al.profile_image, al.social_linkedin,
    al.social_github, al.social_twitter, al.social_facebook,
    al.preferences_email_notifications, al.preferences_push_notifications,
    al.preferences_show_email, al.preferences_show_phone,
    al.preferences_show_profile, al.preferences_allow_messages,
    al.preferences_show_connections,
    al.preferences_theme, al.preferences_language, al.preferences_timezone
FROM alumni al;

SELECT 'Fixed user_credentials table structure' AS status;
