package controllers

import (
	"database/sql"
	"net/http"
	"strconv"

	"mvsr-backend/config"

	"github.com/gin-gonic/gin"
)

type MentorshipController struct {
}

func NewMentorshipController() *MentorshipController {
	return &MentorshipController{}
}

// CreateMentorshipRequest handles sending a mentorship request (POST /api/mentorship/request)
func (mc *MentorshipController) CreateMentorshipRequest(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}
	studentID := userID.(int)

	var req struct {
		AlumniID    string `json:"alumniId"` // The mentor ID
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

	mentorID, err := strconv.Atoi(req.AlumniID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid mentor ID format",
		})
		return
	}

	if studentID == mentorID {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "You cannot request mentorship from yourself",
		})
		return
	}

	db := config.GetDatabase()

	// Verify mentor exists
	var role string
	err = db.QueryRow("SELECT role FROM users WHERE id = ?", mentorID).Scan(&role)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "Mentor not found",
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

	// Insert mentorship request
	_, err = db.Exec(`
		INSERT INTO mentorship_requests (student_id, mentor_id, status, message)
		VALUES (?, ?, 'pending', ?)
	`, studentID, mentorID, req.Message)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to submit mentorship request",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Mentorship request submitted successfully",
	})
}

// GetMentorshipRequests fetches all mentorship requests involving the logged-in user
func (mc *MentorshipController) GetMentorshipRequests(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}
	currentUserID := userID.(int)

	db := config.GetDatabase()

	// Fetch requests where current user is student or mentor
	query := `
		SELECT r.id, r.status, COALESCE(r.message, ''), r.created_at,
		       s.id, s.first_name, s.last_name, s.email,
		       m.id, m.first_name, m.last_name, m.email
		FROM mentorship_requests r
		JOIN users s ON r.student_id = s.id
		JOIN users m ON r.mentor_id = m.id
		WHERE r.student_id = ? OR r.mentor_id = ?
		ORDER BY r.created_at DESC
	`

	rows, err := db.QueryContext(c.Request.Context(), query, currentUserID, currentUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch mentorship requests",
			"error":   err.Error(),
		})
		return
	}
	defer rows.Close()

	var requests []map[string]interface{}
	for rows.Next() {
		var reqID int
		var status string
		var message string
		var createdAt string
		var s struct {
			ID    int
			First string
			Last  string
			Email string
		}
		var m struct {
			ID    int
			First string
			Last  string
			Email string
		}

		err := rows.Scan(
			&reqID, &status, &message, &createdAt,
			&s.ID, &s.First, &s.Last, &s.Email,
			&m.ID, &m.First, &m.Last, &m.Email,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to scan request data",
				"error":   err.Error(),
			})
			return
		}

		requests = append(requests, map[string]interface{}{
			"id":        reqID,
			"status":    status,
			"message":   message,
			"createdAt": createdAt,
			"student": map[string]interface{}{
				"id":    s.ID,
				"name":  s.First + " " + s.Last,
				"email": s.Email,
			},
			"mentor": map[string]interface{}{
				"id":    m.ID,
				"name":  m.First + " " + m.Last,
				"email": m.Email,
			},
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    requests,
		"count":   len(requests),
	})
}
