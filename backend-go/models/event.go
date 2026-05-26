package models

import (
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"time"
)

// Event represents an event in the system
type Event struct {
	ID                   int             `json:"id"`
	Title                string          `json:"title" validate:"required,min=3,max=200"`
	Description          string          `json:"description" validate:"required,min=10,max=2000"`
	Date                 time.Time       `json:"date" validate:"required"`
	Time                 string          `json:"time" validate:"required"`
	EndTime              string          `json:"endTime"`
	Location             string          `json:"location" validate:"required"`
	Category             string          `json:"category" validate:"required,oneof=academic cultural sports workshop networking alumni career"`
	Type                 string          `json:"type" validate:"required,oneof=online offline hybrid"`
	Status               string          `json:"status" validate:"required,oneof=upcoming completed cancelled"`
	Organizer            EventOrganizer  `json:"organizer"`
	Attendees            EventAttendees  `json:"attendees"`
	MaxAttendees         int             `json:"maxAttendees" validate:"min=1"`
	CurrentAttendees     int             `json:"currentAttendees"`
	Image                string          `json:"image"`
	Tags                 JSONStringSlice `json:"tags"`
	IsFeatured           bool            `json:"isFeatured"`
	IsPublic             bool            `json:"isPublic"`
	RegistrationDeadline *time.Time      `json:"registrationDeadline,omitempty"`
	CreatedAt            time.Time       `json:"createdAt"`
	UpdatedAt            time.Time       `json:"updatedAt"`
	CreatedBy            int             `json:"createdBy"`
}

// EventOrganizer represents event organizer information
type EventOrganizer struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	Phone      string `json:"phone"`
	Department string `json:"department"`
}

// Value implements the driver.Valuer interface
func (eo EventOrganizer) Value() (driver.Value, error) {
	return json.Marshal(eo)
}

// Scan implements the sql.Scanner interface
func (eo *EventOrganizer) Scan(value interface{}) error {
	if value == nil {
		return nil
	}
	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, eo)
	case string:
		return json.Unmarshal([]byte(v), eo)
	default:
		return fmt.Errorf("unsupported type for EventOrganizer Scan")
	}
}

// EventAttendee represents an event attendee
type EventAttendee struct {
	UserID       int          `json:"userId"`
	Name         string       `json:"name"`
	Email        string       `json:"email"`
	Phone        string       `json:"phone"`
	RegisteredAt time.Time    `json:"registeredAt"`
	Status       string       `json:"status" validate:"required,oneof=registered confirmed cancelled"`
	Payment      EventPayment `json:"payment,omitempty"`
}

// EventAttendees is a custom type for a slice of EventAttendee that implements sql.Scanner and driver.Valuer
type EventAttendees []EventAttendee

// Value implements the driver.Valuer interface
func (ea EventAttendees) Value() (driver.Value, error) {
	if ea == nil {
		return []byte("[]"), nil
	}
	return json.Marshal(ea)
}

// Scan implements the sql.Scanner interface
func (ea *EventAttendees) Scan(value interface{}) error {
	if value == nil {
		*ea = nil
		return nil
	}
	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, ea)
	case string:
		return json.Unmarshal([]byte(v), ea)
	default:
		return fmt.Errorf("unsupported type for EventAttendees Scan")
	}
}

// EventPayment represents event payment information
type EventPayment struct {
	Status        string     `json:"status" validate:"required,oneof=pending paid failed refunded"`
	Amount        float64    `json:"amount"`
	Method        string     `json:"method"`
	TransactionID string     `json:"transactionId"`
	PaidAt        *time.Time `json:"paidAt,omitempty"`
}

// CreateEventRequest represents the request body for creating an event
type CreateEventRequest struct {
	Title                string         `json:"title" validate:"required,min=3,max=200"`
	Description          string         `json:"description" validate:"required,min=10,max=2000"`
	Date                 time.Time      `json:"date" validate:"required"`
	Time                 string         `json:"time" validate:"required"`
	EndTime              string         `json:"endTime"`
	Location             string         `json:"location" validate:"required"`
	Category             string         `json:"category" validate:"required,oneof=academic cultural sports workshop networking alumni career"`
	Type                 string         `json:"type" validate:"required,oneof=online offline hybrid"`
	MaxAttendees         int            `json:"maxAttendees" validate:"min=1"`
	Image                string         `json:"image"`
	Tags                 []string       `json:"tags"`
	IsPublic             bool           `json:"isPublic"`
	RegistrationDeadline *time.Time     `json:"registrationDeadline,omitempty"`
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
	TotalEvents      int            `json:"totalEvents"`
	UpcomingEvents   int            `json:"upcomingEvents"`
	CompletedEvents  int            `json:"completedEvents"`
	TotalAttendees   int            `json:"totalAttendees"`
	EventsByCategory map[string]int `json:"eventsByCategory"`
	EventsByType     map[string]int `json:"eventsByType"`
}

