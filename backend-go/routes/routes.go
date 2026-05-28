package routes

import (
	"github.com/gin-gonic/gin"

	"mvsr-backend/config"
	"mvsr-backend/controllers"
	"mvsr-backend/middleware"
)

// SetupRoutes configures all the routes for the application
func SetupRoutes(
	router *gin.Engine,
	cfg *config.Config,
	authController *controllers.AuthController,
	userController *controllers.UserController,
	alumniController *controllers.AlumniController,
	eventController *controllers.EventController,
	jobController *controllers.JobController,
	newsController *controllers.NewsController,
	galleryController *controllers.GalleryController,
	facultyController *controllers.FacultyController,
	helpdeskController *controllers.HelpdeskController,
	mentorshipController *controllers.MentorshipController,
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
		// ── Public routes ──────────────────────────────────────
		public := v1.Group("")
		{
			auth := public.Group("/auth")
			{
				auth.POST("/register", authController.Register)
				auth.POST("/login", authController.Login)
				// refresh-token and logout are PUBLIC — they work with the
				// refresh token in the body, not a Bearer access token
				auth.POST("/refresh-token", authController.RefreshToken)
				auth.POST("/logout", authController.Logout)
				auth.POST("/forgot-password", authController.ForgotPassword)
				auth.POST("/reset-password", authController.ResetPassword)
				auth.POST("/verify-email/:token", authController.VerifyEmail)
				auth.GET("/google", authController.GoogleOAuth)
				auth.GET("/linkedin", authController.LinkedInOAuth)
				auth.GET("/facebook", authController.FacebookOAuth)
			}

			// Public content
			public.GET("/news", newsController.GetNews)
			public.GET("/news/:id", newsController.GetNews)
			public.GET("/events", eventController.GetEvents)
			public.GET("/events/:id", eventController.GetEvent)
			public.GET("/jobs", jobController.GetJobs)
			public.GET("/jobs/:id", jobController.GetJob)
			public.GET("/gallery", galleryController.GetGallery)
			public.GET("/gallery/:id", galleryController.GetGalleryItem)
			public.GET("/users/statistics", userController.GetUsersStatistics)
			public.POST("/helpdesk/submit", helpdeskController.SubmitTicket)
		}

		// ── Protected routes (require valid access token) ──────
		protected := v1.Group("")
		protected.Use(middleware.Auth(cfg))
		{
			// User / profile
			user := protected.Group("/users")
			{
				user.GET("/profile", authController.GetProfile)
				user.PUT("/profile", authController.UpdateProfile)
				user.POST("/change-password", authController.ChangePassword)
				user.POST("/logout-all", authController.LogoutAll) // revoke all devices
			}

			// Helpdesk (user's own tickets)
			protected.GET("/helpdesk/my-tickets", helpdeskController.GetUserTickets)

			// Events
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

			// News
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

			// Jobs
			jobs := protected.Group("/jobs")
			{
				jobs.POST("", jobController.CreateJob)
				jobs.PUT("/:id", jobController.UpdateJob)
				jobs.DELETE("/:id", jobController.DeleteJob)
				jobs.POST("/:id/apply", jobController.ApplyJob)
				jobs.GET("/my", jobController.GetMyJobs)
				jobs.GET("/applications", jobController.GetJobApplications)
			}

			// Gallery
			gallery := protected.Group("/gallery")
			{
				gallery.POST("", galleryController.CreateGalleryItem)
				gallery.PUT("/:id", galleryController.UpdateGalleryItem)
				gallery.DELETE("/:id", galleryController.DeleteGalleryItem)
				gallery.POST("/:id/like", galleryController.LikeGalleryItem)
				gallery.POST("/:id/unlike", galleryController.UnlikeGalleryItem)
			}

			// Alumni
			alumni := protected.Group("/alumni")
			{
				alumni.GET("/directory", alumniController.GetApprovedAlumni)
				alumni.GET("/search", alumniController.SearchAlumni)
				alumni.GET("/:id", alumniController.GetAlumniProfile)
				alumni.PUT("/:id", alumniController.UpdateAlumniProfile)
				alumni.POST("/:id/connect", alumniController.ConnectWithAlumni)
				alumni.POST("/:id/disconnect", alumniController.DisconnectFromAlumni)
				alumni.GET("/connections", alumniController.GetConnections)
				alumni.PUT("/connections/:id", alumniController.RespondToConnection)
				alumni.GET("/stats", alumniController.GetAlumniStats)
			}

			// Mentorship
			mentorship := protected.Group("/mentorship")
			{
				mentorship.POST("/requests", mentorshipController.CreateMentorshipRequest)
				mentorship.GET("/requests", mentorshipController.GetMentorshipRequests)
			}

			// Faculty
			faculty := protected.Group("/faculty")
			{
				faculty.GET("/pending-users", facultyController.GetPendingUsers)
				faculty.POST("/verify-user/:id", facultyController.VerifyUser)
			}
		}

		// ── Admin routes ───────────────────────────────────────
		admin := v1.Group("/admin")
		admin.Use(middleware.AdminAuth(cfg))
		{
			admin.GET("/users", userController.GetAllUsers)
			admin.GET("/users/:id", userController.GetUser)
			admin.PUT("/users/:id", userController.UpdateUser)
			admin.DELETE("/users/:id", userController.DeleteUser)
			admin.POST("/users/:id/verify", userController.VerifyUser)
			admin.POST("/users/:id/deactivate", userController.DeactivateUser)
			admin.POST("/users/:id/activate", userController.ActivateUser)
			admin.GET("/users/role/:role", userController.GetUsersByRole)
			admin.GET("/admins", userController.GetAdmins)
			admin.GET("/students", userController.GetStudents)
			admin.GET("/alumni-users", userController.GetAlumniUsers)
			admin.GET("/users/statistics", userController.GetUsersStatistics)
			admin.GET("/pending-registrations", userController.GetPendingRegistrations)
			admin.POST("/approve-registration/:id", userController.ApproveRegistration)
			admin.POST("/reject-registration/:id", userController.RejectRegistration)
			// New approval endpoints (frontend expected names)
			admin.GET("/pending-approvals", userController.GetPendingRegistrations)
			admin.POST("/approve-user/:id", userController.ApproveRegistration)
			admin.POST("/reject-user/:id", userController.RejectRegistration)
			admin.GET("/stats", userController.GetSystemStats)
			admin.GET("/logs", userController.GetSystemLogs)
			admin.POST("/backup", userController.CreateBackup)
			admin.POST("/restore", userController.RestoreBackup)

			// Moderation & Helpdesk
			admin.GET("/jobs/pending", jobController.GetPendingJobs)
			admin.POST("/jobs/:id/approve", jobController.ApproveJob)
			admin.POST("/jobs/:id/reject", jobController.RejectJob)
			admin.GET("/events/pending", eventController.GetPendingEvents)
			admin.POST("/events/:id/approve", eventController.ApproveEvent)
			admin.POST("/events/:id/reject", eventController.RejectEvent)
			admin.GET("/helpdesk/tickets", helpdeskController.GetTickets)
			admin.POST("/helpdesk/tickets/:id/resolve", helpdeskController.ResolveTicket)
		}
	}

	// ── Legacy /api routes (backward compatibility) ─────────
	legacy := router.Group("/api")
	{
		legacy.POST("/auth/register", authController.Register)
		legacy.POST("/auth/login", authController.Login)
		legacy.POST("/auth/refresh-token", authController.RefreshToken)
		legacy.POST("/auth/logout", authController.Logout)
		legacy.POST("/auth/forgot-password", authController.ForgotPassword)
		legacy.POST("/auth/reset-password", authController.ResetPassword)
		legacy.GET("/users/profile", authController.GetProfile)
		legacy.PUT("/users/profile", authController.UpdateProfile)
		legacy.GET("/alumni/approved", alumniController.GetApprovedAlumni)
		legacy.GET("/alumni/search", alumniController.SearchAlumni)
		legacy.GET("/events", eventController.GetEvents)
		legacy.GET("/events/:id", eventController.GetEvent)
		legacy.GET("/news", newsController.GetNews)
		legacy.GET("/news/:id", newsController.GetNews)
		legacy.GET("/jobs", jobController.GetJobs)
		legacy.GET("/jobs/:id", jobController.GetJob)
		legacy.GET("/gallery", galleryController.GetGallery)
		legacy.GET("/gallery/:id", galleryController.GetGalleryItem)
		legacy.POST("/helpdesk/submit", helpdeskController.SubmitTicket)

		// Legacy Connections and Mentorship (authenticated)
		legacyAuth := legacy.Group("")
		legacyAuth.Use(middleware.Auth(cfg))
		{
			legacyAuth.POST("/connections/request", alumniController.ConnectWithAlumni)
			legacyAuth.POST("/mentorship/request", mentorshipController.CreateMentorshipRequest)
		}
	}
}
