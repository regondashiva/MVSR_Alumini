package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	dsn := "root:Shiva@56@tcp(localhost:3306)/mvsr_alumni?parseTime=true"
	fmt.Println("📡 Connecting to MySQL database...")

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("❌ Failed to open database:", err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("❌ Failed to ping database:", err)
	}
	fmt.Println("✅ Database connection successful!")

	// Create refresh_tokens table
	refreshTokensQuery := `
	CREATE TABLE IF NOT EXISTS refresh_tokens (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL,
		token VARCHAR(512) NOT NULL UNIQUE,
		expires_at DATETIME NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		CONSTRAINT fk_refresh_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
		INDEX idx_refresh_tokens_user_id (user_id),
		INDEX idx_refresh_tokens_token (token(255))
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

	fmt.Println("🛠️ Creating 'refresh_tokens' table...")
	_, err = db.Exec(refreshTokensQuery)
	if err != nil {
		log.Fatal("❌ Failed to create refresh_tokens table:", err)
	}
	fmt.Println("✅ 'refresh_tokens' table created successfully!")

	// Create password_reset_tokens table
	passwordResetQuery := `
	CREATE TABLE IF NOT EXISTS password_reset_tokens (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL,
		token VARCHAR(512) NOT NULL UNIQUE,
		expires_at DATETIME NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
		INDEX idx_password_reset_tokens_user_id (user_id),
		INDEX idx_password_reset_tokens_token (token(255))
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

	fmt.Println("🛠️ Creating 'password_reset_tokens' table...")
	_, err = db.Exec(passwordResetQuery)
	if err != nil {
		log.Fatal("❌ Failed to create password_reset_tokens table:", err)
	}
	fmt.Println("✅ 'password_reset_tokens' table created successfully!")

	fmt.Println("\n🎉 Database setup completed successfully!")
}
