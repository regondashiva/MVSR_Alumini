package controllers

import (
	"net/http"

	"mvsr-backend/config"
	"mvsr-backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
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

	cursor, err := db.Collection("users").Find(ctx, bson.M{
		"isVerified": true,
		"isActive":   true,
		"role":       bson.M{"$in": []string{"alumni", "student", "faculty"}},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch alumni",
		})
		return
	}
	defer cursor.Close(ctx)

	var alumni []models.User
	if err = cursor.All(ctx, &alumni); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to decode alumni data",
		})
		return
	}

	var alumniData []map[string]interface{}
	for _, user := range alumni {
		alumniData = append(alumniData, map[string]interface{}{
			"id":              user.ID.Hex(),
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
			"skills":          user.Profile.ProcessSkills,
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

	filter := bson.M{
		"isVerified": true,
		"isActive":   true,
		"role":       bson.M{"$in": []string{"alumni", "student", "faculty"}},
	}

	if name != "" {
		filter["$or"] = []bson.M{
			{"firstName": bson.M{"$regex": name, "$options": "i"}},
			{"lastName": bson.M{"$regex": name, "$options": "i"}},
		}
	}
	if company != "" {
		filter["profile.company"] = bson.M{"$regex": company, "$options": "i"}
	}
	if city != "" {
		filter["address"] = bson.M{"$regex": city, "$options": "i"}
	}
	if state != "" {
		filter["address"] = bson.M{"$regex": state, "$options": "i"}
	}
	if country != "" {
		filter["address"] = bson.M{"$regex": country, "$options": "i"}
	}
	if department != "" {
		filter["department"] = bson.M{"$regex": department, "$options": "i"}
	}
	if college != "" {
		filter["college"] = bson.M{"$regex": college, "$options": "i"}
	}
	if industry != "" {
		filter["profile.industry"] = bson.M{"$regex": industry, "$options": "i"}
	}

	cursor, err := db.Collection("users").Find(ctx, filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to search alumni",
		})
		return
	}
	defer cursor.Close(ctx)

	var alumni []models.User
	if err = cursor.All(ctx, &alumni); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to decode alumni data",
		})
		return
	}

	var alumniData []map[string]interface{}
	for _, user := range alumni {
		alumniData = append(alumniData, map[string]interface{}{
			"id":              user.ID.Hex(),
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
			"skills":          user.Profile.ProcessSkills,
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
