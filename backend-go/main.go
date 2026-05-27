package main

import (
	"log"
	"os"

	"mvsr-backend/config"
	"mvsr-backend/controllers"
	"mvsr-backend/middleware"
	"mvsr-backend/routes"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	// Initialize configuration
	cfg := config.LoadConfig()

	// Initialize database (can be skipped in dev with SKIP_DB=true)
	if os.Getenv("SKIP_DB") == "true" {
		log.Println("SKIP_DB=true — skipping database connection (development mode)")
	} else {
		if err := config.ConnectDatabase(cfg); err != nil {
			log.Fatal("Failed to connect to database:", err)
		}
	}

	// Initialize Redis (skip when SKIP_DB is set)
	if os.Getenv("SKIP_DB") == "true" {
		log.Println("SKIP_DB=true — skipping Redis connection (development mode)")
	} else {
		if err := config.ConnectRedis(cfg); err != nil {
			log.Println("Redis connection failed, continuing without cache:", err)
		}
	}

	// Set Gin mode
	if cfg.Environment == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	// Create router
	router := gin.New()

	// Add middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.CORS(cfg))
	router.Use(middleware.RateLimit())

	// Initialize controllers
	authController := controllers.NewAuthController(cfg)
	userController := controllers.NewUserController(cfg)
	alumniController := controllers.NewAlumniController(cfg)
	eventController := controllers.NewEventController(cfg)
	jobController := controllers.NewJobController(cfg, config.GetDatabase())
	newsController := controllers.NewNewsController(cfg)
	galleryController := controllers.NewGalleryController(cfg)
	facultyController := controllers.NewFacultyController()
	helpdeskController := controllers.NewHelpdeskController()

	// Setup routes (pass config for middleware that needs it)
	routes.SetupRoutes(router, cfg, authController, userController, alumniController, eventController, jobController, newsController, galleryController, facultyController, helpdeskController)

	// Start server
	port := cfg.Port
	if port == "" {
		port = "8082" // Changed from 8081 to avoid port conflict
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("Environment: %s", cfg.Environment)

	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
