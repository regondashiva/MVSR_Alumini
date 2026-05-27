package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"mvsr-backend/config"
)

type FacultyController struct {
	db *sql.DB
}

func NewFacultyController() *FacultyController {
	return &FacultyController{
		db: config.GetDatabase(),
	}
}

// GetPendingUsers fetches pending registrations for the faculty's department
func (fc *FacultyController) GetPendingUsers(c *gin.Context) {
	facultyID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	// Verify the user is a faculty member and get their department
	var facultyRole, facultyDept string
	err := fc.db.QueryRow("SELECT role, department FROM users WHERE id = ?", facultyID).Scan(&facultyRole, &facultyDept)
	if err != nil || facultyRole != "faculty" {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Access denied. Only faculty can perform this action."})
		return
	}

	query := `
		SELECT id, first_name, last_name, email, roll_number, passout_year, role, department
		FROM users 
		WHERE is_verified = false AND is_active = true AND role IN ('alumni', 'student') AND department = ?
	`
	rows, err := fc.db.Query(query, facultyDept)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch pending users", "error": err.Error()})
		return
	}
	defer rows.Close()

	var pendingUsers []gin.H
	for rows.Next() {
		var id int
		var firstName, lastName, email, rollNumber, role, department string
		var passoutYear sql.NullString
		if err := rows.Scan(&id, &firstName, &lastName, &email, &rollNumber, &passoutYear, &role, &department); err != nil {
			continue
		}
		
		passoutStr := ""
		if passoutYear.Valid {
			passoutStr = passoutYear.String
		}

		pendingUsers = append(pendingUsers, gin.H{
			"id": id,
			"firstName": firstName,
			"lastName": lastName,
			"email": email,
			"rollNumber": rollNumber,
			"passoutYear": passoutStr,
			"role": role,
			"department": department,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": pendingUsers,
	})
}

// VerifyUser allows a faculty to approve a pending alumni or student
func (fc *FacultyController) VerifyUser(c *gin.Context) {
	facultyID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	targetUserID := c.Param("id")
	if targetUserID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "User ID is required"})
		return
	}

	var facultyRole, facultyDept string
	err := fc.db.QueryRow("SELECT role, department FROM users WHERE id = ?", facultyID).Scan(&facultyRole, &facultyDept)
	if err != nil || facultyRole != "faculty" {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Access denied"})
		return
	}

	// Verify that the target user is in the same department
	var targetDept string
	err = fc.db.QueryRow("SELECT department FROM users WHERE id = ?", targetUserID).Scan(&targetDept)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Target user not found"})
		return
	}
	if targetDept != facultyDept {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "You can only verify users from your own department"})
		return
	}

	_, err = fc.db.Exec("UPDATE users SET is_verified = true WHERE id = ?", targetUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to verify user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User verified successfully",
	})
}
