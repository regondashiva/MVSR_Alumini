package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"mvsr-backend/config"
)

type HelpdeskController struct {
	db *sql.DB
}

func NewHelpdeskController() *HelpdeskController {
	return &HelpdeskController{
		db: config.GetDatabase(),
	}
}

// SubmitTicket handles creating a new helpdesk ticket
func (hc *HelpdeskController) SubmitTicket(c *gin.Context) {
	var req struct {
		Name    string      `json:"name" binding:"required"`
		Email   string      `json:"email" binding:"required"`
		Phone   string      `json:"phone"`
		Service string      `json:"service" binding:"required"`
		Message string      `json:"message"`
		Details interface{} `json:"details"`
		UserID  interface{} `json:"userId"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
			"error":   err.Error(),
		})
		return
	}

	// Serialize details to JSON
	detailsJSON := "null"
	if req.Details != nil {
		if d, err := json.Marshal(req.Details); err == nil {
			detailsJSON = string(d)
		}
	}

	// Resolve user_id: could come from JWT context or request body
	var userID *int
	if uid, exists := c.Get("userID"); exists {
		id := uid.(int)
		userID = &id
	} else if req.UserID != nil {
		switch v := req.UserID.(type) {
		case float64:
			id := int(v)
			userID = &id
		case int:
			userID = &v
		}
	}

	query := `
		INSERT INTO helpdesk_tickets (user_id, name, email, phone, service, message, details, status, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
	`

	result, err := hc.db.Exec(query, userID, req.Name, req.Email, req.Phone, req.Service, req.Message, detailsJSON)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to submit ticket",
			"error":   err.Error(),
		})
		return
	}

	ticketID, _ := result.LastInsertId()

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Help desk ticket submitted successfully",
		"data": gin.H{
			"id": ticketID,
		},
	})
}

// GetTickets handles fetching all helpdesk tickets for admin review
func (hc *HelpdeskController) GetTickets(c *gin.Context) {
	statusFilter := c.DefaultQuery("status", "")
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset := (page - 1) * limit

	query := `
		SELECT id, COALESCE(user_id, 0), name, email, COALESCE(phone, ''), service,
		       COALESCE(message, ''), COALESCE(details, '{}'), status,
		       COALESCE(admin_remarks, ''), created_at, updated_at
		FROM helpdesk_tickets
	`
	countQuery := "SELECT COUNT(*) FROM helpdesk_tickets"
	args := []interface{}{}
	countArgs := []interface{}{}

	if statusFilter != "" {
		query += " WHERE status = ?"
		countQuery += " WHERE status = ?"
		args = append(args, statusFilter)
		countArgs = append(countArgs, statusFilter)
	}

	// Get total count
	var total int
	hc.db.QueryRow(countQuery, countArgs...).Scan(&total)

	query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
	args = append(args, limit, offset)

	rows, err := hc.db.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch tickets",
			"error":   err.Error(),
		})
		return
	}
	defer rows.Close()

	var tickets []gin.H
	for rows.Next() {
		var id, userID int
		var name, email, phone, service, message, details, status, adminRemarks, createdAt, updatedAt string
		err := rows.Scan(&id, &userID, &name, &email, &phone, &service, &message, &details, &status, &adminRemarks, &createdAt, &updatedAt)
		if err != nil {
			continue
		}

		tickets = append(tickets, gin.H{
			"id":           id,
			"userId":       userID,
			"name":         name,
			"email":        email,
			"phone":        phone,
			"service":      service,
			"message":      message,
			"details":      details,
			"status":       status,
			"adminRemarks": adminRemarks,
			"createdAt":    createdAt,
			"updatedAt":    updatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    tickets,
		"pagination": gin.H{
			"total": total,
			"page":  page,
			"limit": limit,
			"pages": (total + limit - 1) / limit,
		},
	})
}

// ResolveTicket handles resolving a helpdesk ticket by admin
func (hc *HelpdeskController) ResolveTicket(c *gin.Context) {
	ticketID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid ticket ID",
		})
		return
	}

	var req struct {
		AdminRemarks string `json:"adminRemarks"`
	}
	c.ShouldBindJSON(&req)

	query := "UPDATE helpdesk_tickets SET status = 'resolved', admin_remarks = ?, updated_at = NOW() WHERE id = ?"
	result, err := hc.db.Exec(query, req.AdminRemarks, ticketID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to resolve ticket",
			"error":   err.Error(),
		})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Ticket not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Ticket resolved successfully",
	})
}

// GetUserTickets handles fetching helpdesk tickets submitted by the logged-in user
func (hc *HelpdeskController) GetUserTickets(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Unauthorized access",
		})
		return
	}

	query := `
		SELECT id, name, email, COALESCE(phone, ''), service,
		       COALESCE(message, ''), COALESCE(details, '{}'), status,
		       COALESCE(admin_remarks, ''), created_at, updated_at
		FROM helpdesk_tickets
		WHERE user_id = ?
		ORDER BY created_at DESC
	`

	rows, err := hc.db.Query(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch user tickets",
			"error":   err.Error(),
		})
		return
	}
	defer rows.Close()

	tickets := []gin.H{}
	for rows.Next() {
		var id int
		var name, email, phone, service, message, details, status, adminRemarks, createdAt, updatedAt string
		err := rows.Scan(&id, &name, &email, &phone, &service, &message, &details, &status, &adminRemarks, &createdAt, &updatedAt)
		if err != nil {
			continue
		}

		tickets = append(tickets, gin.H{
			"id":           id,
			"userId":       userID,
			"name":         name,
			"email":        email,
			"phone":        phone,
			"service":      service,
			"message":      message,
			"details":      details,
			"status":       status,
			"adminRemarks": adminRemarks,
			"createdAt":    createdAt,
			"updatedAt":    updatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    tickets,
	})
}

