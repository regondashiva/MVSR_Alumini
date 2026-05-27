package controllers

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"mvsr-backend/config"
)

type NewsController struct {
	cfg *config.Config
	db  *sql.DB
}

type NewsItem struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Content     string    `json:"content"`
	Author      string    `json:"author"`
	Category    string    `json:"category"`
	Image       string    `json:"image"`
	IsPublished bool      `json:"isPublished"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

func NewNewsController(cfg *config.Config) *NewsController {
	return &NewsController{cfg: cfg, db: config.GetDatabase()}
}

// GetNews handles fetching news
func (nc *NewsController) GetNews(c *gin.Context) {
	idParam := c.Param("id")
	if idParam != "" {
		newsID, err := strconv.Atoi(idParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid news ID"})
			return
		}

		var item NewsItem
		query := `SELECT id, title, content, author, category, image_url, is_published, created_at, updated_at FROM news WHERE id = ? AND is_published = true`
		err = nc.db.QueryRow(query, newsID).Scan(
			&item.ID, &item.Title, &item.Content, &item.Author, &item.Category,
			&item.Image, &item.IsPublished, &item.CreatedAt, &item.UpdatedAt,
		)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "News not found"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch news", "error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"success": true, "message": "News fetched successfully", "data": gin.H{"news": item}})
		return
	}

	rows, err := nc.db.Query(`SELECT id, title, content, author, category, image_url, is_published, created_at, updated_at FROM news WHERE is_published = true ORDER BY created_at DESC`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch news", "error": err.Error()})
		return
	}
	defer rows.Close()

	var items []NewsItem
	for rows.Next() {
		var item NewsItem
		if err := rows.Scan(&item.ID, &item.Title, &item.Content, &item.Author, &item.Category, &item.Image, &item.IsPublished, &item.CreatedAt, &item.UpdatedAt); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to scan news items", "error": err.Error()})
			return
		}
		items = append(items, item)
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "News fetched successfully", "data": gin.H{"news": items}})
}

// GetNewsByID handles fetching a single news article
func (nc *NewsController) GetNewsByID(c *gin.Context) {
	nc.GetNews(c)
}

// CreateNews handles creating a new news article
func (nc *NewsController) CreateNews(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}
	firstName, _ := c.Get("firstName")
	lastName, _ := c.Get("lastName")
	authorName := firstName.(string) + " " + lastName.(string)

	var news struct {
		Title    string `json:"title" binding:"required"`
		Content  string `json:"content" binding:"required"`
		Category string `json:"category" binding:"required"`
		ImageURL string `json:"image"`
	}

	if err := c.ShouldBindJSON(&news); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request data", "error": err.Error()})
		return
	}

	query := `
		INSERT INTO news (title, content, author, category, image_url, is_published, created_at, updated_at, author_id)
		VALUES (?, ?, ?, ?, ?, true, NOW(), NOW(), ?)
	`
	result, err := nc.db.Exec(query, news.Title, news.Content, authorName, news.Category, news.ImageURL, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to create news", "error": err.Error()})
		return
	}

	newsID, _ := result.LastInsertId()
	c.JSON(http.StatusCreated, gin.H{"success": true, "message": "News created successfully", "data": gin.H{"id": newsID}})
}

// UpdateNews handles updating a news article
func (nc *NewsController) UpdateNews(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid news ID"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}
	role, _ := c.Get("role")

	if role != "admin" {
		var authorID sql.NullInt64
		err = nc.db.QueryRow("SELECT author_id FROM news WHERE id = ?", id).Scan(&authorID)
		if err != nil || !authorID.Valid || int(authorID.Int64) != userID.(int) {
			c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "You don't have permission to edit this news"})
			return
		}
	}

	var news struct {
		Title    string `json:"title" binding:"required"`
		Content  string `json:"content" binding:"required"`
		Category string `json:"category" binding:"required"`
		ImageURL string `json:"image"`
	}

	if err := c.ShouldBindJSON(&news); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid request data", "error": err.Error()})
		return
	}

	query := "UPDATE news SET title = ?, content = ?, category = ?, image_url = ?, updated_at = NOW() WHERE id = ?"
	_, err = nc.db.Exec(query, news.Title, news.Content, news.Category, news.ImageURL, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to update news", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "News updated successfully"})
}

// DeleteNews handles deleting a news article
func (nc *NewsController) DeleteNews(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid news ID"})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User not authenticated"})
		return
	}
	role, _ := c.Get("role")

	if role != "admin" {
		var authorID sql.NullInt64
		err = nc.db.QueryRow("SELECT author_id FROM news WHERE id = ?", id).Scan(&authorID)
		if err != nil || !authorID.Valid || int(authorID.Int64) != userID.(int) {
			c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "You don't have permission to delete this news"})
			return
		}
	}

	query := "UPDATE news SET is_published = false, updated_at = NOW() WHERE id = ?"
	_, err = nc.db.Exec(query, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to delete news", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "News deleted successfully"})
}

// CreateComment handles creating a comment
func (nc *NewsController) CreateComment(c *gin.Context) {
	// This is a placeholder for comment creation implementation
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Comment creation not implemented yet",
	})
}

// UpdateComment handles updating a comment
func (nc *NewsController) UpdateComment(c *gin.Context) {
	// This is a placeholder for comment update implementation
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Comment update not implemented yet",
	})
}

// DeleteComment handles deleting a comment
func (nc *NewsController) DeleteComment(c *gin.Context) {
	// This is a placeholder for comment deletion implementation
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "Comment deletion not implemented yet",
	})
}

// LikeNews handles liking a news article
func (nc *NewsController) LikeNews(c *gin.Context) {
	// This is a placeholder for news like implementation
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "News like not implemented yet",
	})
}

// UnlikeNews handles unliking a news article
func (nc *NewsController) UnlikeNews(c *gin.Context) {
	// This is a placeholder for news unlike implementation
	c.JSON(http.StatusNotImplemented, gin.H{
		"success": false,
		"message": "News unlike not implemented yet",
	})
}
