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

type UserController struct {
	cfg *config.Config
}

func NewUserController(cfg *config.Config) *UserController {
	return &UserController{cfg: cfg}
}

// GetAllUsers handles fetching all users (admin only)
func (uc *UserController) GetAllUsers(c *gin.Context) {
	ctx := c.Request.Context()
	db := config.GetDatabase()

	cursor, err := db.Collection("users").Find(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch users"})
		return
	}

	var users []models.User
	if err := cursor.All(ctx, &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to decode users"})
		return
	}

	// Remove passwords from response
	for i := range users {
		users[i].Password = ""
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Users fetched successfully",
		"data":    gin.H{"users": users},
		"count":   len(users),
	})
}

// GetUsersByRole handles fetching users by role
func (uc *UserController) GetUsersByRole(c *gin.Context) {
	ctx := c.Request.Context()
	db := config.GetDatabase()

	role := c.Param("role")
	if role == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Role parameter is required"})
		return
	}

	// Validate role
	validRoles := []string{"admin", "alumni", "student", "faculty"}
	isValidRole := false
	for _, validRole := range validRoles {
		if role == validRole {
			isValidRole = true
			break
		}
	}
	if !isValidRole {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid role"})
		return
	}

	cursor, err := db.Collection("users").Find(ctx, bson.M{"role": role})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch users"})
		return
	}

	var users []models.User
	if err := cursor.All(ctx, &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to decode users"})
		return
	}

	// Remove passwords from response
	for i := range users {
		users[i].Password = ""
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Users fetched successfully",
		"data":    gin.H{"users": users},
		"count":   len(users),
	})
}

// GetAdmins handles fetching all admin users
func (uc *UserController) GetAdmins(c *gin.Context) {
	ctx := c.Request.Context()
	db := config.GetDatabase()

	cursor, err := db.Collection("users").Find(ctx, bson.M{"role": "admin"})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch admins"})
		return
	}

	var admins []models.User
	if err := cursor.All(ctx, &admins); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to decode admins"})
		return
	}

	// Remove passwords from response
	for i := range admins {
		admins[i].Password = ""
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Admins fetched successfully",
		"data":    gin.H{"admins": admins},
		"count":   len(admins),
	})
}

// GetStudents handles fetching all student users
func (uc *UserController) GetStudents(c *gin.Context) {
	ctx := c.Request.Context()
	db := config.GetDatabase()

	cursor, err := db.Collection("users").Find(ctx, bson.M{"role": "student"})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch students"})
		return
	}

	var students []models.User
	if err := cursor.All(ctx, &students); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to decode students"})
		return
	}

	// Remove passwords from response
	for i := range students {
		students[i].Password = ""
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Students fetched successfully",
		"data":    gin.H{"students": students},
		"count":   len(students),
	})
}

// GetAlumniUsers handles fetching all alumni users
func (uc *UserController) GetAlumniUsers(c *gin.Context) {
	ctx := c.Request.Context()
	db := config.GetDatabase()

	cursor, err := db.Collection("users").Find(ctx, bson.M{"role": "alumni"})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch alumni"})
		return
	}

	var alumni []models.User
	if err := cursor.All(ctx, &alumni); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to decode alumni"})
		return
	}

	// Remove passwords from response
	for i := range alumni {
		alumni[i].Password = ""
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Alumni fetched successfully",
		"data":    gin.H{"alumni": alumni},
		"count":   len(alumni),
	})
}

// GetUsersStatistics handles fetching user statistics by role
func (uc *UserController) GetUsersStatistics(c *gin.Context) {
	ctx := c.Request.Context()
	db := config.GetDatabase()

	// Get counts for each role
	adminCount, _ := db.Collection("users").CountDocuments(ctx, bson.M{"role": "admin"})
	alumniCount, _ := db.Collection("users").CountDocuments(ctx, bson.M{"role": "alumni"})
	studentCount, _ := db.Collection("users").CountDocuments(ctx, bson.M{"role": "student"})
	facultyCount, _ := db.Collection("users").CountDocuments(ctx, bson.M{"role": "faculty"})

	// Get total users
	totalCount, _ := db.Collection("users").CountDocuments(ctx, bson.M{})

	// Get verified users count
	verifiedCount, _ := db.Collection("users").CountDocuments(ctx, bson.M{"isVerified": true})

	// Get active users count
	activeCount, _ := db.Collection("users").CountDocuments(ctx, bson.M{"isActive": true})

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User statistics fetched successfully",
		"data": gin.H{
			"totalUsers":    totalCount,
			"verifiedUsers": verifiedCount,
			"activeUsers":   activeCount,
			"byRole": gin.H{
				"admin":   adminCount,
				"alumni":  alumniCount,
				"student": studentCount,
				"faculty": facultyCount,
			},
		},
	})
}

// GetPendingRegistrations handles fetching pending registrations for admin approval
func (uc *UserController) GetPendingRegistrations(c *gin.Context) {
	ctx := c.Request.Context()
	db := config.GetDatabase()

	// Fetch unverified users
	cursor, err := db.Collection("users").Find(ctx, bson.M{
		"isVerified": false,
		"isActive":   true,
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch pending registrations",
		})
		return
	}
	defer cursor.Close(ctx)

	var users []models.User
	if err = cursor.All(ctx, &users); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to decode users",
		})
		return
	}

	// Remove passwords from response
	for i := range users {
		users[i].Password = ""
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Pending registrations fetched successfully",
		"data":    users,
		"count":   len(users),
	})
}

// ApproveRegistration handles approving a user registration
func (uc *UserController) ApproveRegistration(c *gin.Context) {
	ctx := c.Request.Context()
	db := config.GetDatabase()

	// Get user ID from URL parameter
	userID := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid user ID",
		})
		return
	}

	// Update user to verified status
	update := bson.M{
		"$set": bson.M{
			"isVerified": true,
			"updatedAt":  time.Now(),
		},
	}

	result, err := db.Collection("users").UpdateOne(ctx, bson.M{"_id": objectID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to approve registration",
		})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Registration approved successfully",
	})
}

// RejectRegistration handles rejecting a user registration
func (uc *UserController) RejectRegistration(c *gin.Context) {
	ctx := c.Request.Context()
	db := config.GetDatabase()

	// Get user ID from URL parameter
	userID := c.Param("id")
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid user ID",
		})
		return
	}

	// Delete user from database
	result, err := db.Collection("users").DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to reject registration",
		})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "User not found",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Registration rejected successfully",
	})
}

// GetUser handles fetching a single user
func (uc *UserController) GetUser(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "User ID is required"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid user ID"})
		return
	}

	ctx := c.Request.Context()
	db := config.GetDatabase()

	var user models.User
	err = db.Collection("users").FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch user"})
		}
		return
	}

	// Remove password from response
	user.Password = ""

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User fetched successfully",
		"data":    gin.H{"user": user},
	})
}

// UpdateUser handles updating a user (admin only)
func (uc *UserController) UpdateUser(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "User ID is required"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid user ID"})
		return
	}

	var req models.UpdateUserRequest
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

	// Build update document
	update := bson.M{"updatedAt": time.Now()}
	if req.FirstName != nil {
		update["firstName"] = *req.FirstName
	}
	if req.LastName != nil {
		update["lastName"] = *req.LastName
	}
	if req.Phone != nil {
		update["phone"] = *req.Phone
	}
	if req.Profile != nil {
		update["profile"] = *req.Profile
	}
	if req.Social != nil {
		update["social"] = *req.Social
	}
	if req.Preferences != nil {
		update["preferences"] = *req.Preferences
	}

	// Update user
	_, err = db.Collection("users").UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{"$set": update})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update user"})
		return
	}

	// Fetch updated user
	var user models.User
	err = db.Collection("users").FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch updated user"})
		return
	}

	// Remove password from response
	user.Password = ""

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User updated successfully",
		"data":    gin.H{"user": user},
	})
}

// DeleteUser handles deleting a user (admin only)
func (uc *UserController) DeleteUser(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "User ID is required"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid user ID"})
		return
	}

	ctx := c.Request.Context()
	db := config.GetDatabase()

	// Delete user
	_, err = db.Collection("users").DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to delete user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User deleted successfully",
	})
}

// VerifyUser handles verifying a user (admin only)
func (uc *UserController) VerifyUser(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "User ID is required"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid user ID"})
		return
	}

	ctx := c.Request.Context()
	db := config.GetDatabase()

	// Update user verification status
	_, err = db.Collection("users").UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{
		"$set": bson.M{
			"isVerified": true,
			"updatedAt":  time.Now(),
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to verify user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User verified successfully",
	})
}

// DeactivateUser handles deactivating a user (admin only)
func (uc *UserController) DeactivateUser(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "User ID is required"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid user ID"})
		return
	}

	ctx := c.Request.Context()
	db := config.GetDatabase()

	// Deactivate user
	_, err = db.Collection("users").UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{
		"$set": bson.M{
			"isActive":  false,
			"updatedAt": time.Now(),
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to deactivate user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User deactivated successfully",
	})
}

// ActivateUser handles activating a user (admin only)
func (uc *UserController) ActivateUser(c *gin.Context) {
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "User ID is required"})
		return
	}

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid user ID"})
		return
	}

	ctx := c.Request.Context()
	db := config.GetDatabase()

	// Activate user
	_, err = db.Collection("users").UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{
		"$set": bson.M{
			"isActive":  true,
			"updatedAt": time.Now(),
		},
	})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to activate user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "User activated successfully",
	})
}

// GetSystemStats handles fetching system statistics (admin only)
func (uc *UserController) GetSystemStats(c *gin.Context) {
	ctx := c.Request.Context()
	db := config.GetDatabase()

	// Get total users
	totalUsers, err := db.Collection("users").CountDocuments(ctx, bson.M{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to count users"})
		return
	}

	// Get active users
	activeUsers, err := db.Collection("users").CountDocuments(ctx, bson.M{"isActive": true})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to count active users"})
		return
	}

	// Get verified users
	verifiedUsers, err := db.Collection("users").CountDocuments(ctx, bson.M{"isVerified": true})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to count verified users"})
		return
	}

	// Get users by role
	pipeline := []bson.M{
		{"$group": bson.M{"_id": "$role", "count": bson.M{"$sum": 1}}},
	}
	cursor, err := db.Collection("users").Aggregate(ctx, pipeline)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to get users by role"})
		return
	}

	var roleResults []bson.M
	if err := cursor.All(ctx, &roleResults); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to decode role results"})
		return
	}

	usersByRole := make(map[string]int)
	for _, result := range roleResults {
		if role, ok := result["_id"].(string); ok {
			if count, ok := result["count"].(int32); ok {
				usersByRole[role] = int(count)
			}
		}
	}

	stats := gin.H{
		"totalUsers":    totalUsers,
		"activeUsers":   activeUsers,
		"verifiedUsers": verifiedUsers,
		"usersByRole":   usersByRole,
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "System statistics fetched successfully",
		"data":    gin.H{"stats": stats},
	})
}

// GetSystemLogs handles fetching system logs (admin only)
func (uc *UserController) GetSystemLogs(c *gin.Context) {
	// This is a placeholder for system logs implementation
	// In a real implementation, you would fetch logs from a logging system
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "System logs not implemented yet",
	})
}

// CreateBackup handles creating a system backup (admin only)
func (uc *UserController) CreateBackup(c *gin.Context) {
	// This is a placeholder for backup implementation
	// In a real implementation, you would create a database backup
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Backup creation not implemented yet",
	})
}

// RestoreBackup handles restoring a system backup (admin only)
func (uc *UserController) RestoreBackup(c *gin.Context) {
	// This is a placeholder for backup restoration implementation
	// In a real implementation, you would restore from a backup
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Backup restoration not implemented yet",
	})
}
