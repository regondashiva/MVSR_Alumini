package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

// RateLimiter creates a simple in-memory rate limiter
type RateLimiter struct {
	visitors map[string]*visitor
	mu       sync.RWMutex
	rate     int
	window   time.Duration
}

type visitor struct {
	requests int
	lastSeen time.Time
}

// NewRateLimiter creates a new rate limiter
func NewRateLimiter(rate int, window time.Duration) *RateLimiter {
	return &RateLimiter{
		visitors: make(map[string]*visitor),
		rate:     rate,
		window:   window,
	}
}

// RateLimit creates a rate limiting middleware
func RateLimit() gin.HandlerFunc {
	limiter := NewRateLimiter(100, 15*time.Minute) // 100 requests per 15 minutes

	return func(c *gin.Context) {
		ip := c.ClientIP()
		
		if !limiter.allow(ip) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"message": "Rate limit exceeded",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// allow checks if the visitor is allowed to make a request
func (rl *RateLimiter) allow(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	v, exists := rl.visitors[ip]
	if !exists {
		rl.visitors[ip] = &visitor{
			requests: 1,
			lastSeen: time.Now(),
		}
		return true
	}

	if time.Since(v.lastSeen) > rl.window {
		v.requests = 1
		v.lastSeen = time.Now()
		return true
	}

	if v.requests >= rl.rate {
		return false
	}

	v.requests++
	return true
}

// cleanup removes old visitors from the map
func (rl *RateLimiter) cleanup() {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	for ip, v := range rl.visitors {
		if time.Since(v.lastSeen) > rl.window {
			delete(rl.visitors, ip)
		}
	}
}

// StartCleanup starts the cleanup routine
func (rl *RateLimiter) StartCleanup() {
	ticker := time.NewTicker(rl.window)
	defer ticker.Stop()

	for range ticker.C {
		rl.cleanup()
	}
}

// RateLimitByUser creates a rate limiting middleware based on user ID
func RateLimitByUser() gin.HandlerFunc {
	limiter := NewRateLimiter(1000, 1*time.Hour) // 1000 requests per hour per user

	return func(c *gin.Context) {
		userID, exists := c.Get("userID")
		if !exists {
			// Fall back to IP-based limiting
			RateLimit()(c)
			return
		}

		userIDStr := ""
		if id, ok := userID.(string); ok {
			userIDStr = id
		} else {
			userIDStr = "user"
		}

		if !limiter.allow(userIDStr) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"success": false,
				"message": "Rate limit exceeded",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
