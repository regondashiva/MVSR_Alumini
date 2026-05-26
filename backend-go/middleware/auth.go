package middleware

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"mvsr-backend/config"
)

// AuthMiddleware creates a JWT authentication middleware
func Auth(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Authorization header is required"})
			c.Abort()
			return
		}

		// Check if token has Bearer prefix
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid token format"})
			c.Abort()
			return
		}

		// Parse and validate token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid token"})
			c.Abort()
			return
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid token claims"})
			c.Abort()
			return
		}

		// Check token expiration
		if exp, ok := claims["exp"].(float64); ok {
			if time.Now().Unix() > int64(exp) {
				c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Token has expired"})
				c.Abort()
				return
			}
		}

		// Extract user ID from claims
		var userID int
		switch val := claims["userID"].(type) {
		case float64:
			userID = int(val)
		case string:
			var err error
			userID, err = strconv.Atoi(val)
			if err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid user ID format"})
				c.Abort()
				return
			}
		default:
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "Invalid user ID type in token"})
			c.Abort()
			return
		}

		// Set user context
		c.Set("userID", userID)
		c.Set("email", claims["email"])
		c.Set("role", claims["role"])
		c.Set("firstName", claims["firstName"])
		c.Set("lastName", claims["lastName"])

		c.Next()
	}
}

// AdminAuth creates an admin authentication middleware
func AdminAuth(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		// First check if user is authenticated
		Auth(cfg)(c)
		if c.IsAborted() {
			return
		}

		// Check if user is admin
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User role not found"})
			c.Abort()
			return
		}

		if role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Admin access required"})
			c.Abort()
			return
		}

		c.Next()
	}
}

// OptionalAuth creates an optional authentication middleware
func OptionalAuth(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		// Check if token has Bearer prefix
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			c.Next()
			return
		}

		// Parse and validate token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return []byte(cfg.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			c.Next()
			return
		}

		// Extract claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.Next()
			return
		}

		// Check token expiration
		if exp, ok := claims["exp"].(float64); ok {
			if time.Now().Unix() > int64(exp) {
				c.Next()
				return
			}
		}

		// Extract user ID from claims
		var userID int
		switch val := claims["userID"].(type) {
		case float64:
			userID = int(val)
		case string:
			var err error
			userID, err = strconv.Atoi(val)
			if err != nil {
				c.Next()
				return
			}
		default:
			c.Next()
			return
		}

		// Set user context
		c.Set("userID", userID)
		c.Set("email", claims["email"])
		c.Set("role", claims["role"])
		c.Set("firstName", claims["firstName"])
		c.Set("lastName", claims["lastName"])

		c.Next()
	}
}

// AlumniAuth creates an alumni authentication middleware
func AlumniAuth(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		// First check if user is authenticated
		Auth(cfg)(c)
		if c.IsAborted() {
			return
		}

		// Check if user is alumni or admin
		role, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"success": false, "message": "User role not found"})
			c.Abort()
			return
		}

		if role != "alumni" && role != "admin" {
			c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "Alumni access required"})
			c.Abort()
			return
		}

		c.Next()
	}
}
