package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

type AlumniSeed struct {
	FirstName       string   `json:"firstName"`
	LastName        string   `json:"lastName"`
	Email           string   `json:"email"`
	Password        string   `json:"password"`
	RollNumber      string   `json:"rollNumber"`
	CountryCode     string   `json:"countryCode"`
	PhoneNumber     string   `json:"phoneNumber"`
	Address         string   `json:"address"`
	College         string   `json:"college"`
	Department      string   `json:"department"`
	PassoutYear     int      `json:"passoutYear"`
	Role            string   `json:"role"`
	Company         string   `json:"company"`
	Experience      int      `json:"experience"`
	RoleDescription string   `json:"roleDescription"`
	Industry        string   `json:"industry"`
	Skills          []string `json:"skills"`
	Bio             string   `json:"bio"`
	Image           string   `json:"image"`
}

func main() {
	dsn := "root:Shiva@56@tcp(localhost:3306)/mvsr_alumni?parseTime=true"
	fmt.Println("📡 Connecting to MySQL for Alumni Seeding...")

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("❌ Failed to open database:", err)
	}
	defer db.Close()

	if err = db.Ping(); err != nil {
		log.Fatal("❌ Failed to ping database:", err)
	}
	fmt.Println("✅ Database connection successful!")

	// 1. Delete existing alumni to avoid duplicates
	fmt.Println("🗑️ Clearing existing alumni users...")
	_, err = db.Exec("DELETE FROM users WHERE role = 'alumni'")
	if err != nil {
		log.Fatal("❌ Failed to clear existing alumni users:", err)
	}

	alumniList := []AlumniSeed{
		{
			FirstName:       "Satya",
			LastName:        "Nadella",
			Email:           "satya.nadella@microsoft.com",
			Password:        "password123",
			RollNumber:      "160786733001",
			CountryCode:     "+1",
			PhoneNumber:     "9876543201",
			Address:         "Redmond, Washington, USA",
			College:         "mvsr",
			Department:      "Computer Science Engineering",
			PassoutYear:     1990,
			Role:            "alumni",
			Company:         "Microsoft",
			Experience:      34,
			RoleDescription: "Chief Executive Officer (CEO)",
			Industry:        "Information Technology",
			Skills:          []string{"Leadership", "Cloud Computing", "Business Strategy", "Product Innovation", "Enterprise Software"},
			Bio:             "CEO of Microsoft. Passionate about empowering every person and every organization on the planet to achieve more through technology and innovation.",
			Image:           "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
		},
		{
			FirstName:       "Vikram",
			LastName:        "Dev",
			Email:           "vikram.dev@google.com",
			Password:        "password123",
			RollNumber:      "160715733002",
			CountryCode:     "+91",
			PhoneNumber:     "9876543202",
			Address:         "Gachibowli, Hyderabad, India",
			College:         "mvsr",
			Department:      "Computer Science Engineering",
			PassoutYear:     2019,
			Role:            "alumni",
			Company:         "Google",
			Experience:      5,
			RoleDescription: "Senior Software Engineer",
			Industry:        "Software Development",
			Skills:          []string{"Go", "Kubernetes", "System Design", "Distributed Systems", "C++"},
			Bio:             "Senior Software Engineer in the Google Cloud Platform group, specializing in Kubernetes orchestration and distributed file storage solutions.",
			Image:           "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
		},
		{
			FirstName:       "Ananya",
			LastName:        "Reddy",
			Email:           "ananya.r@amazon.com",
			Password:        "password123",
			RollNumber:      "160716737024",
			CountryCode:     "+91",
			PhoneNumber:     "9876543203",
			Address:         "Begumpet, Hyderabad, India",
			College:         "mvsr",
			Department:      "Information Technology",
			PassoutYear:     2020,
			Role:            "alumni",
			Company:         "Amazon",
			Experience:      4,
			RoleDescription: "Data Scientist",
			Industry:        "E-commerce",
			Skills:          []string{"Python", "Machine Learning", "SQL", "AWS", "Natural Language Processing"},
			Bio:             "Data Scientist at Amazon Web Services (AWS). Building next-generation recommendation algorithms using neural networks and deep learning.",
			Image:           "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
		},
		{
			FirstName:       "Siddharth",
			LastName:        "Sen",
			Email:           "sid.sen@apple.com",
			Password:        "password123",
			RollNumber:      "160714735045",
			CountryCode:     "+1",
			PhoneNumber:     "9876543204",
			Address:         "Cupertino, California, USA",
			College:         "mvsr",
			Department:      "Electronics and Communication Engineering",
			PassoutYear:     2018,
			Role:            "alumni",
			Company:         "Apple",
			Experience:      6,
			RoleDescription: "Hardware Systems Engineer",
			Industry:        "Consumer Electronics",
			Skills:          []string{"VLSI", "SystemVerilog", "Embedded Systems", "MATLAB", "Hardware Architecture"},
			Bio:             "Hardware Systems Engineer at Apple, contributing to the verification and architecture design of next-generation Apple Silicon SoC chipsets.",
			Image:           "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
		},
		{
			FirstName:       "Meghana",
			LastName:        "Rao",
			Email:           "meghana.rao@meta.com",
			Password:        "password123",
			RollNumber:      "160717733054",
			CountryCode:     "+91",
			PhoneNumber:     "9876543205",
			Address:         "Jubilee Hills, Hyderabad, India",
			College:         "mvsr",
			Department:      "Computer Science Engineering",
			PassoutYear:     2021,
			Role:            "alumni",
			Company:         "Meta",
			Experience:      3,
			RoleDescription: "Frontend Developer",
			Industry:        "Social Media",
			Skills:          []string{"React", "JavaScript", "TypeScript", "GraphQL", "TailwindCSS"},
			Bio:             "Frontend Engineer at Meta. Passionate about building modular, accessible, and high-performance user interfaces for Instagram web portals.",
			Image:           "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
		},
		{
			FirstName:       "Rahul",
			LastName:        "Deshmukh",
			Email:           "rahul.d@netflix.com",
			Password:        "password123",
			RollNumber:      "160713734012",
			CountryCode:     "+1",
			PhoneNumber:     "9876543206",
			Address:         "Los Gatos, California, USA",
			College:         "mvsr",
			Department:      "Electrical and Electronics Engineering",
			PassoutYear:     2017,
			Role:            "alumni",
			Company:         "Netflix",
			Experience:      7,
			RoleDescription: "DevOps Lead",
			Industry:        "Entertainment",
			Skills:          []string{"Docker", "Terraform", "Jenkins", "AWS", "Linux", "SRE"},
			Bio:             "SRE DevOps Lead at Netflix, managing massive auto-scaling media streaming microservices on AWS cloud platforms.",
			Image:           "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
		},
	}

	fmt.Println("🚀 Seeding high-quality alumni profiles...")
	for _, alumni := range alumniList {
		// Hash password with standard cost
		hashedPasswordBytes, err := bcrypt.GenerateFromPassword([]byte(alumni.Password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatalf("❌ Failed to hash password for %s: %v", alumni.FirstName, err)
		}
		hashedPassword := string(hashedPasswordBytes)

		// Convert skills to JSON array
		skillsJSON, err := json.Marshal(alumni.Skills)
		if err != nil {
			skillsJSON = []byte("[]")
		}

		query := `
			INSERT INTO users (
				first_name, last_name, email, password, roll_number, country_code, 
				phone_number, address, college, department, passout_year, role, 
				is_verified, is_active, profile_bio, profile_company, profile_role, 
				profile_experience_years, profile_industry, profile_skills, profile_image,
				created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`

		now := time.Now()
		_, err = db.Exec(query,
			alumni.FirstName, alumni.LastName, alumni.Email, hashedPassword, alumni.RollNumber, alumni.CountryCode,
			alumni.PhoneNumber, alumni.Address, alumni.College, alumni.Department, alumni.PassoutYear, alumni.Role,
			true, true, alumni.Bio, alumni.Company, alumni.RoleDescription,
			alumni.Experience, alumni.Industry, string(skillsJSON), alumni.Image,
			now, now,
		)

		if err != nil {
			log.Printf("❌ Failed to insert alumni %s %s: %v\n", alumni.FirstName, alumni.LastName, err)
		} else {
			fmt.Printf("✅ Seeded: %s %s at %s (%s)\n", alumni.FirstName, alumni.LastName, alumni.Company, alumni.RoleDescription)
		}
	}

	fmt.Println("\n🎉 Alumni database seeding completed successfully!")
}
