package routes

import (
	"github.com/gin-gonic/gin"

	"mvsr-backend/controllers"
	"mvsr-backend/middleware"
)

// SetupRoutes configures all the routes for the application
func SetupRoutes(
	router *gin.Engine,
	authController *controllers.AuthController,
	userController *controllers.UserController,
	alumniController *controllers.AlumniController,
	eventController *controllers.EventController,
	jobController *controllers.JobController,
	newsController *controllers.NewsController,
	galleryController *controllers.GalleryController,
) {
	// Health check
	router.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"status":    "OK",
			"timestamp": gin.H{},
			"uptime":    gin.H{},
		})
	})

	// API v1 routes
	v1 := router.Group("/api/v1")
	{
		// Public routes
		public := v1.Group("")
		{
			// Authentication routes
			auth := public.Group("/auth")
			{
				auth.POST("/register", authController.Register)
				auth.POST("/login", authController.Login)
				auth.POST("/forgot-password", authController.ForgotPassword)
				auth.POST("/reset-password", authController.ResetPassword)
				auth.POST("/verify-email/:token", authController.VerifyEmail)
				auth.GET("/google", authController.GoogleOAuth)
				auth.GET("/linkedin", authController.LinkedInOAuth)
				auth.GET("/facebook", authController.FacebookOAuth)
			}

			// Public content routes
			public.GET("/news", newsController.GetNews)
			public.GET("/news/:id", newsController.GetNews)
			public.GET("/events", eventController.GetEvents)
			public.GET("/events/:id", eventController.GetEvent)
			public.GET("/jobs", jobController.GetJobs)
			public.GET("/jobs/:id", jobController.GetJob)
			public.GET("/gallery", galleryController.GetGallery)
			public.GET("/gallery/:id", galleryController.GetGalleryItem)

			// Public user statistics
			public.GET("/users/statistics", userController.GetUsersStatistics)
		}

		// Protected routes
		protected := v1.Group("")
		protected.Use(middleware.Auth(nil)) // Will be configured with proper config
		{
			// User routes
			user := protected.Group("/users")
			{
				user.GET("/profile", authController.GetProfile)
				user.PUT("/profile", authController.UpdateProfile)
				user.POST("/change-password", authController.ChangePassword)
				user.POST("/logout", authController.Logout)
				user.POST("/refresh-token", authController.RefreshToken)
			}

			// Event routes
			events := protected.Group("/events")
			{
				events.POST("", eventController.CreateEvent)
				events.PUT("/:id", eventController.UpdateEvent)
				events.DELETE("/:id", eventController.DeleteEvent)
				events.POST("/:id/register", eventController.RegisterForEvent)
				events.POST("/:id/unregister", eventController.UnregisterFromEvent)
				events.GET("/my", eventController.GetMyEvents)
				events.GET("/stats", eventController.GetEventStats)
			}

			// News routes
			news := protected.Group("/news")
			{
				news.POST("", newsController.CreateNews)
				news.PUT("/:id", newsController.UpdateNews)
				news.DELETE("/:id", newsController.DeleteNews)
				news.POST("/:id/comments", newsController.CreateComment)
				news.PUT("/:id/comments/:commentId", newsController.UpdateComment)
				news.DELETE("/:id/comments/:commentId", newsController.DeleteComment)
				news.POST("/:id/like", newsController.LikeNews)
				news.POST("/:id/unlike", newsController.UnlikeNews)
			}

			// Job routes
			jobs := protected.Group("/jobs")
			{
				jobs.POST("", jobController.CreateJob)
				jobs.PUT("/:id", jobController.UpdateJob)
				jobs.DELETE("/:id", jobController.DeleteJob)
				jobs.POST("/:id/apply", jobController.ApplyJob)
				jobs.GET("/my", jobController.GetMyJobs)
				jobs.GET("/applications", jobController.GetJobApplications)
			}

			// Gallery routes
			gallery := protected.Group("/gallery")
			{
				gallery.POST("", galleryController.CreateGalleryItem)
				gallery.PUT("/:id", galleryController.UpdateGalleryItem)
				gallery.DELETE("/:id", galleryController.DeleteGalleryItem)
				gallery.POST("/:id/like", galleryController.LikeGalleryItem)
				gallery.POST("/:id/unlike", galleryController.UnlikeGalleryItem)
			}

			// Alumni routes
			alumni := protected.Group("/alumni")
			{
				alumni.GET("/directory", alumniController.GetApprovedAlumni)
				alumni.GET("/search", alumniController.SearchAlumni)
				alumni.GET("/:id", alumniController.GetAlumniProfile)
				alumni.PUT("/:id", alumniController.UpdateAlumniProfile)
				alumni.POST("/:id/connect", alumniController.ConnectWithAlumni)
				alumni.POST("/:id/disconnect", alumniController.DisconnectFromAlumni)
				alumni.GET("/connections", alumniController.GetConnections)
				alumni.GET("/stats", alumniController.GetAlumniStats)
			}
		}

		// Admin routes
		admin := v1.Group("/admin")
		admin.Use(middleware.AdminAuth(nil)) // Will be configured with proper config
		{
			admin.GET("/users", userController.GetAllUsers)
			admin.GET("/users/:id", userController.GetUser)
			admin.PUT("/users/:id", userController.UpdateUser)
			admin.DELETE("/users/:id", userController.DeleteUser)
			admin.POST("/users/:id/verify", userController.VerifyUser)
			admin.POST("/users/:id/deactivate", userController.DeactivateUser)
			admin.POST("/users/:id/activate", userController.ActivateUser)

			// Role-based user endpoints
			admin.GET("/users/role/:role", userController.GetUsersByRole)
			admin.GET("/admins", userController.GetAdmins)
			admin.GET("/students", userController.GetStudents)
			admin.GET("/alumni-users", userController.GetAlumniUsers)
			admin.GET("/users/statistics", userController.GetUsersStatistics)

			// Registration approval endpoints
			admin.GET("/pending-registrations", userController.GetPendingRegistrations)
			admin.POST("/approve-registration/:id", userController.ApproveRegistration)
			admin.POST("/reject-registration/:id", userController.RejectRegistration)

			admin.GET("/stats", userController.GetSystemStats)
			admin.GET("/logs", userController.GetSystemLogs)
			admin.POST("/backup", userController.CreateBackup)
			admin.POST("/restore", userController.RestoreBackup)
		}
	}

	// Legacy API routes (for backward compatibility)
	legacy := router.Group("/api")
	{
		// Authentication
		legacy.POST("/auth/register", authController.Register)
		legacy.POST("/auth/login", authController.Login)
		legacy.POST("/auth/logout", authController.Logout)

		// Users
		legacy.GET("/users/profile", authController.GetProfile)
		legacy.PUT("/users/profile", authController.UpdateProfile)

		// Alumni Directory
		legacy.GET("/alumni/approved", alumniController.GetApprovedAlumni)
		legacy.GET("/alumni/search", alumniController.SearchAlumni)

		// Events
		legacy.GET("/events", eventController.GetEvents)
		legacy.GET("/events/:id", eventController.GetEvent)

		// News
		legacy.GET("/news", newsController.GetNews)
		legacy.GET("/news/:id", newsController.GetNews)

		// Jobs
		legacy.GET("/jobs", jobController.GetJobs)
		legacy.GET("/jobs/:id", jobController.GetJob)

		// Gallery
		legacy.GET("/gallery", galleryController.GetGallery)
		legacy.GET("/gallery/:id", galleryController.GetGalleryItem)
	}
}
