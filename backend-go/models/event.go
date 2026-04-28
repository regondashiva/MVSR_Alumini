package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Event represents an event in the system
type Event struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title" validate:"required,min=3,max=200"`
	Description string             `bson:"description" json:"description" validate:"required,min=10,max=2000"`
	Date        time.Time          `bson:"date" json:"date" validate:"required"`
	Time        string             `bson:"time" json:"time" validate:"required"`
	EndTime     string             `bson:"endTime" json:"endTime"`
	Location    string             `bson:"location" json:"location" validate:"required"`
	Category    string             `bson:"category" json:"category" validate:"required,oneof=academic cultural sports workshop networking alumni career"`
	Type        string             `bson:"type" json:"type" validate:"required,oneof=online offline hybrid"`
	Status      string             `bson:"status" json:"status" validate:"required,oneof=upcoming completed cancelled"`
	Organizer   EventOrganizer     `bson:"organizer" json:"organizer"`
	Attendees   []EventAttendee    `bson:"attendees" json:"attendees"`
	MaxAttendees int               `bson:"maxAttendees" json:"maxAttendees" validate:"min=1"`
	CurrentAttendees int           `bson:"currentAttendees" json:"currentAttendees"`
	Image       string             `bson:"image" json:"image"`
	Tags        []string           `bson:"tags" json:"tags"`
	IsFeatured  bool               `bson:"isFeatured" json:"isFeatured"`
	IsPublic    bool               `bson:"isPublic" json:"isPublic"`
	RegistrationDeadline *time.Time `bson:"registrationDeadline,omitempty" json:"registrationDeadline,omitempty"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
	CreatedBy   primitive.ObjectID `bson:"createdBy" json:"createdBy"`
}

// EventOrganizer represents event organizer information
type EventOrganizer struct {
	ID       string `bson:"id" json:"id"`
	Name     string `bson:"name" json:"name"`
	Email    string `bson:"email" json:"email"`
	Phone    string `bson:"phone" json:"phone"`
	Department string `bson:"department" json:"department"`
}

// EventAttendee represents an event attendee
type EventAttendee struct {
	UserID      primitive.ObjectID `bson:"userId" json:"userId"`
	Name        string             `bson:"name" json:"name"`
	Email       string             `bson:"email" json:"email"`
	Phone       string             `bson:"phone" json:"phone"`
	RegisteredAt time.Time        `bson:"registeredAt" json:"registeredAt"`
	Status      string             `bson:"status" json:"status" validate:"required,oneof=registered confirmed cancelled"`
	Payment     EventPayment       `bson:"payment,omitempty" json:"payment,omitempty"`
}

// EventPayment represents event payment information
type EventPayment struct {
	Status       string    `bson:"status" json:"status" validate:"required,oneof=pending paid failed refunded"`
	Amount       float64   `bson:"amount" json:"amount"`
	Method       string    `bson:"method" json:"method"`
	TransactionID string   `bson:"transactionId" json:"transactionId"`
	PaidAt       *time.Time `bson:"paidAt,omitempty" json:"paidAt,omitempty"`
}

// CreateEventRequest represents the request body for creating an event
type CreateEventRequest struct {
	Title                string    `json:"title" validate:"required,min=3,max=200"`
	Description          string    `json:"description" validate:"required,min=10,max=2000"`
	Date                 time.Time `json:"date" validate:"required"`
	Time                 string    `json:"time" validate:"required"`
	EndTime              string    `json:"endTime"`
	Location             string    `json:"location" validate:"required"`
	Category             string    `json:"category" validate:"required,oneof=academic cultural sports workshop networking alumni career"`
	Type                 string    `json:"type" validate:"required,oneof=online offline hybrid"`
	MaxAttendees         int       `json:"maxAttendees" validate:"min=1"`
	Image                string    `json:"image"`
	Tags                 []string  `json:"tags"`
	IsPublic             bool      `json:"isPublic"`
	RegistrationDeadline *time.Time `json:"registrationDeadline,omitempty"`
	Organizer            EventOrganizer `json:"organizer" validate:"required"`
}

// UpdateEventRequest represents the request body for updating an event
type UpdateEventRequest struct {
	Title                *string    `json:"title,omitempty" validate:"omitempty,min=3,max=200"`
	Description          *string    `json:"description,omitempty" validate:"omitempty,min=10,max=2000"`
	Date                 *time.Time `json:"date,omitempty"`
	Time                 *string    `json:"time,omitempty"`
	EndTime              *string    `json:"endTime,omitempty"`
	Location             *string    `json:"location,omitempty"`
	Category             *string    `json:"category,omitempty" validate:"omitempty,oneof=academic cultural sports workshop networking alumni career"`
	Type                 *string    `json:"type,omitempty" validate:"omitempty,oneof=online offline hybrid"`
	Status               *string    `json:"status,omitempty" validate:"omitempty,oneof=upcoming completed cancelled"`
	MaxAttendees         *int       `json:"maxAttendees,omitempty" validate:"omitempty,min=1"`
	Image                *string    `json:"image,omitempty"`
	Tags                 *[]string  `json:"tags,omitempty"`
	IsFeatured           *bool      `json:"isFeatured,omitempty"`
	IsPublic             *bool      `json:"isPublic,omitempty"`
	RegistrationDeadline *time.Time `json:"registrationDeadline,omitempty"`
}

// RegisterEventRequest represents the request body for event registration
type RegisterEventRequest struct {
	EventID string `json:"eventId" validate:"required"`
}

// EventFilter represents filters for querying events
type EventFilter struct {
	Category string `form:"category"`
	Type     string `form:"type"`
	Status   string `form:"status"`
	DateFrom string `form:"dateFrom"`
	DateTo   string `form:"dateTo"`
	Search   string `form:"search"`
	Page     int    `form:"page,default=1"`
	Limit    int    `form:"limit,default=10"`
	Sort     string `form:"sort,default=createdAt"`
	Order    string `form:"order,default=desc"`
}

// EventStats represents event statistics
type EventStats struct {
	TotalEvents       int `json:"totalEvents"`
	UpcomingEvents    int `json:"upcomingEvents"`
	CompletedEvents   int `json:"completedEvents"`
	TotalAttendees    int `json:"totalAttendees"`
	EventsByCategory  map[string]int `json:"eventsByCategory"`
	EventsByType      map[string]int `json:"eventsByType"`
}
