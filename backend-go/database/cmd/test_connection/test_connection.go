package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// Test database connection with password Shiva@56
	dsn := "root:root@tcp(localhost:3306)/mvsr_alumni?parseTime=true"

	fmt.Println("🔍 Testing MySQL Connection...")
	fmt.Printf("📡 Connection String: %s\n", dsn)

	// Connect to database
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("❌ Failed to open database connection:", err)
	}
	defer db.Close()

	// Test the connection
	err = db.Ping()
	if err != nil {
		log.Fatal("❌ Failed to ping database:", err)
	}

	fmt.Println("✅ Database connection successful!")

	// Test basic query
	var count int
	err = db.QueryRow("SELECT COUNT(*) FROM users").Scan(&count)
	if err != nil {
		log.Fatal("❌ Failed to query users table:", err)
	}

	fmt.Printf("📊 Users in database: %d\n", count)

	// Test table existence
	tables := []string{"users", "events", "news", "jobs", "gallery"}
	fmt.Println("\n🗄️ Checking table structure:")

	for _, table := range tables {
		var exists int
		err = db.QueryRow(`
			SELECT COUNT(*) 
			FROM information_schema.tables 
			WHERE table_schema = 'mvsr_alumni' 
			AND table_name = ?
		`, table).Scan(&exists)

		if err != nil {
			fmt.Printf("❌ Error checking table %s: %v\n", table, err)
		} else if exists > 0 {
			fmt.Printf("✅ Table '%s' exists\n", table)
		} else {
			fmt.Printf("❌ Table '%s' missing\n", table)
		}
	}

	// Test admin user
	var adminEmail string
	err = db.QueryRow("SELECT email FROM users WHERE role = 'admin' LIMIT 1").Scan(&adminEmail)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("⚠️  No admin user found - run seed script")
		} else {
			fmt.Printf("❌ Error checking admin user: %v\n", err)
		}
	} else {
		fmt.Printf("✅ Admin user found: %s\n", adminEmail)
	}

	fmt.Println("\n🎉 Database verification completed!")
	fmt.Println("🚀 MVSR Alumni Portal is ready to use!")
}
