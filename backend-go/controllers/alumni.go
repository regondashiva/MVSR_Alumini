package controllers

import (
	"database/sql"
	"net/http"
	"strconv"
	"strings"

	"mvsr-backend/config"
	"mvsr-backend/models"

	"github.com/gin-gonic/gin"
)

type AlumniController struct {
	cfg *config.Config
}

func NewAlumniController(cfg *config.Config) *AlumniController {
	return &AlumniController{cfg: cfg}
}

func (ac *AlumniController) GetApprovedAlumni(c *gin.Context) {
	ctx := c.Request.Context()
	db := config.GetDatabase()

	query := `
		SELECT id, first_name, last_name, email, roll_number, 
		       COALESCE(country_code, '+91'), COALESCE(phone_number, ''), 
		       COALESCE(address, ''), COALESCE(college, 'mvsr'), COALESCE(department, ''), 
		       COALESCE(CAST(passout_year AS CHAR), ''), role, is_verified, is_active, 
		       COALESCE(profile_company, ''), COALESCE(profile_role, ''), 
		       COALESCE(profile_experience_years, 0), COALESCE(profile_industry, ''), 
		       COALESCE(profile_skills, '[]'), created_at, updated_at
		FROM users
		WHERE is_verified = true AND is_active = true AND role IN ('alumni', 'student', 'faculty')
	`

	rows, err := db.QueryContext(ctx, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch alumni",
			"error":   err.Error(),
		})
		return
	}
	defer rows.Close()

	var alumniData []map[string]interface{}
	for rows.Next() {
		var user models.User
		var profileSkills models.JSONStringSlice
		err := rows.Scan(
			&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.RollNumber, &user.CountryCode,
			&user.PhoneNumber, &user.Address, &user.College, &user.Department, &user.PassoutYear, &user.Role,
			&user.IsVerified, &user.IsActive, &user.Profile.Company, &user.Profile.Role,
			&user.Profile.ExperienceYears, &user.Profile.Industry, &profileSkills,
			&user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to scan alumni data",
				"error":   err.Error(),
			})
			return
		}

		alumniData = append(alumniData, map[string]interface{}{
			"id":              user.ID,
			"name":            user.FirstName + " " + user.LastName,
			"firstName":       user.FirstName,
			"lastName":        user.LastName,
			"email":           user.Email,
			"rollNumber":      user.RollNumber,
			"countryCode":     user.CountryCode,
			"phoneNumber":     user.PhoneNumber,
			"address":         user.Address,
			"college":         user.College,
			"department":      user.Department,
			"passoutYear":     user.PassoutYear,
			"role":            user.Role,
			"company":         user.Profile.Company,
			"roleDescription": user.Profile.Role,
			"experienceYears": user.Profile.ExperienceYears,
			"industry":        user.Profile.Industry,
			"skills":          strings.Join(profileSkills, ", "),
			"verified":        user.IsVerified,
			"active":          user.IsActive,
			"createdAt":       user.CreatedAt,
			"updatedAt":       user.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    alumniData,
		"count":   len(alumniData),
	})
}

func (ac *AlumniController) SearchAlumni(c *gin.Context) {
	ctx := c.Request.Context()
	db := config.GetDatabase()

	name := c.Query("name")
	company := c.Query("company")
	city := c.Query("city")
	state := c.Query("state")
	country := c.Query("country")
	department := c.Query("department")
	college := c.Query("college")
	industry := c.Query("industry")

	query := `
		SELECT id, first_name, last_name, email, roll_number, 
		       COALESCE(country_code, '+91'), COALESCE(phone_number, ''), 
		       COALESCE(address, ''), COALESCE(college, 'mvsr'), COALESCE(department, ''), 
		       COALESCE(CAST(passout_year AS CHAR), ''), role, is_verified, is_active, 
		       COALESCE(profile_company, ''), COALESCE(profile_role, ''), 
		       COALESCE(profile_experience_years, 0), COALESCE(profile_industry, ''), 
		       COALESCE(profile_skills, '[]'), created_at, updated_at
		FROM users
		WHERE is_verified = true AND is_active = true AND role IN ('alumni', 'student', 'faculty')
	`
	var args []interface{}

	if name != "" {
		query += " AND (first_name LIKE ? OR last_name LIKE ?)"
		args = append(args, "%"+name+"%", "%"+name+"%")
	}
	if company != "" {
		query += " AND profile_company LIKE ?"
		args = append(args, "%"+company+"%")
	}
	if city != "" {
		query += " AND address LIKE ?"
		args = append(args, "%"+city+"%")
	}
	if state != "" {
		query += " AND address LIKE ?"
		args = append(args, "%"+state+"%")
	}
	if country != "" {
		query += " AND address LIKE ?"
		args = append(args, "%"+country+"%")
	}
	if department != "" {
		query += " AND department LIKE ?"
		args = append(args, "%"+department+"%")
	}
	if college != "" {
		query += " AND college LIKE ?"
		args = append(args, "%"+college+"%")
	}
	if industry != "" {
		query += " AND profile_industry LIKE ?"
		args = append(args, "%"+industry+"%")
	}

	rows, err := db.QueryContext(ctx, query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to search alumni",
			"error":   err.Error(),
		})
		return
	}
	defer rows.Close()

	var alumniData []map[string]interface{}
	for rows.Next() {
		var user models.User
		var profileSkills models.JSONStringSlice
		err := rows.Scan(
			&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.RollNumber, &user.CountryCode,
			&user.PhoneNumber, &user.Address, &user.College, &user.Department, &user.PassoutYear, &user.Role,
			&user.IsVerified, &user.IsActive, &user.Profile.Company, &user.Profile.Role,
			&user.Profile.ExperienceYears, &user.Profile.Industry, &profileSkills,
			&user.CreatedAt, &user.UpdatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to scan alumni data",
				"error":   err.Error(),
			})
			return
		}

		alumniData = append(alumniData, map[string]interface{}{
			"id":              user.ID,
			"name":            user.FirstName + " " + user.LastName,
			"firstName":       user.FirstName,
			"lastName":        user.LastName,
			"email":           user.Email,
			"rollNumber":      user.RollNumber,
			"countryCode":     user.CountryCode,
			"phoneNumber":     user.PhoneNumber,
			"address":         user.Address,
			"college":         user.College,
			"department":      user.Department,
			"passoutYear":     user.PassoutYear,
			"role":            user.Role,
			"company":         user.Profile.Company,
			"roleDescription": user.Profile.Role,
			"experienceYears": user.Profile.ExperienceYears,
			"industry":        user.Profile.Industry,
			"skills":          strings.Join(profileSkills, ", "),
			"verified":        user.IsVerified,
			"active":          user.IsActive,
			"createdAt":       user.CreatedAt,
			"updatedAt":       user.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    alumniData,
		"count":   len(alumniData),
	})
}

func (ac *AlumniController) GetAlumniProfile(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Alumni profile not implemented yet",
	})
}

func (ac *AlumniController) UpdateAlumniProfile(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Alumni profile update not implemented yet",
	})
}

func (ac *AlumniController) ConnectWithAlumni(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}
	requesterID := userID.(int)

	// Support both path parameter (:id) and legacy POST request body
	targetIDStr := c.Param("id")
	var targetID int
	if targetIDStr != "" {
		var err error
		targetID, err = strconv.Atoi(targetIDStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Invalid alumni ID",
			})
			return
		}
	} else {
		// Read from request body for legacy /api/connections/request
		var req struct {
			AlumniID    int    `json:"alumniId"`
			Message     string `json:"message"`
			RequestedBy int    `json:"requestedBy"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Invalid request body",
				"error":   err.Error(),
			})
			return
		}
		targetID = req.AlumniID
	}

	if requesterID == targetID {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "You cannot connect with yourself",
		})
		return
	}

	db := config.GetDatabase()

	// Verify target user exists
	var targetExists bool
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE id = ?)", targetID).Scan(&targetExists)
	if err != nil || !targetExists {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Alumni not found",
		})
		return
	}

	// Insert connection request
	_, err = db.Exec(`
		INSERT INTO user_connections (requester_id, addressee_id, status)
		VALUES (?, ?, 'pending')
		ON DUPLICATE KEY UPDATE status = 'pending'
	`, requesterID, targetID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to send connection request",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Connection request sent successfully",
	})
}

func (ac *AlumniController) DisconnectFromAlumni(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}
	requesterID := userID.(int)

	targetIDStr := c.Param("id")
	targetID, err := strconv.Atoi(targetIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid alumni ID",
		})
		return
	}

	db := config.GetDatabase()

	_, err = db.Exec(`
		DELETE FROM user_connections 
		WHERE (requester_id = ? AND addressee_id = ?) 
		   OR (requester_id = ? AND addressee_id = ?)
	`, requesterID, targetID, targetID, requesterID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to disconnect",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Disconnected successfully",
	})
}

func (ac *AlumniController) GetConnections(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}
	currentUserID := userID.(int)

	statusFilter := c.DefaultQuery("status", "accepted")

	db := config.GetDatabase()

	query := `
		SELECT c.id, c.status, c.created_at,
		       u.id, u.first_name, u.last_name, u.email, u.role, 
		       COALESCE(u.profile_company, ''), COALESCE(u.profile_role, ''), COALESCE(u.profile_image, '')
		FROM user_connections c
		JOIN users u ON (CASE WHEN c.requester_id = ? THEN c.addressee_id ELSE c.requester_id END) = u.id
		WHERE (c.requester_id = ? OR c.addressee_id = ?)
	`
	var args []interface{}
	args = append(args, currentUserID, currentUserID, currentUserID)

	if statusFilter != "all" {
		query += " AND c.status = ?"
		args = append(args, statusFilter)
	}

	rows, err := db.QueryContext(c.Request.Context(), query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch connections",
			"error":   err.Error(),
		})
		return
	}
	defer rows.Close()

	var connections []map[string]interface{}
	for rows.Next() {
		var connID int
		var status string
		var createdAt string
		var otherUser struct {
			ID        int
			FirstName string
			LastName  string
			Email     string
			Role      string
			Company   string
			ProfileRole string
			Image     string
		}

		err := rows.Scan(
			&connID, &status, &createdAt,
			&otherUser.ID, &otherUser.FirstName, &otherUser.LastName, &otherUser.Email, &otherUser.Role,
			&otherUser.Company, &otherUser.ProfileRole, &otherUser.Image,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to scan connection data",
				"error":   err.Error(),
			})
			return
		}

		connections = append(connections, map[string]interface{}{
			"connectionId": connID,
			"status":       status,
			"createdAt":    createdAt,
			"user": map[string]interface{}{
				"id":              otherUser.ID,
				"name":            otherUser.FirstName + " " + otherUser.LastName,
				"firstName":       otherUser.FirstName,
				"lastName":        otherUser.LastName,
				"email":           otherUser.Email,
				"role":            otherUser.Role,
				"company":         otherUser.Company,
				"roleDescription": otherUser.ProfileRole,
				"profileImage":    otherUser.Image,
			},
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    connections,
		"count":   len(connections),
	})
}

func (ac *AlumniController) RespondToConnection(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}
	currentUserID := userID.(int)

	connIDStr := c.Param("id")
	connID, err := strconv.Atoi(connIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid connection ID",
		})
		return
	}

	var req struct {
		Status string `json:"status" binding:"required,oneof=accepted rejected"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request status. Must be 'accepted' or 'rejected'",
			"error":   err.Error(),
		})
		return
	}

	db := config.GetDatabase()

	var addresseeID int
	err = db.QueryRow("SELECT addressee_id FROM user_connections WHERE id = ?", connID).Scan(&addresseeID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "Connection request not found",
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Database error",
				"error":   err.Error(),
			})
		}
		return
	}

	if addresseeID != currentUserID {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"message": "You are not authorized to respond to this connection request",
		})
		return
	}

	_, err = db.Exec("UPDATE user_connections SET status = ? WHERE id = ?", req.Status, connID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to update connection status",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Connection request status updated to " + req.Status,
	})
}

func (ac *AlumniController) GetAlumniStats(c *gin.Context) {
	db := config.GetDatabase()

	var alumniCount, studentCount, facultyCount int
	_ = db.QueryRow("SELECT COUNT(*) FROM users WHERE role = 'alumni' AND is_verified = 1").Scan(&alumniCount)
	_ = db.QueryRow("SELECT COUNT(*) FROM users WHERE role = 'student' AND is_verified = 1").Scan(&studentCount)
	_ = db.QueryRow("SELECT COUNT(*) FROM users WHERE role = 'faculty' AND is_verified = 1").Scan(&facultyCount)

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"totalAlumni":   alumniCount,
			"totalStudents": studentCount,
			"totalFaculty":  facultyCount,
		},
	})
}

