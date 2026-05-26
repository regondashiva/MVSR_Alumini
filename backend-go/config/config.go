package config

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/go-redis/redis/v8"
	_ "github.com/go-sql-driver/mysql"
	"golang.org/x/crypto/bcrypt"
)

type Config struct {
	Environment string
	Port        string
	MySQLURI    string
	RedisURL    string
	JWTSecret   string
	FrontendURL string

	// OAuth Config
	GoogleClientID     string
	GoogleClientSecret string
	LinkedInClientID   string
	LinkedInSecret     string
	FacebookClientID   string
	FacebookSecret     string

	// Email Config
	SMTPHost     string
	SMTPPort     string
	SMTPUser     string
	SMTPPassword string

	// File Upload
	CloudinaryCloudName string
	CloudinaryAPIKey    string
	CloudinaryAPISecret string
}

var (
	DB    *sql.DB
	Redis *redis.Client
)

func LoadConfig() *Config {
	return &Config{
		Environment: getEnv("NODE_ENV", "development"),
		Port:        getEnv("PORT", "8082"),
		MySQLURI:    getEnv("MYSQL_URI", "root:root@tcp(localhost:3306)/mvsr_alumni?parseTime=true"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),
		JWTSecret:   getEnv("JWT_SECRET", "your-super-secret-jwt-key"),
		FrontendURL: getEnv("FRONTEND_URL", "http://localhost:3000"),

		// OAuth
		GoogleClientID:     getEnv("GOOGLE_CLIENT_ID", "demo-google-client-id"),
		GoogleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", "demo-google-client-secret"),
		LinkedInClientID:   getEnv("LINKEDIN_CLIENT_ID", "demo-linkedin-client-id"),
		LinkedInSecret:     getEnv("LINKEDIN_SECRET", "demo-linkedin-secret"),
		FacebookClientID:   getEnv("FACEBOOK_CLIENT_ID", "demo-facebook-client-id"),
		FacebookSecret:     getEnv("FACEBOOK_SECRET", "demo-facebook-secret"),

		// Email
		SMTPHost:     getEnv("SMTP_HOST", "smtp.gmail.com"),
		SMTPPort:     getEnv("SMTP_PORT", "587"),
		SMTPUser:     getEnv("SMTP_USER", ""),
		SMTPPassword: getEnv("SMTP_PASSWORD", ""),

		// Cloudinary
		CloudinaryCloudName: getEnv("CLOUDINARY_CLOUD_NAME", ""),
		CloudinaryAPIKey:    getEnv("CLOUDINARY_API_KEY", ""),
		CloudinaryAPISecret: getEnv("CLOUDINARY_API_SECRET", ""),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func ConnectDatabase(cfg *Config) error {
	var err error

	// Open MySQL connection
	DB, err = sql.Open("mysql", cfg.MySQLURI)
	if err != nil {
		return fmt.Errorf("failed to connect to MySQL: %w", err)
	}

	// Test the connection
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := DB.PingContext(ctx); err != nil {
		return fmt.Errorf("failed to ping MySQL: %w", err)
	}

	// Set connection pool settings
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(25)
	DB.SetConnMaxLifetime(5 * time.Minute)

	log.Println("Connected to MySQL successfully")
	return nil
}

func ConnectRedis(cfg *Config) error {
	opt, err := redis.ParseURL(cfg.RedisURL)
	if err != nil {
		return fmt.Errorf("failed to parse Redis URL: %w", err)
	}

	Redis = redis.NewClient(opt)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Ping Redis
	if err := Redis.Ping(ctx).Err(); err != nil {
		return fmt.Errorf("failed to connect to Redis: %w", err)
	}

	log.Println("Connected to Redis successfully")
	return nil
}

func GetDatabase() *sql.DB {
	return DB
}

func GetRedis() *redis.Client {
	return Redis
}

// HashPassword hashes a password using bcrypt
func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return string(hashedPassword), nil
}

// CheckPassword compares a password with its hash
func CheckPassword(password, hashedPassword string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
