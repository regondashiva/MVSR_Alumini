package controllers

import (
	"net/http"
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
		SELECT id, first_name, last_name, email, roll_number, country_code, 
		       phone_number, address, college, department, passout_year, role, 
		       is_verified, is_active, profile_company, profile_role, 
		       profile_experience_years, profile_industry, profile_skills, 
		       created_at, updated_at
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
		SELECT id, first_name, last_name, email, roll_number, country_code, 
		       phone_number, address, college, department, passout_year, role, 
		       is_verified, is_active, profile_company, profile_role, 
		       profile_experience_years, profile_industry, profile_skills, 
		       created_at, updated_at
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
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Alumni connection not implemented yet",
	})
}

func (ac *AlumniController) DisconnectFromAlumni(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Alumni disconnection not implemented yet",
	})
}

func (ac *AlumniController) GetConnections(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Alumni connections not implemented yet",
	})
}

func (ac *AlumniController) GetAlumniStats(c *gin.Context) {
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Alumni statistics not implemented yet",
	})
}

