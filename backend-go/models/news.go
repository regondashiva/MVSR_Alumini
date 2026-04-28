package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// News represents a news article in the system
type News struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title" validate:"required,min=3,max=200"`
	Slug        string             `bson:"slug" json:"slug"`
	Excerpt     string             `bson:"excerpt" json:"excerpt" validate:"required,min=10,max=500"`
	Content     string             `bson:"content" json:"content" validate:"required,min=50"`
	Category    string             `bson:"category" json:"category" validate:"required,oneof=news learning achievements"`
	Status      string             `bson:"status" json:"status" validate:"required,oneof=draft published archived"`
	Author      NewsAuthor         `bson:"author" json:"author"`
	Image       string             `bson:"image" json:"image"`
	Tags        []string           `bson:"tags" json:"tags"`
	IsFeatured  bool               `bson:"isFeatured" json:"isFeatured"`
	IsPublic    bool               `bson:"isPublic" json:"isPublic"`
	ViewCount   int                `bson:"viewCount" json:"viewCount"`
	LikeCount   int                `bson:"likeCount" json:"likeCount"`
	Comments    []NewsComment      `bson:"comments" json:"comments"`
	PublishedAt *time.Time         `bson:"publishedAt,omitempty" json:"publishedAt,omitempty"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt   time.Time          `bson:"updatedAt" json:"updatedAt"`
	CreatedBy   primitive.ObjectID `bson:"createdBy" json:"createdBy"`
}

// NewsAuthor represents news author information
type NewsAuthor struct {
	ID       primitive.ObjectID `bson:"id" json:"id"`
	Name     string             `bson:"name" json:"name"`
	Email    string             `bson:"email" json:"email"`
	Avatar   string             `bson:"avatar" json:"avatar"`
	Bio      string             `bson:"bio" json:"bio"`
	Role     string             `bson:"role" json:"role"`
}

// NewsComment represents a comment on a news article
type NewsComment struct {
	ID        primitive.ObjectID `bson:"id" json:"id"`
	UserID    primitive.ObjectID `bson:"userId" json:"userId"`
	Name      string             `bson:"name" json:"name"`
	Email     string             `bson:"email" json:"email"`
	Content   string             `bson:"content" json:"content" validate:"required,min=5,max=1000"`
	Status    string             `bson:"status" json:"status" validate:"required,oneof=pending approved rejected"`
	CreatedAt time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt time.Time          `bson:"updatedAt" json:"updatedAt"`
	Replies   []NewsComment      `bson:"replies" json:"replies"`
}

// CreateNewsRequest represents the request body for creating news
type CreateNewsRequest struct {
	Title      string      `json:"title" validate:"required,min=3,max=200"`
	Excerpt    string      `json:"excerpt" validate:"required,min=10,max=500"`
	Content    string      `json:"content" validate:"required,min=50"`
	Category   string      `json:"category" validate:"required,oneof=news learning achievements"`
	Status     string      `json:"status" validate:"required,oneof=draft published archived"`
	Image      string      `json:"image"`
	Tags       []string    `json:"tags"`
	IsPublic   bool        `json:"isPublic"`
	Author     NewsAuthor  `json:"author" validate:"required"`
}

// UpdateNewsRequest represents the request body for updating news
type UpdateNewsRequest struct {
	Title     *string     `json:"title,omitempty" validate:"omitempty,min=3,max=200"`
	Excerpt   *string     `json:"excerpt,omitempty" validate:"omitempty,min=10,max=500"`
	Content   *string     `json:"content,omitempty" validate:"omitempty,min=50"`
	Category  *string     `json:"category,omitempty" validate:"omitempty,oneof=news learning achievements"`
	Status    *string     `json:"status,omitempty" validate:"omitempty,oneof=draft published archived"`
	Image     *string     `json:"image,omitempty"`
	Tags      *[]string   `json:"tags,omitempty"`
	IsFeatured *bool       `json:"isFeatured,omitempty"`
	IsPublic  *bool       `json:"isPublic,omitempty"`
	Author    *NewsAuthor `json:"author,omitempty"`
}

// CreateCommentRequest represents the request body for creating a comment
type CreateCommentRequest struct {
	Content string `json:"content" validate:"required,min=5,max=1000"`
}

// UpdateCommentRequest represents the request body for updating a comment
type UpdateCommentRequest struct {
	Content *string `json:"content,omitempty" validate:"omitempty,min=5,max=1000"`
	Status  *string `json:"status,omitempty" validate:"omitempty,oneof=pending approved rejected"`
}

// NewsFilter represents filters for querying news
type NewsFilter struct {
	Category string `form:"category"`
	Status   string `form:"status"`
	Author   string `form:"author"`
	Search   string `form:"search"`
	DateFrom string `form:"dateFrom"`
	DateTo   string `form:"dateTo"`
	Page     int    `form:"page,default=1"`
	Limit    int    `form:"limit,default=10"`
	Sort     string `form:"sort,default=createdAt"`
	Order    string `form:"order,default=desc"`
}

// NewsStats represents news statistics
type NewsStats struct {
	TotalNews     int            `json:"totalNews"`
	PublishedNews int            `json:"publishedNews"`
	DraftNews     int            `json:"draftNews"`
	TotalViews    int            `json:"totalViews"`
	TotalLikes    int            `json:"totalLikes"`
	NewsByCategory map[string]int `json:"newsByCategory"`
	TopNews       []News         `json:"topNews"`
}
