package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"

	"mvsr-backend/config"
	"mvsr-backend/middleware"
	"mvsr-backend/models"
)

type AuthController struct {
	cfg *config.Config
	db  *sql.DB
}

func NewAuthController(cfg *config.Config) *AuthController {
	return &AuthController{
		cfg: cfg,
		db:  config.GetDatabase(),
	}
}

// Register handles user registration
func (ac *AuthController) Register(c *gin.Context) {
	var req models.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body", "errors": err.Error()})
		return
	}

	// Validate input
	if err := middleware.ValidateStruct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Validation failed", "errors": err})
		return
	}

	// Check if user already exists
	var existingEmail string
	err := ac.db.QueryRow("SELECT email FROM users WHERE email = ?", req.Email).Scan(&existingEmail)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"success": false, "message": "User with this email already exists"})
		return
	}

	var existingRollNumber string
	err = ac.db.QueryRow("SELECT roll_number FROM users WHERE roll_number = ?", req.RollNumber).Scan(&existingRollNumber)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"success": false, "message": "User with this roll number already exists"})
		return
	}

	// Hash password
	hashedPassword, err := config.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to hash password"})
		return
	}

	// Create user with SQL INSERT
	query := `
		INSERT INTO users (
			first_name, last_name, email, password, roll_number, country_code, 
			phone_number, address, college, department, passout_year, role, 
			is_verified, is_active, profile_company, profile_role, 
			profile_experience_years, profile_industry, profile_skills,
			created_at, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	now := time.Now()
	isVerified := req.Role == "admin" // Auto-verify admins

	// Convert skills to JSON
	skills := models.JSONStringSlice{req.Skills}

	_, err = ac.db.Exec(query,
		req.FirstName, req.LastName, req.Email, hashedPassword, req.RollNumber, req.CountryCode,
		req.PhoneNumber, req.Address, req.College, req.Department, req.PassoutYear, req.Role,
		isVerified, true, req.Company, req.RoleDescription,
		req.Experience, req.Industry, skills,
		now, now,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create user", "error": err.Error()})
		return
	}

	// Get the created user ID for response
	var userID int
	err = ac.db.QueryRow("SELECT id FROM users WHERE email = ?", req.Email).Scan(&userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to retrieve created user"})
		return
	}

	// Create user response object
	user := models.User{
		ID:          userID,
		FirstName:   req.FirstName,
		LastName:    req.LastName,
		Email:       req.Email,
		RollNumber:  req.RollNumber,
		CountryCode: req.CountryCode,
		PhoneNumber: req.PhoneNumber,
		Address:     req.Address,
		College:     req.College,
		Department:  req.Department,
		PassoutYear: req.PassoutYear,
		Role:        req.Role,
		IsVerified:  isVerified,
		IsActive:    true,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// Generate JWT token
	token, err := ac.generateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "User registered successfully",
		"data": gin.H{
			"user":  user,
			"token": token,
		},
	})
}

// Login handles user login
func (ac *AuthController) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body", "errors": err.Error()})
		return
	}

	// Validate input
	if err := middleware.ValidateStruct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Validation failed", "errors": err.Error()})
		return
	}

	// Find user by roll number
	var user models.User
	query := `
		SELECT id, first_name, last_name, email, password, roll_number, country_code,
		       phone_number, address, college, department, passout_year, role,
		       is_verified, is_active, profile_company, profile_role,
		       profile_experience_years, profile_industry, profile_skills,
		       created_at, updated_at, last_login
		FROM users WHERE roll_number = ?
	`

	var profileSkills models.JSONStringSlice
	var lastLogin sql.NullTime
	err := ac.db.QueryRow(query, req.RollNumber).Scan(
		&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Password, &user.RollNumber, &user.CountryCode,
		&user.PhoneNumber, &user.Address, &user.College, &user.Department, &user.PassoutYear, &user.Role,
		&user.IsVerified, &user.IsActive, &user.Profile.Company, &user.Profile.Role,
		&user.Profile.ExperienceYears, &user.Profile.Industry, &profileSkills,
		&user.CreatedAt, &user.UpdatedAt, &lastLogin,
	)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid roll number or password"})
		return
	}

	user.Profile.Skills = profileSkills
	if lastLogin.Valid {
		user.LastLogin = &lastLogin.Time
	}

	// Check password
	if err := config.CheckPassword(req.Password, user.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid credentials"})
		return
	}

	// Check if user is active
	if !user.IsActive {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Account is deactivated"})
		return
	}

	// Update last login
	now := time.Now()
	_, err = ac.db.Exec("UPDATE users SET last_login = ? WHERE id = ?", now, user.ID)
	if err != nil {
		// Log error but don't fail the request
	}

	// Generate JWT token
	token, err := ac.generateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to generate token"})
		return
	}

	// Remove password from response
	user.Password = ""

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Login successful",
		"data": gin.H{
			"user":  user,
			"token": token,
		},
	})
}

// GetProfile handles getting user profile
func (ac *AuthController) GetProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	// Find user by ID
	var user models.User
	query := `
		SELECT id, first_name, last_name, email, roll_number, country_code,
		       phone_number, address, college, department, passout_year, role,
		       is_verified, is_active, profile_bio, profile_company, profile_role,
		       profile_experience_years, profile_industry, profile_location,
		       profile_website, profile_skills, profile_achievements,
		       profile_interests, profile_image, social_linkedin, social_github,
		       social_twitter, social_facebook, preferences_email_notifications,
		       preferences_push_notifications, preferences_show_email,
		       preferences_show_phone, preferences_show_profile,
		       preferences_allow_messages, preferences_show_connections,
		       preferences_theme, preferences_language, preferences_timezone,
		       created_at, updated_at, last_login
		FROM users WHERE id = ?
	`

	var profileSkills, profileAchievements, profileInterests models.JSONStringSlice
	var lastLogin sql.NullTime
	err := ac.db.QueryRow(query, userID).Scan(
		&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.RollNumber, &user.CountryCode,
		&user.PhoneNumber, &user.Address, &user.College, &user.Department, &user.PassoutYear, &user.Role,
		&user.IsVerified, &user.IsActive, &user.Profile.Bio, &user.Profile.Company, &user.Profile.Role,
		&user.Profile.ExperienceYears, &user.Profile.Industry, &user.Profile.Location,
		&user.Profile.Website, &profileSkills, &profileAchievements,
		&profileInterests, &user.Profile.ProfileImage, &user.Social.LinkedIn, &user.Social.GitHub,
		&user.Social.Twitter, &user.Social.Facebook, &user.Preferences.EmailNotifications,
		&user.Preferences.PushNotifications, &user.Preferences.Privacy.ShowEmail,
		&user.Preferences.Privacy.ShowPhone, &user.Preferences.Privacy.ShowProfile,
		&user.Preferences.Privacy.AllowMessages, &user.Preferences.Privacy.ShowConnections,
		&user.Preferences.Theme, &user.Preferences.Language, &user.Preferences.Timezone,
		&user.CreatedAt, &user.UpdatedAt, &lastLogin,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch user"})
		}
		return
	}

	user.Profile.Skills = profileSkills
	user.Profile.Achievements = profileAchievements
	user.Profile.Interests = profileInterests
	if lastLogin.Valid {
		user.LastLogin = &lastLogin.Time
	}

	// Remove password from response
	user.Password = ""

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Profile fetched successfully",
		"data":    gin.H{"user": user},
	})
}

// UpdateProfile handles updating user profile
func (ac *AuthController) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	var req models.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body", "errors": err.Error()})
		return
	}

	// Validate input
	if err := middleware.ValidateStruct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Validation failed", "errors": err})
		return
	}

	// Build dynamic UPDATE query
	var updates []string
	var args []interface{}
	argIndex := 1

	if req.FirstName != nil {
		updates = append(updates, fmt.Sprintf("first_name = $%d", argIndex))
		args = append(args, *req.FirstName)
		argIndex++
	}
	if req.LastName != nil {
		updates = append(updates, fmt.Sprintf("last_name = $%d", argIndex))
		args = append(args, *req.LastName)
		argIndex++
	}
	if req.Phone != nil {
		updates = append(updates, fmt.Sprintf("phone_number = $%d", argIndex))
		args = append(args, *req.Phone)
		argIndex++
	}

	// Always update updated_at
	updates = append(updates, fmt.Sprintf("updated_at = $%d", argIndex))
	args = append(args, time.Now())
	argIndex++

	// Add user ID as last parameter
	args = append(args, userID)

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "No fields to update"})
		return
	}

	// Execute UPDATE query
	query := fmt.Sprintf("UPDATE users SET %s WHERE id = $%d", strings.Join(updates, ", "), argIndex)
	_, err := ac.db.Exec(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update profile"})
		return
	}

	// Fetch updated user
	var user models.User
	query := `
		SELECT id, first_name, last_name, email, roll_number, country_code,
		       phone_number, address, college, department, passout_year, role,
		       is_verified, is_active, profile_bio, profile_company, profile_role,
		       profile_experience_years, profile_industry, profile_location,
		       profile_website, profile_skills, profile_achievements,
		       profile_interests, profile_image, social_linkedin, social_github,
		       social_twitter, social_facebook, preferences_email_notifications,
		       preferences_push_notifications, preferences_show_email,
		       preferences_show_phone, preferences_show_profile,
		       preferences_allow_messages, preferences_show_connections,
		       preferences_theme, preferences_language, preferences_timezone,
		       created_at, updated_at, last_login
		FROM users WHERE id = ?
	`

	var profileSkills, profileAchievements, profileInterests models.JSONStringSlice
	var lastLogin sql.NullTime
	err = ac.db.QueryRow(query, userID).Scan(
		&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.RollNumber, &user.CountryCode,
		&user.PhoneNumber, &user.Address, &user.College, &user.Department, &user.PassoutYear, &user.Role,
		&user.IsVerified, &user.IsActive, &user.Profile.Bio, &user.Profile.Company, &user.Profile.Role,
		&user.Profile.ExperienceYears, &user.Profile.Industry, &user.Profile.Location,
		&user.Profile.Website, &profileSkills, &profileAchievements,
		&profileInterests, &user.Profile.ProfileImage, &user.Social.LinkedIn, &user.Social.GitHub,
		&user.Social.Twitter, &user.Social.Facebook, &user.Preferences.EmailNotifications,
		&user.Preferences.PushNotifications, &user.Preferences.Privacy.ShowEmail,
		&user.Preferences.Privacy.ShowPhone, &user.Preferences.Privacy.ShowProfile,
		&user.Preferences.Privacy.AllowMessages, &user.Preferences.Privacy.ShowConnections,
		&user.Preferences.Theme, &user.Preferences.Language, &user.Preferences.Timezone,
		&user.CreatedAt, &user.UpdatedAt, &lastLogin,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch updated profile"})
		return
	}

	user.Profile.Skills = profileSkills
	user.Profile.Achievements = profileAchievements
	user.Profile.Interests = profileInterests
	if lastLogin.Valid {
		user.LastLogin = &lastLogin.Time
	}

	// Remove password from response
	user.Password = ""

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Profile updated successfully",
		"data":    gin.H{"user": user},
	})
}

// ChangePassword handles changing user password
func (ac *AuthController) ChangePassword(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	var req models.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body", "errors": err.Error()})
		return
	}

	// Validate input
	if err := middleware.ValidateStruct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Validation failed", "errors": err})
		return
	}

	ctx := c.Request.Context()
	db := config.GetDatabase()

	// Fetch user with password
	var user models.User
	err := db.Collection("users").FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch user"})
		return
	}

	// Check current password
	if err := config.CheckPassword(req.CurrentPassword, user.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Current password is incorrect"})
		return
	}

	// Hash new password
	hashedPassword, err := config.HashPassword(req.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to hash new password"})
		return
	}

	// Update password
	_, err = db.Collection("users").UpdateOne(ctx, bson.M{"_id": userID}, bson.M{"$set": bson.M{
		"password":  hashedPassword,
		"updatedAt": time.Now(),
	}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password changed successfully",
	})
}

// Logout handles user logout
func (ac *AuthController) Logout(c *gin.Context) {
	// In a real implementation, you might want to invalidate the token
	// For JWT, this is typically done by maintaining a blacklist or using refresh tokens
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Logout successful",
	})
}

// RefreshToken handles token refresh
func (ac *AuthController) RefreshToken(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	ctx := c.Request.Context()
	db := config.GetDatabase()

	// Fetch user
	var user models.User
	err := db.Collection("users").FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not found"})
		return
	}

	// Generate new token
	token, err := ac.generateToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Token refreshed successfully",
		"data":    gin.H{"token": token},
	})
}

// generateToken generates a JWT token for the user
func (ac *AuthController) generateToken(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"userID":    user.ID,
		"email":     user.Email,
		"role":      user.Role,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"exp":       time.Now().Add(time.Hour * 24 * 7).Unix(), // 7 days
		"iat":       time.Now().Unix(),
		"jti":       uuid.New().String(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(ac.cfg.JWTSecret))
}

// GoogleOAuth handles Google OAuth callback
func (ac *AuthController) GoogleOAuth(c *gin.Context) {
	// This is a placeholder for Google OAuth implementation
	// In a real implementation, you would handle the OAuth flow here
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Google OAuth not implemented yet",
	})
}

// LinkedInOAuth handles LinkedIn OAuth callback
func (ac *AuthController) LinkedInOAuth(c *gin.Context) {
	// This is a placeholder for LinkedIn OAuth implementation
	// In a real implementation, you would handle the OAuth flow here
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "LinkedIn OAuth not implemented yet",
	})
}

// FacebookOAuth handles Facebook OAuth callback
func (ac *AuthController) FacebookOAuth(c *gin.Context) {
	// This is a placeholder for Facebook OAuth implementation
	// In a real implementation, you would handle the OAuth flow here
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Facebook OAuth not implemented yet",
	})
}

// VerifyEmail handles email verification
func (ac *AuthController) VerifyEmail(c *gin.Context) {
	token := c.Param("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Token is required"})
		return
	}

	// In a real implementation, you would verify the token and update user's email verification status
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Email verification not implemented yet",
	})
}

// ForgotPassword handles forgot password request
func (ac *AuthController) ForgotPassword(c *gin.Context) {
	var req struct {
		Email string `json:"email" validate:"required,email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body"})
		return
	}

	// In a real implementation, you would send a password reset email
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Forgot password not implemented yet",
	})
}

// ResetPassword handles password reset
func (ac *AuthController) ResetPassword(c *gin.Context) {
	var req struct {
		Token    string `json:"token" validate:"required"`
		Password string `json:"password" validate:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body"})
		return
	}

	// In a real implementation, you would verify the token and update the password
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Password reset not implemented yet",
	})
}
