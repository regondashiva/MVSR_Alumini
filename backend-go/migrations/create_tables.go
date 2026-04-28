package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// Connect to MySQL without database name
	db, err := sql.Open("mysql", "root:Shiva@56@tcp(localhost:3306)/")
	if err != nil {
		log.Fatal("Failed to connect to MySQL:", err)
	}
	defer db.Close()

	// Create database if it doesn't exist
	_, err = db.Exec("CREATE DATABASE IF NOT EXISTS mvsr_alumni")
	if err != nil {
		log.Fatal("Failed to create database:", err)
	}

	// Switch to the database
	_, err = db.Exec("USE mvsr_alumni")
	if err != nil {
		log.Fatal("Failed to switch to database:", err)
	}

	// Create users table
	usersTable := `
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
		last_login TIMESTAMP NULL
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

	_, err = db.Exec(usersTable)
	if err != nil {
		log.Fatal("Failed to create users table:", err)
	}

	// Create events table
	eventsTable := `
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
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

	_, err = db.Exec(eventsTable)
	if err != nil {
		log.Fatal("Failed to create events table:", err)
	}

	// Create news table
	newsTable := `
	CREATE TABLE IF NOT EXISTS news (
		id INT AUTO_INCREMENT PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		content TEXT,
		author VARCHAR(255),
		category VARCHAR(100),
		image_url VARCHAR(500),
		is_published BOOLEAN DEFAULT TRUE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

	_, err = db.Exec(newsTable)
	if err != nil {
		log.Fatal("Failed to create news table:", err)
	}

	// Create jobs table
	jobsTable := `
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
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

	_, err = db.Exec(jobsTable)
	if err != nil {
		log.Fatal("Failed to create jobs table:", err)
	}

	// Create gallery table
	galleryTable := `
	CREATE TABLE IF NOT EXISTS gallery (
		id INT AUTO_INCREMENT PRIMARY KEY,
		title VARCHAR(255) NOT NULL,
		description TEXT,
		image_url VARCHAR(500) NOT NULL,
		category VARCHAR(100),
		tags JSON,
		is_active BOOLEAN DEFAULT TRUE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

	_, err = db.Exec(galleryTable)
	if err != nil {
		log.Fatal("Failed to create gallery table:", err)
	}

	fmt.Println("✅ Database schema created successfully!")
	fmt.Println("📊 Tables created:")
	fmt.Println("   - users")
	fmt.Println("   - events")
	fmt.Println("   - news")
	fmt.Println("   - jobs")
	fmt.Println("   - gallery")
	fmt.Println("🎯 Database: mvsr_alumni")
	fmt.Println("🔧 MySQL connection: localhost:3306")
}
