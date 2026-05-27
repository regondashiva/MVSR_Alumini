package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"mvsr-backend/config"
)

type GalleryController struct {
	cfg *config.Config
	db  *sql.DB
}

type GalleryItem struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Image       string    `json:"image"`
	Category    string    `json:"category"`
	Tags        []string  `json:"tags"`
	IsActive    bool      `json:"isActive"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

func NewGalleryController(cfg *config.Config) *GalleryController {
	return &GalleryController{cfg: cfg, db: config.GetDatabase()}
}

// GetGallery handles fetching gallery
func (gc *GalleryController) GetGallery(c *gin.Context) {
	rows, err := gc.db.Query(`SELECT id, title, description, image_url, category, tags, is_active, created_at, updated_at FROM gallery WHERE is_active = true ORDER BY created_at DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch gallery", "error": err.Error()})
		return
	}
	defer rows.Close()

	var items []GalleryItem
	for rows.Next() {
		var item GalleryItem
		var tags sql.NullString
		if err := rows.Scan(&item.ID, &item.Title, &item.Description, &item.Image, &item.Category, &tags, &item.IsActive, &item.CreatedAt, &item.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to scan gallery item", "error": err.Error()})
			return
		}
		if tags.Valid {
			_ = json.Unmarshal([]byte(tags.String), &item.Tags)
		}
		items = append(items, item)
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Gallery fetched successfully", "data": gin.H{"gallery": items}})
}

// GetGalleryItem handles fetching a single gallery item
func (gc *GalleryController) GetGalleryItem(c *gin.Context) {
	itemID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid gallery item ID"})
		return
	}

	var item GalleryItem
	var tags sql.NullString
	query := `SELECT id, title, description, image_url, category, tags, is_active, created_at, updated_at FROM gallery WHERE id = ? AND is_active = true`
	if err := gc.db.QueryRow(query, itemID).Scan(&item.ID, &item.Title, &item.Description, &item.Image, &item.Category, &tags, &item.IsActive, &item.CreatedAt, &item.UpdatedAt); err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Gallery item not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch gallery item", "error": err.Error()})
		return
	}
	if tags.Valid {
		_ = json.Unmarshal([]byte(tags.String), &item.Tags)
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Gallery item fetched successfully", "data": gin.H{"gallery": item}})
}

// CreateGalleryItem handles creating a new gallery item
func (gc *GalleryController) CreateGalleryItem(c *gin.Context) {
	// This is a placeholder for gallery item creation implementation
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Gallery item creation not implemented yet",
	})
}

// UpdateGalleryItem handles updating a gallery item
func (gc *GalleryController) UpdateGalleryItem(c *gin.Context) {
	// This is a placeholder for gallery item update implementation
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Gallery item update not implemented yet",
	})
}

// DeleteGalleryItem handles deleting a gallery item
func (gc *GalleryController) DeleteGalleryItem(c *gin.Context) {
	// This is a placeholder for gallery item deletion implementation
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Gallery item deletion not implemented yet",
	})
}

// LikeGalleryItem handles liking a gallery item
func (gc *GalleryController) LikeGalleryItem(c *gin.Context) {
	// This is a placeholder for gallery item like implementation
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Gallery item like not implemented yet",
	})
}

// UnlikeGalleryItem handles unliking a gallery item
func (gc *GalleryController) UnlikeGalleryItem(c *gin.Context) {
	// This is a placeholder for gallery item unlike implementation
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Gallery item unlike not implemented yet",
	})
}
