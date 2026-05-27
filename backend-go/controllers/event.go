package controllers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"mvsr-backend/config"
	"mvsr-backend/middleware"
	"mvsr-backend/models"
)

type EventController struct {
	cfg *config.Config
	db  *sql.DB
}

func NewEventController(cfg *config.Config) *EventController {
	return &EventController{
		cfg: cfg,
		db:  config.GetDatabase(),
	}
}

// CreateEvent handles creating a new event
func (ec *EventController) CreateEvent(c *gin.Context) {
	var req models.CreateEventRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request body", "errors": err.Error()})
		return
	}

	// Validate input
	if err := middleware.ValidateStruct(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Validation failed", "errors": err})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}
	role, _ := c.Get("role")
	isActive := false
	if r, ok := role.(string); ok && r == "admin" {
		isActive = true
	}

	ctx := c.Request.Context()

	// Create event object
	now := time.Now()
	event := models.Event{
		Title:            req.Title,
		Description:      req.Description,
		Date:             req.Date,
		Time:             req.Time,
		EndTime:          req.EndTime,
		Location:         req.Location,
		Category:         req.Category,
		Type:             req.Type,
		Status:           "upcoming",
		Organizer:        req.Organizer,
		Attendees:        models.EventAttendees{},
		MaxAttendees:     req.MaxAttendees,
		CurrentAttendees: 0,
		Image:            req.Image,
		Tags:             req.Tags,
		IsFeatured:       false,
	}
	newEvent := models.Event{
		Title:                event.Title,
		Description:          event.Description,
		Date:                 event.Date,
		Time:                 event.Time,
		EndTime:              event.EndTime,
		Location:             event.Location,
		Category:             event.Category,
		Type:                 event.Type,
		Status:               event.Status,
		Organizer:            event.Organizer,
		Attendees:            event.Attendees,
		MaxAttendees:         event.MaxAttendees,
		CurrentAttendees:     event.CurrentAttendees,
		Image:                event.Image,
		Tags:                 event.Tags,
		IsFeatured:           event.IsFeatured,
		IsPublic:             event.IsPublic,
		RegistrationDeadline: event.RegistrationDeadline,
		CreatedBy:            userID.(int),
		CreatedAt:            now,
		UpdatedAt:            now,
	}

	query := `
		INSERT INTO events (title, description, event_date, event_time, end_time, location, category, type, status, organizer, attendees, max_attendees, current_attendees, image_url, tags, is_featured, is_public, registration_deadline, created_by, is_active, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	_, err := ec.db.ExecContext(ctx, query,
		newEvent.Title, newEvent.Description, newEvent.Date, newEvent.Time, newEvent.EndTime,
		newEvent.Location, newEvent.Category, newEvent.Type, newEvent.Status, newEvent.Organizer,
		newEvent.Attendees, newEvent.MaxAttendees, newEvent.CurrentAttendees, newEvent.Image,
		newEvent.Tags, newEvent.IsFeatured, newEvent.IsPublic, newEvent.RegistrationDeadline,
		newEvent.CreatedBy, isActive, newEvent.CreatedAt, newEvent.UpdatedAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create event", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Event created successfully",
		"data":    gin.H{"event": event},
	})
}

// GetEvents handles fetching events with filters
func (ec *EventController) GetEvents(c *gin.Context) {
	var filter models.EventFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid query parameters"})
		return
	}

	ctx := c.Request.Context()

	// Build filter query
	query := `
		SELECT id, title, description, event_date, event_time, end_time, location, category, type, status, organizer, attendees, max_attendees, current_attendees, image_url, tags, is_featured, is_public, registration_deadline, created_by, created_at, updated_at
		FROM events
		WHERE is_active = true
	`
	var args []interface{}

	if filter.Category != "" {
		query += " AND category = ?"
		args = append(args, filter.Category)
	}
	if filter.Type != "" {
		query += " AND type = ?"
		args = append(args, filter.Type)
	}
	if filter.Status != "" {
		query += " AND status = ?"
		args = append(args, filter.Status)
	}
	if filter.Search != "" {
		query += " AND (title LIKE ? OR description LIKE ? OR location LIKE ?)"
		args = append(args, "%"+filter.Search+"%", "%"+filter.Search+"%", "%"+filter.Search+"%")
	}
	if filter.DateFrom != "" {
		if dateFrom, err := time.Parse("2006-01-02", filter.DateFrom); err == nil {
			query += " AND event_date >= ?"
			args = append(args, dateFrom)
		}
	}
	if filter.DateTo != "" {
		if dateTo, err := time.Parse("2006-01-02", filter.DateTo); err == nil {
			query += " AND event_date <= ?"
			args = append(args, dateTo)
		}
	}

	// Set default pagination values
	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.Limit <= 0 {
		filter.Limit = 10
	}
	if filter.Limit > 100 {
		filter.Limit = 100
	}

	// Get total count
	countQuery := "SELECT COUNT(*) FROM (" + query + ") AS count_table"
	var total int
	err := ec.db.QueryRowContext(ctx, countQuery, args...).Scan(&total)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to count events", "error": err.Error()})
		return
	}

	// Add order by and pagination
	query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
	args = append(args, filter.Limit, (filter.Page-1)*filter.Limit)

	// Fetch events
	rows, err := ec.db.QueryContext(ctx, query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch events", "error": err.Error()})
		return
	}
	defer rows.Close()

	var events []models.Event
	for rows.Next() {
		var event models.Event
		var eventDate time.Time
		var eventTime string
		err := rows.Scan(
			&event.ID, &event.Title, &event.Description, &eventDate, &eventTime, &event.EndTime,
			&event.Location, &event.Category, &event.Type, &event.Status, &event.Organizer, &event.Attendees,
			&event.MaxAttendees, &event.CurrentAttendees, &event.Image, &event.Tags, &event.IsFeatured,
			&event.IsPublic, &event.RegistrationDeadline, &event.CreatedBy, &event.CreatedAt, &event.UpdatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to scan event data", "error": err.Error()})
			return
		}
		event.Date = eventDate
		event.Time = eventTime
		events = append(events, event)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Events fetched successfully",
		"data": gin.H{
			"events": events,
			"pagination": gin.H{
				"page":  filter.Page,
				"limit": filter.Limit,
				"total": total,
				"pages": (total + filter.Limit - 1) / filter.Limit,
			},
		},
	})
}

// GetEvent handles fetching a single event
func (ec *EventController) GetEvent(c *gin.Context) {
	eventID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid event ID"})
		return
	}

	ctx := c.Request.Context()

	query := `
		SELECT id, title, description, event_date, event_time, end_time, location, category, type, status, organizer, attendees, max_attendees, current_attendees, image_url, tags, is_featured, is_public, registration_deadline, created_by, created_at, updated_at
		FROM events
		WHERE id = ? AND is_active = true
	`

	var event models.Event
	var eventDate time.Time
	var eventTime string
	err = ec.db.QueryRowContext(ctx, query, eventID).Scan(
		&event.ID, &event.Title, &event.Description, &eventDate, &eventTime, &event.EndTime,
		&event.Location, &event.Category, &event.Type, &event.Status, &event.Organizer, &event.Attendees,
		&event.MaxAttendees, &event.CurrentAttendees, &event.Image, &event.Tags, &event.IsFeatured,
		&event.IsPublic, &event.RegistrationDeadline, &event.CreatedBy, &event.CreatedAt, &event.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Event not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch event", "error": err.Error()})
		}
		return
	}
	event.Date = eventDate
	event.Time = eventTime

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Event fetched successfully",
		"data":    gin.H{"event": event},
	})
}

// UpdateEvent handles updating an event
func (ec *EventController) UpdateEvent(c *gin.Context) {
	eventID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid event ID"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	var req models.UpdateEventRequest
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

	// Check if event exists and user has permission
	var createdBy int
	err = ec.db.QueryRowContext(ctx, "SELECT created_by FROM events WHERE id = ? AND is_active = true", eventID).Scan(&createdBy)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Event not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch event", "error": err.Error()})
		}
		return
	}

	// Check if user is the creator
	if createdBy != userID.(int) {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Permission denied"})
		return
	}

	// Build update statement dynamically
	var updates []string
	var args []interface{}

	if req.Title != nil {
		updates = append(updates, "title = ?")
		args = append(args, *req.Title)
	}
	if req.Description != nil {
		updates = append(updates, "description = ?")
		args = append(args, *req.Description)
	}
	if req.Date != nil {
		updates = append(updates, "event_date = ?")
		args = append(args, *req.Date)
	}
	if req.Time != nil {
		updates = append(updates, "event_time = ?")
		args = append(args, *req.Time)
	}
	if req.EndTime != nil {
		updates = append(updates, "end_time = ?")
		args = append(args, *req.EndTime)
	}
	if req.Location != nil {
		updates = append(updates, "location = ?")
		args = append(args, *req.Location)
	}
	if req.Category != nil {
		updates = append(updates, "category = ?")
		args = append(args, *req.Category)
	}
	if req.Type != nil {
		updates = append(updates, "type = ?")
		args = append(args, *req.Type)
	}
	if req.Status != nil {
		updates = append(updates, "status = ?")
		args = append(args, *req.Status)
	}
	if req.MaxAttendees != nil {
		updates = append(updates, "max_attendees = ?")
		args = append(args, *req.MaxAttendees)
	}
	if req.Image != nil {
		updates = append(updates, "image_url = ?")
		args = append(args, *req.Image)
	}
	if req.Tags != nil {
		updates = append(updates, "tags = ?")
		tagsJSON, _ := json.Marshal(*req.Tags)
		args = append(args, string(tagsJSON))
	}
	if req.IsFeatured != nil {
		updates = append(updates, "is_featured = ?")
		args = append(args, *req.IsFeatured)
	}
	if req.IsPublic != nil {
		updates = append(updates, "is_public = ?")
		args = append(args, *req.IsPublic)
	}
	if req.RegistrationDeadline != nil {
		updates = append(updates, "registration_deadline = ?")
		args = append(args, *req.RegistrationDeadline)
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "No fields to update"})
		return
	}

	updates = append(updates, "updated_at = ?")
	args = append(args, time.Now())

	args = append(args, eventID)

	query := fmt.Sprintf("UPDATE events SET %s WHERE id = ?", strings.Join(updates, ", "))
	_, err = ec.db.ExecContext(ctx, query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update event", "error": err.Error()})
		return
	}

	// Fetch updated event
	var event models.Event
	var eventDate time.Time
	var eventTime string
	err = ec.db.QueryRowContext(ctx, "SELECT id, title, description, event_date, event_time, end_time, location, category, type, status, organizer, attendees, max_attendees, current_attendees, image_url, tags, is_featured, is_public, registration_deadline, created_by, created_at, updated_at FROM events WHERE id = ?", eventID).Scan(
		&event.ID, &event.Title, &event.Description, &eventDate, &eventTime, &event.EndTime,
		&event.Location, &event.Category, &event.Type, &event.Status, &event.Organizer, &event.Attendees,
		&event.MaxAttendees, &event.CurrentAttendees, &event.Image, &event.Tags, &event.IsFeatured,
		&event.IsPublic, &event.RegistrationDeadline, &event.CreatedBy, &event.CreatedAt, &event.UpdatedAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to retrieve updated event", "error": err.Error()})
		return
	}
	event.Date = eventDate
	event.Time = eventTime

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Event updated successfully",
		"data":    gin.H{"event": event},
	})
}

// DeleteEvent handles deleting an event
func (ec *EventController) DeleteEvent(c *gin.Context) {
	eventID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid event ID"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	ctx := c.Request.Context()

	// Check if event exists and user has permission
	var createdBy int
	err = ec.db.QueryRowContext(ctx, "SELECT created_by FROM events WHERE id = ? AND is_active = true", eventID).Scan(&createdBy)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Event not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch event", "error": err.Error()})
		}
		return
	}

	// Check if user is the creator
	if createdBy != userID.(int) {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Permission denied"})
		return
	}

	// Delete event
	_, err = ec.db.ExecContext(ctx, "DELETE FROM events WHERE id = ?", eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to delete event", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Event deleted successfully",
	})
}

// RegisterForEvent handles event registration
func (ec *EventController) RegisterForEvent(c *gin.Context) {
	eventID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid event ID"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	ctx := c.Request.Context()

	// Fetch event
	var event models.Event
	var eventDate time.Time
	var eventTime string
	err = ec.db.QueryRowContext(ctx, "SELECT id, title, description, event_date, event_time, end_time, location, category, type, status, organizer, attendees, max_attendees, current_attendees, image_url, tags, is_featured, is_public, registration_deadline, created_by, created_at, updated_at FROM events WHERE id = ? AND is_active = true", eventID).Scan(
		&event.ID, &event.Title, &event.Description, &eventDate, &eventTime, &event.EndTime,
		&event.Location, &event.Category, &event.Type, &event.Status, &event.Organizer, &event.Attendees,
		&event.MaxAttendees, &event.CurrentAttendees, &event.Image, &event.Tags, &event.IsFeatured,
		&event.IsPublic, &event.RegistrationDeadline, &event.CreatedBy, &event.CreatedAt, &event.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Event not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch event", "error": err.Error()})
		}
		return
	}
	event.Date = eventDate
	event.Time = eventTime

	// Check if registration is still open
	if event.RegistrationDeadline != nil && time.Now().After(*event.RegistrationDeadline) {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Registration deadline has passed"})
		return
	}

	// Check if event is full
	if event.CurrentAttendees >= event.MaxAttendees {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Event is full"})
		return
	}

	// Check if user is already registered
	for _, attendee := range event.Attendees {
		if attendee.UserID == userID.(int) {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Already registered for this event"})
			return
		}
	}

	// Fetch user details
	var user models.User
	err = ec.db.QueryRowContext(ctx, "SELECT first_name, last_name, email, country_code, phone_number FROM users WHERE id = ?", userID).Scan(
		&user.FirstName, &user.LastName, &user.Email, &user.CountryCode, &user.PhoneNumber,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch user details", "error": err.Error()})
		return
	}

	// Add attendee
	attendee := models.EventAttendee{
		UserID:       userID.(int),
		Name:         user.FirstName + " " + user.LastName,
		Email:        user.Email,
		Phone:        user.CountryCode + " " + user.PhoneNumber,
		RegisteredAt: time.Now(),
		Status:       "registered",
	}

	event.Attendees = append(event.Attendees, attendee)

	_, err = ec.db.ExecContext(ctx, "UPDATE events SET attendees = ?, current_attendees = current_attendees + 1, updated_at = ? WHERE id = ?", event.Attendees, time.Now(), eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to register for event", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Successfully registered for event",
	})
}

// UnregisterFromEvent handles event unregistration
func (ec *EventController) UnregisterFromEvent(c *gin.Context) {
	eventID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid event ID"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	ctx := c.Request.Context()

	// Fetch event
	var event models.Event
	var eventDate time.Time
	var eventTime string
	err = ec.db.QueryRowContext(ctx, "SELECT id, title, description, event_date, event_time, end_time, location, category, type, status, organizer, attendees, max_attendees, current_attendees, image_url, tags, is_featured, is_public, registration_deadline, created_by, created_at, updated_at FROM events WHERE id = ? AND is_active = true", eventID).Scan(
		&event.ID, &event.Title, &event.Description, &eventDate, &eventTime, &event.EndTime,
		&event.Location, &event.Category, &event.Type, &event.Status, &event.Organizer, &event.Attendees,
		&event.MaxAttendees, &event.CurrentAttendees, &event.Image, &event.Tags, &event.IsFeatured,
		&event.IsPublic, &event.RegistrationDeadline, &event.CreatedBy, &event.CreatedAt, &event.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Event not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch event", "error": err.Error()})
		}
		return
	}
	event.Date = eventDate
	event.Time = eventTime

	// Remove attendee
	found := false
	var updatedAttendees models.EventAttendees
	for _, attendee := range event.Attendees {
		if attendee.UserID == userID.(int) {
			found = true
		} else {
			updatedAttendees = append(updatedAttendees, attendee)
		}
	}

	if !found {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Not registered for this event"})
		return
	}

	_, err = ec.db.ExecContext(ctx, "UPDATE events SET attendees = ?, current_attendees = current_attendees - 1, updated_at = ? WHERE id = ?", updatedAttendees, time.Now(), eventID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to unregister from event", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Successfully unregistered from event",
	})
}

// GetMyEvents handles fetching user's events
func (ec *EventController) GetMyEvents(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}

	var filter models.EventFilter
	if err := c.ShouldBindQuery(&filter); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid query parameters"})
		return
	}

	ctx := c.Request.Context()

	// Build filter query: created by user OR user in attendees list
	query := `
		SELECT id, title, description, event_date, event_time, end_time, location, category, type, status, organizer, attendees, max_attendees, current_attendees, image_url, tags, is_featured, is_public, registration_deadline, created_by, created_at, updated_at
		FROM events
		WHERE is_active = true AND (created_by = ? OR JSON_CONTAINS(attendees, ?))
	`
	attendeeJSON := fmt.Sprintf(`{"userId":%d}`, userID.(int))
	var args = []interface{}{userID.(int), attendeeJSON}

	if filter.Category != "" {
		query += " AND category = ?"
		args = append(args, filter.Category)
	}
	if filter.Type != "" {
		query += " AND type = ?"
		args = append(args, filter.Type)
	}
	if filter.Status != "" {
		query += " AND status = ?"
		args = append(args, filter.Status)
	}

	// Set default values
	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.Limit <= 0 {
		filter.Limit = 10
	}

	query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
	args = append(args, filter.Limit, (filter.Page-1)*filter.Limit)

	// Fetch events
	rows, err := ec.db.QueryContext(ctx, query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch events", "error": err.Error()})
		return
	}
	defer rows.Close()

	var events []models.Event
	for rows.Next() {
		var event models.Event
		var eventDate time.Time
		var eventTime string
		err := rows.Scan(
			&event.ID, &event.Title, &event.Description, &eventDate, &eventTime, &event.EndTime,
			&event.Location, &event.Category, &event.Type, &event.Status, &event.Organizer, &event.Attendees,
			&event.MaxAttendees, &event.CurrentAttendees, &event.Image, &event.Tags, &event.IsFeatured,
			&event.IsPublic, &event.RegistrationDeadline, &event.CreatedBy, &event.CreatedAt, &event.UpdatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to scan event data", "error": err.Error()})
			return
		}
		event.Date = eventDate
		event.Time = eventTime
		events = append(events, event)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Events fetched successfully",
		"data":    gin.H{"events": events},
	})
}

// GetEventStats handles fetching event statistics
func (ec *EventController) GetEventStats(c *gin.Context) {
	ctx := c.Request.Context()

	// Get total events
	var totalEvents int
	err := ec.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM events").Scan(&totalEvents)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to count events", "error": err.Error()})
		return
	}

	// Get upcoming events
	var upcomingEvents int
	err = ec.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM events WHERE status = 'upcoming'").Scan(&upcomingEvents)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to count upcoming events", "error": err.Error()})
		return
	}

	// Get completed events
	var completedEvents int
	err = ec.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM events WHERE status = 'completed'").Scan(&completedEvents)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to count completed events", "error": err.Error()})
		return
	}

	// Get events by category
	rows, err := ec.db.QueryContext(ctx, "SELECT category, COUNT(*) FROM events GROUP BY category")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to get events by category", "error": err.Error()})
		return
	}
	defer rows.Close()

	eventsByCategory := make(map[string]int)
	for rows.Next() {
		var category string
		var count int
		if err := rows.Scan(&category, &count); err == nil {
			eventsByCategory[category] = count
		}
	}

	stats := models.EventStats{
		TotalEvents:      totalEvents,
		UpcomingEvents:   upcomingEvents,
		CompletedEvents:  completedEvents,
		EventsByCategory: eventsByCategory,
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Event statistics fetched successfully",
		"data":    gin.H{"stats": stats},
	})
}

// GetPendingEvents returns events with is_active = false for admin review
func (ec *EventController) GetPendingEvents(c *gin.Context) {
	ctx := c.Request.Context()
	query := `
		SELECT id, title, description, event_date, event_time, end_time, location, category, type, status, organizer, attendees, max_attendees, current_attendees, image_url, tags, is_featured, is_public, registration_deadline, created_by, created_at, updated_at
		FROM events
		WHERE is_active = false
		ORDER BY created_at DESC
	`

	rows, err := ec.db.QueryContext(ctx, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch pending events", "error": err.Error()})
		return
	}
	defer rows.Close()

	var events []models.Event
	for rows.Next() {
		var event models.Event
		var eventDate time.Time
		var eventTime string
		err := rows.Scan(
			&event.ID, &event.Title, &event.Description, &eventDate, &eventTime, &event.EndTime,
			&event.Location, &event.Category, &event.Type, &event.Status, &event.Organizer, &event.Attendees,
			&event.MaxAttendees, &event.CurrentAttendees, &event.Image, &event.Tags, &event.IsFeatured,
			&event.IsPublic, &event.RegistrationDeadline, &event.CreatedBy, &event.CreatedAt, &event.UpdatedAt,
		)
		if err != nil {
			continue
		}
		event.Date = eventDate
		event.Time = eventTime
		events = append(events, event)
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": events})
}

// ApproveEvent sets an event's is_active to true
func (ec *EventController) ApproveEvent(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid event ID"})
		return
	}

	ctx := c.Request.Context()
	result, err := ec.db.ExecContext(ctx, "UPDATE events SET is_active = true, updated_at = ? WHERE id = ?", time.Now(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to approve event", "error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Event not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Event approved successfully"})
}

// RejectEvent deletes a pending event posting
func (ec *EventController) RejectEvent(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid event ID"})
		return
	}

	ctx := c.Request.Context()
	result, err := ec.db.ExecContext(ctx, "DELETE FROM events WHERE id = ? AND is_active = false", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to reject event", "error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Event not found or already active"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Event rejected and removed"})
}
