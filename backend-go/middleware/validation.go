package middleware

import (
	"fmt"
	"net/http"
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
)

var validate = validator.New()

// ValidateStruct validates a struct using validator library
func ValidateStruct(s interface{}) error {
	if err := validate.Struct(s); err != nil {
		return fmt.Errorf("validation failed: %v", getValidationErrors(err))
	}
	return nil
}

// getValidationErrors extracts validation errors from validator error
func getValidationErrors(err error) map[string]string {
	errors := make(map[string]string)

	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, e := range validationErrors {
			field := e.Field()
			tag := e.Tag()

			switch tag {
			case "required":
				errors[field] = fmt.Sprintf("%s is required", field)
			case "email":
				errors[field] = "Please enter a valid email address"
			case "min":
				errors[field] = fmt.Sprintf("%s must be at least %s characters", field, e.Param())
			case "max":
				errors[field] = fmt.Sprintf("%s must be at most %s characters", field, e.Param())
			case "len":
				errors[field] = fmt.Sprintf("%s must be exactly %s characters", field, e.Param())
			case "oneof":
				errors[field] = fmt.Sprintf("%s must be one of: %s", field, e.Param())
			default:
				errors[field] = fmt.Sprintf("%s is invalid", field)
			}
		}
	}

	return errors
}

// ValidationMiddleware creates a validation middleware
func ValidationMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
	}
}

// ValidateJSON validates JSON request body
func ValidateJSON(obj interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := c.ShouldBindJSON(obj); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Invalid JSON format",
				"errors":  err.Error(),
			})
			c.Abort()
			return
		}

		if err := ValidateStruct(obj); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Validation failed",
				"errors":  err,
			})
			c.Abort()
			return
		}

		c.Set("validatedData", obj)
		c.Next()
	}
}

// ValidateQuery validates query parameters
func ValidateQuery(obj interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := c.ShouldBindQuery(obj); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Invalid query parameters",
				"errors":  err.Error(),
			})
			c.Abort()
			return
		}

		if err := ValidateStruct(obj); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Query validation failed",
				"errors":  err,
			})
			c.Abort()
			return
		}

		c.Set("validatedQuery", obj)
		c.Next()
	}
}

// ValidateForm validates form data
func ValidateForm(obj interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		if err := c.ShouldBind(obj); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Invalid form data",
				"errors":  err.Error(),
			})
			c.Abort()
			return
		}

		if err := ValidateStruct(obj); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"success": false,
				"message": "Form validation failed",
				"errors":  err,
			})
			c.Abort()
			return
		}

		c.Set("validatedForm", obj)
		c.Next()
	}
}

// CustomValidator allows adding custom validation functions
type CustomValidator struct {
	validator *validator.Validate
}

// NewCustomValidator creates a new custom validator
func NewCustomValidator() *CustomValidator {
	v := validator.New()

	// Register custom validators
	v.RegisterValidation("phone", validatePhone)
	v.RegisterValidation("rollnumber", validateRollNumber)
	v.RegisterValidation("batch", validateBatch)

	return &CustomValidator{validator: v}
}

// Validate validates a struct
func (cv *CustomValidator) Validate(s interface{}) error {
	return cv.validator.Struct(s)
}

// validatePhone validates phone number
func validatePhone(fl validator.FieldLevel) bool {
	phone := fl.Field().String()
	// Remove any non-digit characters
	digits := strings.Map(func(r rune) rune {
		if r >= '0' && r <= '9' {
			return r
		}
		return -1
	}, phone)

	return len(digits) == 10
}

// validateRollNumber validates roll number
func validateRollNumber(fl validator.FieldLevel) bool {
	rollNumber := fl.Field().String()
	// Roll number should be 4-6 digits
	if len(rollNumber) < 4 || len(rollNumber) > 6 {
		return false
	}

	// Check if all characters are digits
	for _, char := range rollNumber {
		if char < '0' || char > '9' {
			return false
		}
	}

	return true
}

// validateBatch validates batch year
func validateBatch(fl validator.FieldLevel) bool {
	batch := fl.Field().String()
	// Batch should be 4 digits
	if len(batch) != 4 {
		return false
	}

	// Check if all characters are digits
	for _, char := range batch {
		if char < '0' || char > '9' {
			return false
		}
	}

	return true
}

// GetFieldTags returns all validation tags for a struct field
func GetFieldTags(obj interface{}, fieldName string) []string {
	t := reflect.TypeOf(obj)
	if t.Kind() == reflect.Ptr {
		t = t.Elem()
	}

	if t.Kind() != reflect.Struct {
		return nil
	}

	field, found := t.FieldByName(fieldName)
	if !found {
		return nil
	}

	tag := field.Tag.Get("validate")
	if tag == "" {
		return nil
	}

	return strings.Split(tag, ",")
}

// HasValidationTag checks if a field has a specific validation tag
func HasValidationTag(obj interface{}, fieldName, tag string) bool {
	tags := GetFieldTags(obj, fieldName)
	for _, t := range tags {
		if strings.HasPrefix(t, tag) {
			return true
		}
	}
	return false
}
