package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"
)

// User represents a user in the system
type User struct {
	ID          int             `json:"id"`
	FirstName   string          `json:"firstName" validate:"required,min=2,max=50"`
	LastName    string          `json:"lastName" validate:"required,min=2,max=50"`
	Email       string          `json:"email" validate:"required,email"`
	Password    string          `json:"-" validate:"required,min=6"`
	RollNumber  string          `json:"rollNumber" validate:"required"`
	CountryCode string          `json:"countryCode" validate:"required"`
	PhoneNumber string          `json:"phoneNumber" validate:"required"`
	Address     string          `json:"address" validate:"required"`
	College     string          `json:"college" validate:"required,oneof=matrusri mvsr"`
	Department  string          `json:"department" validate:"required"`
	PassoutYear string          `json:"passoutYear" validate:"required"`
	Role        string          `json:"role" validate:"required,oneof=admin alumni student faculty"`
	IsVerified  bool            `json:"isVerified"`
	IsActive    bool            `json:"isActive"`
	Profile     UserProfile     `json:"profile"`
	Social      SocialLinks     `json:"social"`
	Preferences UserPreferences `json:"preferences"`
	CreatedAt   time.Time       `json:"createdAt"`
	UpdatedAt   time.Time       `json:"updatedAt"`
	LastLogin   *time.Time      `json:"lastLogin,omitempty"`
}

// UserProfile contains user profile information
type UserProfile struct {
	Bio               string          `json:"bio"`
	Company           string          `json:"company"`
	OtherCompany      string          `json:"otherCompany"`
	Role              string          `json:"role"`
	ExperienceYears   int             `json:"experienceYears"`
	Industry          string          `json:"industry"`
	OtherIndustry     string          `json:"otherIndustry"`
	ProcessSkills     string          `json:"processSkills"`
	OtherSkills       string          `json:"otherSkills"`
	Location          string          `json:"location"`
	Website           string          `json:"website"`
	Skills            JSONStringSlice `json:"skills"`
	Experience        []Experience    `json:"experience"`
	Education         []Education     `json:"education"`
	Achievements      JSONStringSlice `json:"achievements"`
	Interests         JSONStringSlice `json:"interests"`
	ProfileImage      string          `json:"profileImage"`
	CoverImage        string          `json:"coverImage"`
	AdditionalCourses []Course        `json:"additionalCourses"`
	CurrentCourses    []Course        `json:"currentCourses"`
}

// Experience represents work experience
type Experience struct {
	ID           string          `json:"id"`
	Company      string          `json:"company"`
	Position     string          `json:"position"`
	StartDate    time.Time       `json:"startDate"`
	EndDate      *time.Time      `json:"endDate,omitempty"`
	Description  string          `json:"description"`
	Technologies JSONStringSlice `json:"technologies"`
	Current      bool            `json:"current"`
}

// Education represents educational background
type Education struct {
	ID          string    `json:"id"`
	Institution string    `json:"institution"`
	Degree      string    `json:"degree"`
	Field       string    `json:"field"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	Description string    `json:"description"`
}

// SocialLinks contains social media links
type SocialLinks struct {
	LinkedIn  string `json:"linkedin"`
	GitHub    string `json:"github"`
	Twitter   string `json:"twitter"`
	Facebook  string `json:"facebook"`
	Instagram string `json:"instagram"`
	YouTube   string `json:"youtube"`
}

// UserPreferences contains user preferences
type UserPreferences struct {
	EmailNotifications bool            `json:"emailNotifications"`
	PushNotifications  bool            `json:"pushNotifications"`
	Privacy            Privacy         `json:"privacy"`
	Theme              string          `json:"theme"`
	Language           string          `json:"language"`
	Timezone           string          `json:"timezone"`
	Interests          JSONStringSlice `json:"interests"`
}

// Privacy settings for user profile
type Privacy struct {
	ProfileVisibility string `json:"profileVisibility"`
	ContactInfo       string `json:"contactInfo"`
	ShowEmail         bool   `json:"showEmail"`
	ShowPhone         bool   `json:"showPhone"`
	ShowProfile       bool   `json:"showProfile"`
	AllowMessages     bool   `json:"allowMessages"`
	ShowConnections   bool   `json:"showConnections"`
}

// Course represents a course
type Course struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Institution string    `json:"institution"`
	StartDate   time.Time `json:"startDate"`
	EndDate     time.Time `json:"endDate"`
	Description string    `json:"description"`
	Certificate string    `json:"certificate"`
}

// JSONStringSlice is a custom type for handling JSON string slices in SQL
type JSONStringSlice []string

// Value implements the driver.Valuer interface
func (j JSONStringSlice) Value() (driver.Value, error) {
	if j == nil {
		return nil, nil
	}
	return json.Marshal(j)
}

// Scan implements the sql.Scanner interface
func (j *JSONStringSlice) Scan(value interface{}) error {
	if value == nil {
		*j = nil
		return nil
	}

	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, j)
	case string:
		return json.Unmarshal([]byte(v), j)
	default:
		return nil
	}
}

// CreateUserRequest represents the request body for creating a user
type CreateUserRequest struct {
	FirstName       string `json:"firstName" validate:"required,min=2,max=50"`
	LastName        string `json:"lastName" validate:"required,min=2,max=50"`
	Email           string `json:"email" validate:"required,email"`
	Password        string `json:"password" validate:"required,min=6"`
	RollNumber      string `json:"rollNumber" validate:"required"`
	CountryCode     string `json:"countryCode" validate:"required"`
	PhoneNumber     string `json:"phoneNumber" validate:"required"`
	Address         string `json:"address" validate:"required"`
	College         string `json:"college" validate:"required,oneof=matrusri mvsr"`
	Department      string `json:"department" validate:"required"`
	PassoutYear     string `json:"passoutYear" validate:"required"`
	Role            string `json:"role" validate:"required,oneof=admin alumni student faculty"`
	Company         string `json:"company" validate:"required"`
	Experience      int    `json:"experience" validate:"required"`
	RoleDescription string `json:"roleDescription" validate:"required"`
	Industry        string `json:"industry" validate:"required"`
	Skills          string `json:"skills" validate:"required"`
	OtherCompany    string `json:"otherCompany,omitempty"`
	OtherIndustry   string `json:"otherIndustry,omitempty"`
	OtherSkills     string `json:"otherSkills,omitempty"`
}

// LoginRequest represents the request body for login
type LoginRequest struct {
	RollNumber string `json:"rollNumber" validate:"required"`
	Password   string `json:"password" validate:"required"`
}

// LoginResponse represents the response body for login
type LoginResponse struct {
	Token     string    `json:"token"`
	User      User      `json:"user"`
	ExpiresAt time.Time `json:"expiresAt"`
}

// UpdateUserRequest represents the request body for updating a user
type UpdateUserRequest struct {
	FirstName   *string          `json:"firstName,omitempty" validate:"omitempty,min=2,max=50"`
	LastName    *string          `json:"lastName,omitempty" validate:"omitempty,min=2,max=50"`
	Phone       *string          `json:"phone,omitempty" validate:"omitempty,len=10"`
	Profile     *UserProfile     `json:"profile,omitempty"`
	Social      *SocialLinks     `json:"social,omitempty"`
	Preferences *UserPreferences `json:"preferences,omitempty"`
}

// ChangePasswordRequest represents the request body for changing password
type ChangePasswordRequest struct {
	CurrentPassword string `json:"currentPassword" validate:"required"`
	NewPassword     string `json:"newPassword" validate:"required,min=6"`
}

// OAuthUser represents user data from OAuth providers
type OAuthUser struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Avatar   string `json:"avatar"`
	Provider string `json:"provider"`
}

// OAuthProfile represents OAuth profile information
type OAuthProfile struct {
	ID       string `json:"id"`
	Avatar   string `json:"avatar"`
	Provider string `json:"provider"`
}
