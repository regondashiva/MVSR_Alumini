package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"mvsr-backend/config"
	"mvsr-backend/middleware"
	"mvsr-backend/models"
)

type EventController struct {
	cfg *config.Config
}

func NewEventController(cfg *config.Config) *EventController {
	return &EventController{cfg: cfg}
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

	ctx := c.Request.Context()
	db := config.GetDatabase()

	// Create event
	event := models.Event{
		ID:                   primitive.NewObjectID(),
		Title:                req.Title,
		Description:          req.Description,
		Date:                 req.Date,
		Time:                 req.Time,
		EndTime:              req.EndTime,
		Location:             req.Location,
		Category:             req.Category,
		Type:                 req.Type,
		Status:               "upcoming",
		Organizer:            req.Organizer,
		Attendees:            []models.EventAttendee{},
		MaxAttendees:         req.MaxAttendees,
		CurrentAttendees:     0,
		Image:                req.Image,
		Tags:                 req.Tags,
		IsFeatured:           false,
		IsPublic:             req.IsPublic,
		RegistrationDeadline: req.RegistrationDeadline,
		CreatedAt:            time.Now(),
		UpdatedAt:            time.Now(),
		CreatedBy:            userID.(primitive.ObjectID),
	}

	// Insert event
	_, err := db.Collection("events").InsertOne(ctx, event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create event"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
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
	db := config.GetDatabase()

	// Build filter query
	query := bson.M{}
	if filter.Category != "" {
		query["category"] = filter.Category
	}
	if filter.Type != "" {
		query["type"] = filter.Type
	}
	if filter.Status != "" {
		query["status"] = filter.Status
	}
	if filter.Search != "" {
		query["$or"] = []bson.M{
			{"title": bson.M{"$regex": filter.Search, "$options": "i"}},
			{"description": bson.M{"$regex": filter.Search, "$options": "i"}},
			{"location": bson.M{"$regex": filter.Search, "$options": "i"}},
		}
	}
	if filter.DateFrom != "" || filter.DateTo != "" {
		dateQuery := bson.M{}
		if filter.DateFrom != "" {
			if dateFrom, err := time.Parse("2006-01-02", filter.DateFrom); err == nil {
				dateQuery["$gte"] = dateFrom
			}
		}
		if filter.DateTo != "" {
			if dateTo, err := time.Parse("2006-01-02", filter.DateTo); err == nil {
				dateQuery["$lte"] = dateTo
			}
		}
		if len(dateQuery) > 0 {
			query["date"] = dateQuery
		}
	}

	// Set default values
	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.Limit <= 0 {
		filter.Limit = 10
	}
	if filter.Limit > 100 {
		filter.Limit = 100
	}

	// Fetch events
	cursor, err := db.Collection("events").Find(ctx, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch events"})
		return
	}

	var events []models.Event
	if err := cursor.All(ctx, &events); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to decode events"})
		return
	}

	// Get total count
	total, err := db.Collection("events").CountDocuments(ctx, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to count events"})
		return
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
				"pages": (total + int64(filter.Limit) - 1) / int64(filter.Limit),
			},
		},
	})
}

// GetEvent handles fetching a single event
func (ec *EventController) GetEvent(c *gin.Context) {
	eventID := c.Param("id")
	if eventID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Event ID is required"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(eventID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid event ID"})
		return
	}

	ctx := c.Request.Context()
	db := config.GetDatabase()

	var event models.Event
	err = db.Collection("events").FindOne(ctx, bson.M{"_id": objectID}).Decode(&event)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Event not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch event"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Event fetched successfully",
		"data":    gin.H{"event": event},
	})
}

// UpdateEvent handles updating an event
func (ec *EventController) UpdateEvent(c *gin.Context) {
	eventID := c.Param("id")
	if eventID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Event ID is required"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(eventID)
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
	db := config.GetDatabase()

	// Check if event exists and user has permission
	var event models.Event
	err = db.Collection("events").FindOne(ctx, bson.M{"_id": objectID}).Decode(&event)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Event not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch event"})
		}
		return
	}

	// Check if user is the creator or admin
	if event.CreatedBy != userID.(primitive.ObjectID) {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Permission denied"})
		return
	}

	// Build update document
	update := bson.M{"updatedAt": time.Now()}
	if req.Title != nil {
		update["title"] = *req.Title
	}
	if req.Description != nil {
		update["description"] = *req.Description
	}
	if req.Date != nil {
		update["date"] = *req.Date
	}
	if req.Time != nil {
		update["time"] = *req.Time
	}
	if req.EndTime != nil {
		update["endTime"] = *req.EndTime
	}
	if req.Location != nil {
		update["location"] = *req.Location
	}
	if req.Category != nil {
		update["category"] = *req.Category
	}
	if req.Type != nil {
		update["type"] = *req.Type
	}
	if req.Status != nil {
		update["status"] = *req.Status
	}
	if req.MaxAttendees != nil {
		update["maxAttendees"] = *req.MaxAttendees
	}
	if req.Image != nil {
		update["image"] = *req.Image
	}
	if req.Tags != nil {
		update["tags"] = *req.Tags
	}
	if req.IsFeatured != nil {
		update["isFeatured"] = *req.IsFeatured
	}
	if req.IsPublic != nil {
		update["isPublic"] = *req.IsPublic
	}
	if req.RegistrationDeadline != nil {
		update["registrationDeadline"] = *req.RegistrationDeadline
	}

	// Update event
	_, err = db.Collection("events").UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{"$set": update})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update event"})
		return
	}

	// Fetch updated event
	err = db.Collection("events").FindOne(ctx, bson.M{"_id": objectID}).Decode(&event)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch updated event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Event updated successfully",
		"data":    gin.H{"event": event},
	})
}

// DeleteEvent handles deleting an event
func (ec *EventController) DeleteEvent(c *gin.Context) {
	eventID := c.Param("id")
	if eventID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Event ID is required"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(eventID)
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
	db := config.GetDatabase()

	// Check if event exists and user has permission
	var event models.Event
	err = db.Collection("events").FindOne(ctx, bson.M{"_id": objectID}).Decode(&event)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Event not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch event"})
		}
		return
	}

	// Check if user is the creator or admin
	if event.CreatedBy != userID.(primitive.ObjectID) {
		c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Permission denied"})
		return
	}

	// Delete event
	_, err = db.Collection("events").DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to delete event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Event deleted successfully",
	})
}

// RegisterForEvent handles event registration
func (ec *EventController) RegisterForEvent(c *gin.Context) {
	eventID := c.Param("id")
	if eventID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Event ID is required"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(eventID)
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
	db := config.GetDatabase()

	// Fetch event
	var event models.Event
	err = db.Collection("events").FindOne(ctx, bson.M{"_id": objectID}).Decode(&event)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Event not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch event"})
		}
		return
	}

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
		if attendee.UserID == userID.(primitive.ObjectID) {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Already registered for this event"})
			return
		}
	}

	// Fetch user details
	var user models.User
	err = db.Collection("users").FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch user details"})
		return
	}

	// Add attendee
	attendee := models.EventAttendee{
		UserID:       userID.(primitive.ObjectID),
		Name:         user.FirstName + " " + user.LastName,
		Email:        user.Email,
		Phone:        user.CountryCode + " " + user.PhoneNumber,
		RegisteredAt: time.Now(),
		Status:       "registered",
	}

	_, err = db.Collection("events").UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{
		"$push": bson.M{"attendees": attendee},
		"$inc":  bson.M{"currentAttendees": 1},
		"$set":  bson.M{"updatedAt": time.Now()},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to register for event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Successfully registered for event",
	})
}

// UnregisterFromEvent handles event unregistration
func (ec *EventController) UnregisterFromEvent(c *gin.Context) {
	eventID := c.Param("id")
	if eventID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Event ID is required"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(eventID)
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
	db := config.GetDatabase()

	// Remove attendee
	_, err = db.Collection("events").UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{
		"$pull": bson.M{"attendees": bson.M{"userId": userID}},
		"$inc":  bson.M{"currentAttendees": -1},
		"$set":  bson.M{"updatedAt": time.Now()},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to unregister from event"})
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
	db := config.GetDatabase()

	// Build filter query
	query := bson.M{
		"$or": []bson.M{
			{"createdBy": userID},
			{"attendees.userId": userID},
		},
	}

	// Add additional filters
	if filter.Category != "" {
		query["category"] = filter.Category
	}
	if filter.Type != "" {
		query["type"] = filter.Type
	}
	if filter.Status != "" {
		query["status"] = filter.Status
	}

	// Set default values
	if filter.Page <= 0 {
		filter.Page = 1
	}
	if filter.Limit <= 0 {
		filter.Limit = 10
	}

	// Fetch events
	cursor, err := db.Collection("events").Find(ctx, query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch events"})
		return
	}

	var events []models.Event
	if err := cursor.All(ctx, &events); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to decode events"})
		return
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
	db := config.GetDatabase()

	// Get total events
	totalEvents, err := db.Collection("events").CountDocuments(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to count events"})
		return
	}

	// Get upcoming events
	upcomingEvents, err := db.Collection("events").CountDocuments(ctx, bson.M{"status": "upcoming"})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to count upcoming events"})
		return
	}

	// Get completed events
	completedEvents, err := db.Collection("events").CountDocuments(ctx, bson.M{"status": "completed"})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to count completed events"})
		return
	}

	// Get events by category
	pipeline := []bson.M{
		{"$group": bson.M{"_id": "$category", "count": bson.M{"$sum": 1}}},
	}
	cursor, err := db.Collection("events").Aggregate(ctx, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to get events by category"})
		return
	}

	var categoryResults []bson.M
	if err := cursor.All(ctx, &categoryResults); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to decode category results"})
		return
	}

	eventsByCategory := make(map[string]int)
	for _, result := range categoryResults {
		if category, ok := result["_id"].(string); ok {
			if count, ok := result["count"].(int32); ok {
				eventsByCategory[category] = int(count)
			}
		}
	}

	stats := models.EventStats{
		TotalEvents:      int(totalEvents),
		UpcomingEvents:   int(upcomingEvents),
		CompletedEvents:  int(completedEvents),
		EventsByCategory: eventsByCategory,
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Event statistics fetched successfully",
		"data":    gin.H{"stats": stats},
	})
}
