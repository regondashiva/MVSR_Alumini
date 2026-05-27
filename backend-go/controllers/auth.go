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

// ─────────────────────────────────────────────
//  TOKEN GENERATION
// ─────────────────────────────────────────────

// generateAccessToken creates a short-lived JWT (15 minutes).
// It is signed with JWTSecret and carries user identity claims.
func (ac *AuthController) generateAccessToken(user models.User) (string, error) {
	claims := jwt.MapClaims{
		"userID":    user.ID,
		"email":     user.Email,
		"role":      user.Role,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"type":      "access",
		"exp":       time.Now().Add(15 * time.Minute).Unix(),
		"iat":       time.Now().Unix(),
		"jti":       uuid.New().String(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(ac.cfg.JWTSecret))
}

// generateRefreshToken creates a long-lived JWT (7 days).
// It is signed with JWTRefreshSecret and its value is persisted in the
// refresh_tokens table so it can be revoked on logout.
func (ac *AuthController) generateRefreshToken(userID int) (string, error) {
	expiresAt := time.Now().Add(7 * 24 * time.Hour)

	claims := jwt.MapClaims{
		"userID": userID,
		"type":   "refresh",
		"exp":    expiresAt.Unix(),
		"iat":    time.Now().Unix(),
		"jti":    uuid.New().String(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenStr, err := token.SignedString([]byte(ac.cfg.JWTRefreshSecret))
	if err != nil {
		return "", err
	}

	// Persist so we can revoke / rotate it later
	_, err = ac.db.Exec(
		"INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
		userID, tokenStr, expiresAt,
	)
	if err != nil {
		return "", fmt.Errorf("failed to store refresh token: %w", err)
	}

	return tokenStr, nil
}

func (ac *AuthController) ensurePasswordResetTable() error {
	createTable := `
	CREATE TABLE IF NOT EXISTS password_reset_tokens (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT NOT NULL,
		token VARCHAR(255) NOT NULL UNIQUE,
		expires_at DATETIME NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
		INDEX idx_password_reset_user_id (user_id),
		INDEX idx_password_reset_token (token(255))
	) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`

	_, err := ac.db.Exec(createTable)
	return err
}

// ─────────────────────────────────────────────
//  AUTH HANDLERS
// ─────────────────────────────────────────────

// Register handles user registration
func (ac *AuthController) Register(c *gin.Context) {
	var req models.CreateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body", "errors": err.Error()})
		return
	}

	if err := middleware.ValidateStruct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Validation failed", "errors": err})
		return
	}

	// Check duplicate email
	var existingEmail string
	err := ac.db.QueryRow("SELECT email FROM users WHERE email = ?", req.Email).Scan(&existingEmail)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"success": false, "message": "User with this email already exists"})
		return
	}

	// Check duplicate roll number
	var existingRollNumber string
	err = ac.db.QueryRow("SELECT roll_number FROM users WHERE roll_number = ?", req.RollNumber).Scan(&existingRollNumber)
	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"success": false, "message": "User with this roll number already exists"})
		return
	}

	hashedPassword, err := config.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to hash password"})
		return
	}

	query := `
		INSERT INTO users (
			first_name, last_name, email, password, roll_number, country_code, 
			phone_number, address, college, department, passout_year, role, 
			is_verified, is_active, approval_status, profile_company, profile_role, 
			profile_experience_years, profile_industry, profile_skills,
			created_at, updated_at
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	now := time.Now()
	isVerified := req.Role == "admin"
	approvalStatus := "approved" // Admin users auto-approved
	if req.Role != "admin" {
		approvalStatus = "pending" // Faculty, students, alumni need approval
	}
	skills := models.JSONStringSlice{req.Skills}

	var passoutYear interface{} = req.PassoutYear
	if req.PassoutYear == "" {
		passoutYear = nil
	}

	_, err = ac.db.Exec(query,
		req.FirstName, req.LastName, req.Email, hashedPassword, req.RollNumber, req.CountryCode,
		req.PhoneNumber, req.Address, req.College, req.Department, passoutYear, req.Role,
		isVerified, true, approvalStatus, req.Company, req.RoleDescription,
		req.Experience, req.Industry, skills,
		now, now,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create user", "error": err.Error()})
		return
	}

	var userID int
	err = ac.db.QueryRow("SELECT id FROM users WHERE email = ?", req.Email).Scan(&userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to retrieve created user"})
		return
	}

	user := models.User{
		ID:             userID,
		FirstName:      req.FirstName,
		LastName:       req.LastName,
		Email:          req.Email,
		RollNumber:     req.RollNumber,
		CountryCode:    req.CountryCode,
		PhoneNumber:    req.PhoneNumber,
		Address:        req.Address,
		College:        req.College,
		Department:     req.Department,
		PassoutYear:    req.PassoutYear,
		Role:           req.Role,
		IsVerified:     isVerified,
		IsActive:       true,
		ApprovalStatus: approvalStatus,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	accessToken, err := ac.generateAccessToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to generate access token"})
		return
	}
	refreshToken, err := ac.generateRefreshToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to generate refresh token"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "User registered successfully",
		"data": gin.H{
			"user":          user,
			"access_token":  accessToken,
			"refresh_token": refreshToken,
			"expires_in":    900, // 15 minutes in seconds
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

	fmt.Printf("Login attempt received: email=%q rollNumber=%q origin=%q\n", req.Email, req.RollNumber, c.GetHeader("Origin"))

	if strings.TrimSpace(req.Email) == "" && strings.TrimSpace(req.RollNumber) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Email or roll number is required"})
		return
	}

	if err := middleware.ValidateStruct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Validation failed", "errors": err.Error()})
		return
	}

	lookupField := "roll_number"
	lookupValue := req.RollNumber
	if strings.TrimSpace(req.Email) != "" {
		lookupField = "email"
		lookupValue = strings.TrimSpace(strings.ToLower(req.Email))
	}

	query := fmt.Sprintf(`
		SELECT id, first_name, last_name, email, password, roll_number, 
		       COALESCE(country_code, ''),
		       COALESCE(phone_number, ''), 
		       COALESCE(address, ''), 
		       COALESCE(college, ''), 
		       COALESCE(department, ''), 
		       COALESCE(CAST(passout_year AS CHAR), ''), 
		       role,
		       is_verified, is_active, 
		       COALESCE(approval_status, 'approved'),
		       COALESCE(approval_notes, ''),
		       COALESCE(profile_company, ''), 
		       COALESCE(profile_role, ''),
		       COALESCE(profile_experience_years, 0), 
		       COALESCE(profile_industry, ''), 
		       COALESCE(profile_skills, '[]'),
		       created_at, updated_at, last_login
		FROM users WHERE %s = ?
	`, lookupField)

	var user models.User
	var profileSkills models.JSONStringSlice
	var lastLogin sql.NullTime
	var approvalNotes sql.NullString
	err := ac.db.QueryRow(query, lookupValue).Scan(
		&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Password, &user.RollNumber, &user.CountryCode,
		&user.PhoneNumber, &user.Address, &user.College, &user.Department, &user.PassoutYear, &user.Role,
		&user.IsVerified, &user.IsActive, &user.ApprovalStatus, &approvalNotes,
		&user.Profile.Company, &user.Profile.Role,
		&user.Profile.ExperienceYears, &user.Profile.Industry, &profileSkills,
		&user.CreatedAt, &user.UpdatedAt, &lastLogin,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Printf("Login: user not found with %s = %q\n", lookupField, lookupValue)
		} else {
			fmt.Printf("Login scan error (field=%s, value=%q): %v\n", lookupField, lookupValue, err)
		}
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid email/roll number or password"})
		return
	}

	user.Profile.Skills = profileSkills
	if lastLogin.Valid {
		user.LastLogin = &lastLogin.Time
	}
	if approvalNotes.Valid {
		user.ApprovalNotes = &approvalNotes.String
	}

	if err := config.CheckPassword(req.Password, user.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid credentials"})
		return
	}

	if !user.IsActive {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Account is deactivated"})
		return
	}

	// Update last login (non-fatal)
	now := time.Now()
	ac.db.Exec("UPDATE users SET last_login = ? WHERE id = ?", now, user.ID)

	accessToken, err := ac.generateAccessToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to generate access token"})
		return
	}
	refreshToken, err := ac.generateRefreshToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to generate refresh token"})
		return
	}

	user.Password = "" // never send password back

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Login successful",
		"data": gin.H{
			"user":          user,
			"token":         accessToken,
			"access_token":  accessToken,
			"refresh_token": refreshToken,
			"expires_in":    900, // 15 minutes in seconds
		},
	})
}

// RefreshToken issues a new access token (and rotates the refresh token)
// using a valid refresh token sent in the request body.
// This endpoint does NOT require the Auth middleware.
func (ac *AuthController) RefreshToken(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "refresh_token is required"})
		return
	}

	// 1. Verify signature using the refresh secret
	token, err := jwt.Parse(req.RefreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(ac.cfg.JWTRefreshSecret), nil
	})
	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid refresh token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok || claims["type"] != "refresh" {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid token type"})
		return
	}

	// 2. Check token exists in DB (not revoked / not already used)
	var dbUserID int
	var expiresAt time.Time
	err = ac.db.QueryRow(
		"SELECT user_id, expires_at FROM refresh_tokens WHERE token = ?",
		req.RefreshToken,
	).Scan(&dbUserID, &expiresAt)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Refresh token not found or already revoked"})
		return
	}
	if time.Now().After(expiresAt) {
		ac.db.Exec("DELETE FROM refresh_tokens WHERE token = ?", req.RefreshToken)
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Refresh token has expired"})
		return
	}

	// 3. Rotate: delete the used refresh token
	ac.db.Exec("DELETE FROM refresh_tokens WHERE token = ?", req.RefreshToken)

	// 4. Load fresh user data
	var user models.User
	err = ac.db.QueryRow(
		"SELECT id, first_name, last_name, email, role FROM users WHERE id = ? AND is_active = true",
		dbUserID,
	).Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Role)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not found or account deactivated"})
		return
	}

	// 5. Issue new access token + new refresh token
	accessToken, err := ac.generateAccessToken(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to generate access token"})
		return
	}
	newRefreshToken, err := ac.generateRefreshToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to generate refresh token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Tokens refreshed successfully",
		"data": gin.H{
			"access_token":  accessToken,
			"refresh_token": newRefreshToken,
			"expires_in":    900,
		},
	})
}

// Logout revokes the refresh token so it can no longer be used.
func (ac *AuthController) Logout(c *gin.Context) {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}
	// Ignore bind error — token is optional (client may have already lost it)
	c.ShouldBindJSON(&req)

	if req.RefreshToken != "" {
		ac.db.Exec("DELETE FROM refresh_tokens WHERE token = ?", req.RefreshToken)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Logout successful",
	})
}

// LogoutAll revokes ALL refresh tokens for the authenticated user (logout from every device).
func (ac *AuthController) LogoutAll(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}
	ac.db.Exec("DELETE FROM refresh_tokens WHERE user_id = ?", userID)
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Logged out from all devices",
	})
}

// GetProfile handles getting user profile
func (ac *AuthController) GetProfile(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	var user models.User
	query := `
		SELECT id, first_name, last_name, email, roll_number, 
		       COALESCE(country_code, ''), COALESCE(phone_number, ''), 
		       COALESCE(address, ''), COALESCE(college, ''), 
		       COALESCE(department, ''), COALESCE(CAST(passout_year AS CHAR), ''), 
		       role, is_verified, is_active, 
		       COALESCE(approval_status, 'approved'),
		       COALESCE(approval_notes, ''),
		       COALESCE(profile_bio, ''), COALESCE(profile_company, ''), 
		       COALESCE(profile_role, ''), COALESCE(profile_experience_years, 0), 
		       COALESCE(profile_industry, ''), COALESCE(profile_location, ''),
		       COALESCE(profile_website, ''), COALESCE(profile_skills, '[]'), 
		       COALESCE(profile_achievements, '[]'), COALESCE(profile_interests, '[]'), 
		       COALESCE(profile_image, ''), 
		       COALESCE(social_linkedin, ''), COALESCE(social_github, ''),
		       COALESCE(social_twitter, ''), COALESCE(social_facebook, ''), 
		       COALESCE(preferences_email_notifications, true),
		       COALESCE(preferences_push_notifications, true), 
		       COALESCE(preferences_show_email, true),
		       COALESCE(preferences_show_phone, true), 
		       COALESCE(preferences_show_profile, true),
		       COALESCE(preferences_allow_messages, true), 
		       COALESCE(preferences_show_connections, true),
		       COALESCE(preferences_theme, 'light'), 
		       COALESCE(preferences_language, 'en'), 
		       COALESCE(preferences_timezone, 'Asia/Kolkata'),
		       created_at, updated_at, last_login
		FROM users WHERE id = ?
	`

	var profileSkills, profileAchievements, profileInterests models.JSONStringSlice
	var lastLogin sql.NullTime
	var approvalNotes sql.NullString
	err := ac.db.QueryRow(query, userID).Scan(
		&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.RollNumber, &user.CountryCode,
		&user.PhoneNumber, &user.Address, &user.College, &user.Department, &user.PassoutYear, &user.Role,
		&user.IsVerified, &user.IsActive, &user.ApprovalStatus, &approvalNotes, &user.Profile.Bio, &user.Profile.Company, &user.Profile.Role,
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
	if approvalNotes.Valid {
		user.ApprovalNotes = &approvalNotes.String
	}
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
	if err := middleware.ValidateStruct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Validation failed", "errors": err})
		return
	}

	var updates []string
	var args []interface{}

	if req.FirstName != nil {
		updates = append(updates, "first_name = ?")
		args = append(args, *req.FirstName)
	}
	if req.LastName != nil {
		updates = append(updates, "last_name = ?")
		args = append(args, *req.LastName)
	}
	if req.Phone != nil {
		updates = append(updates, "phone_number = ?")
		args = append(args, *req.Phone)
	}

	updates = append(updates, "updated_at = ?")
	args = append(args, time.Now())
	args = append(args, userID)

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "No fields to update"})
		return
	}

	query := fmt.Sprintf("UPDATE users SET %s WHERE id = ?", strings.Join(updates, ", "))
	_, err := ac.db.Exec(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update profile"})
		return
	}

	var user models.User
	query = `
		SELECT id, first_name, last_name, email, roll_number, 
		       COALESCE(country_code, ''), COALESCE(phone_number, ''), 
		       COALESCE(address, ''), COALESCE(college, ''), 
		       COALESCE(department, ''), COALESCE(CAST(passout_year AS CHAR), ''), 
		       role, is_verified, is_active, 
		       COALESCE(profile_bio, ''), COALESCE(profile_company, ''), 
		       COALESCE(profile_role, ''), COALESCE(profile_experience_years, 0), 
		       COALESCE(profile_industry, ''), COALESCE(profile_location, ''),
		       COALESCE(profile_website, ''), COALESCE(profile_skills, '[]'), 
		       COALESCE(profile_achievements, '[]'), COALESCE(profile_interests, '[]'), 
		       COALESCE(profile_image, ''), 
		       COALESCE(social_linkedin, ''), COALESCE(social_github, ''),
		       COALESCE(social_twitter, ''), COALESCE(social_facebook, ''), 
		       COALESCE(preferences_email_notifications, true),
		       COALESCE(preferences_push_notifications, true), 
		       COALESCE(preferences_show_email, true),
		       COALESCE(preferences_show_phone, true), 
		       COALESCE(preferences_show_profile, true),
		       COALESCE(preferences_allow_messages, true), 
		       COALESCE(preferences_show_connections, true),
		       COALESCE(preferences_theme, 'light'), 
		       COALESCE(preferences_language, 'en'), 
		       COALESCE(preferences_timezone, 'Asia/Kolkata'),
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
	if err := middleware.ValidateStruct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Validation failed", "errors": err})
		return
	}

	ctx := c.Request.Context()

	var user models.User
	err := ac.db.QueryRowContext(ctx, "SELECT password FROM users WHERE id = ?", userID).Scan(&user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch user"})
		}
		return
	}

	if err := config.CheckPassword(req.CurrentPassword, user.Password); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Current password is incorrect"})
		return
	}

	hashedPassword, err := config.HashPassword(req.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to hash new password"})
		return
	}

	_, err = ac.db.ExecContext(ctx, "UPDATE users SET password = ?, updated_at = ? WHERE id = ?", hashedPassword, time.Now(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update password"})
		return
	}

	// Revoke all refresh tokens — forces re-login on all devices
	ac.db.ExecContext(ctx, "DELETE FROM refresh_tokens WHERE user_id = ?", userID)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password changed successfully. Please log in again.",
	})
}

// ─────────────────────────────────────────────
//  PLACEHOLDER HANDLERS
// ─────────────────────────────────────────────

func (ac *AuthController) GoogleOAuth(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"success": false, "message": "Google OAuth not implemented yet"})
}

func (ac *AuthController) LinkedInOAuth(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"success": false, "message": "LinkedIn OAuth not implemented yet"})
}

func (ac *AuthController) FacebookOAuth(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"success": false, "message": "Facebook OAuth not implemented yet"})
}

func (ac *AuthController) VerifyEmail(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{"success": false, "message": "Email verification not implemented yet"})
}

func (ac *AuthController) ForgotPassword(c *gin.Context) {
	if err := ac.ensurePasswordResetTable(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to prepare password reset storage", "error": err.Error()})
		return
	}

	var req struct {
		Email string `json:"email" binding:"required,email"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body", "errors": err.Error()})
		return
	}

	var userID int
	err := ac.db.QueryRow("SELECT id FROM users WHERE email = ?", strings.TrimSpace(strings.ToLower(req.Email))).Scan(&userID)
	if err != nil {
		// Do not expose whether the email exists.
		c.JSON(http.StatusOK, gin.H{"success": true, "message": "If an account with that email exists, a password reset token has been generated."})
		return
	}

	token := uuid.NewString()
	expiresAt := time.Now().Add(1 * time.Hour)
	_, err = ac.db.Exec("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)", userID, token, expiresAt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create password reset token", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Password reset token created. Use this token to reset your password.",
		"data":    gin.H{"reset_token": token, "expires_in": 3600},
	})
}

func (ac *AuthController) ResetPassword(c *gin.Context) {
	if err := ac.ensurePasswordResetTable(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to prepare password reset storage", "error": err.Error()})
		return
	}

	var req struct {
		Token       string `json:"token" binding:"required"`
		NewPassword string `json:"newPassword" binding:"required,min=6"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body", "errors": err.Error()})
		return
	}

	var userID int
	var expiresAt time.Time
	err := ac.db.QueryRow("SELECT user_id, expires_at FROM password_reset_tokens WHERE token = ?", req.Token).Scan(&userID, &expiresAt)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid or expired reset token"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to look up reset token", "error": err.Error()})
		return
	}

	if time.Now().After(expiresAt) {
		ac.db.Exec("DELETE FROM password_reset_tokens WHERE token = ?", req.Token)
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Reset token has expired"})
		return
	}

	hashedPassword, err := config.HashPassword(req.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to hash new password"})
		return
	}

	_, err = ac.db.Exec("UPDATE users SET password = ?, updated_at = ? WHERE id = ?", hashedPassword, time.Now(), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update password", "error": err.Error()})
		return
	}

	ac.db.Exec("DELETE FROM password_reset_tokens WHERE token = ?", req.Token)
	ac.db.Exec("DELETE FROM refresh_tokens WHERE user_id = ?", userID)

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Password reset successfully. Please log in with your new password."})
}
