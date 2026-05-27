package controllers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"mvsr-backend/config"
)

type JobController struct {
	cfg *config.Config
	db  *sql.DB
}

func NewJobController(cfg *config.Config, db *sql.DB) *JobController {
	return &JobController{cfg: cfg, db: db}
}

// Job represents the job structure
type Job struct {
	ID                 int    `json:"id"`
	Title              string `json:"title"`
	Description        string `json:"description"`
	Company            string `json:"company"`
	Location           string `json:"location"`
	SalaryRange        string `json:"salary_range"`
	JobType            string `json:"job_type"`
	ExperienceRequired string `json:"experience_required"`
	SkillsRequired     string `json:"skills_required"`
	IsActive           bool   `json:"is_active"`
	CreatedAt          string `json:"created_at"`
	UpdatedAt          string `json:"updated_at"`
}

// GetJobs handles fetching all active jobs
func (jc *JobController) GetJobs(c *gin.Context) {
	// Query parameters for pagination and filtering
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	// Get search query if provided
	search := c.Query("search")
	company := c.Query("company")
	location := c.Query("location")

	// Build base query
	query := `
		SELECT id, title, description, company, location, salary_range, 
		       job_type, experience_required, skills_required, is_active, 
		       created_at, updated_at
		FROM jobs 
		WHERE is_active = true
	`
	args := []interface{}{}

	// Add search conditions
	if search != "" {
		query += " AND (title LIKE ? OR description LIKE ? OR company LIKE ?)"
		args = append(args, "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if company != "" {
		query += " AND company LIKE ?"
		args = append(args, "%"+company+"%")
	}

	if location != "" {
		query += " AND location LIKE ?"
		args = append(args, "%"+location+"%")
	}

	// Add pagination
	query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
	args = append(args, limit, offset)

	// Execute query
	rows, err := jc.db.Query(query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch jobs",
			"error":   err.Error(),
		})
		return
	}
	defer rows.Close()

	// Parse results
	var jobs []Job
	for rows.Next() {
		var job Job
		err := rows.Scan(
			&job.ID, &job.Title, &job.Description, &job.Company, &job.Location,
			&job.SalaryRange, &job.JobType, &job.ExperienceRequired, &job.SkillsRequired,
			&job.IsActive, &job.CreatedAt, &job.UpdatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to parse job data",
				"error":   err.Error(),
			})
			return
		}
		jobs = append(jobs, job)
	}

	// Get total count for pagination
	countQuery := "SELECT COUNT(*) FROM jobs WHERE is_active = true"
	countArgs := []interface{}{}

	if search != "" {
		countQuery += " AND (title LIKE ? OR description LIKE ? OR company LIKE ?)"
		countArgs = append(countArgs, "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if company != "" {
		countQuery += " AND company LIKE ?"
		countArgs = append(countArgs, "%"+company+"%")
	}

	if location != "" {
		countQuery += " AND location LIKE ?"
		countArgs = append(countArgs, "%"+location+"%")
	}

	var total int
	jc.db.QueryRow(countQuery, countArgs...).Scan(&total)

	// Get unique companies and locations for filters
	companies, _ := jc.getUniqueCompanies()
	locations, _ := jc.getUniqueLocations()

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": gin.H{
			"jobs":      jobs,
			"total":     total,
			"page":      page,
			"limit":     limit,
			"companies": companies,
			"locations": locations,
		},
	})
}

// GetJob handles fetching a single job by ID
func (jc *JobController) GetJob(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid job ID",
		})
		return
	}

	query := `
		SELECT id, title, description, company, location, salary_range, 
		       job_type, experience_required, skills_required, is_active, 
		       created_at, updated_at
		FROM jobs 
		WHERE id = ? AND is_active = true
	`

	var job Job
	err = jc.db.QueryRow(query, id).Scan(
		&job.ID, &job.Title, &job.Description, &job.Company, &job.Location,
		&job.SalaryRange, &job.JobType, &job.ExperienceRequired, &job.SkillsRequired,
		&job.IsActive, &job.CreatedAt, &job.UpdatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{
				"success": false,
				"message": "Job not found",
			})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to fetch job",
				"error":   err.Error(),
			})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    job,
	})
}

// CreateJob handles creating a new job
func (jc *JobController) CreateJob(c *gin.Context) {
	// Get user ID from context
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}

	// Determine role — admin posts are auto-approved, others need approval
	role, _ := c.Get("role")
	isActive := false
	if role == "admin" {
		isActive = true
	}

	var job struct {
		Title              string   `json:"title" binding:"required"`
		Description        string   `json:"description" binding:"required"`
		Company            string   `json:"company" binding:"required"`
		Location           string   `json:"location" binding:"required"`
		SalaryRange        string   `json:"salary_range"`
		JobType            string   `json:"job_type"`
		ExperienceRequired string   `json:"experience_required"`
		SkillsRequired     []string `json:"skills_required"`
	}

	if err := c.ShouldBindJSON(&job); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
			"error":   err.Error(),
		})
		return
	}

	// Convert skills array to JSON
	skillsJSON := "[]"
	if len(job.SkillsRequired) > 0 {
		if s, err := json.Marshal(job.SkillsRequired); err == nil {
			skillsJSON = string(s)
		}
	}

	query := `
		INSERT INTO jobs (title, description, company, location, salary_range, 
		              job_type, experience_required, skills_required, is_active, 
		              created_at, updated_at, posted_by)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)
	`

	result, err := jc.db.Exec(query,
		job.Title, job.Description, job.Company, job.Location,
		job.SalaryRange, job.JobType, job.ExperienceRequired, skillsJSON, isActive, userID,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to create job",
			"error":   err.Error(),
		})
		return
	}

	jobID, _ := result.LastInsertId()

	message := "Job created successfully"
	if !isActive {
		message = "Job submitted successfully. It will be visible after admin approval."
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": message,
		"data": gin.H{
			"id": jobID,
		},
	})
}

// UpdateJob handles updating a job
func (jc *JobController) UpdateJob(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid job ID",
		})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}
	role, _ := c.Get("role")

	// Check ownership if not admin
	if role != "admin" {
		var postedBy sql.NullInt64
		err = jc.db.QueryRow("SELECT posted_by FROM jobs WHERE id = ?", id).Scan(&postedBy)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Job not found"})
			return
		}
		if !postedBy.Valid || int(postedBy.Int64) != userID.(int) {
			c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "You don't have permission to edit this job"})
			return
		}
	}

	var job struct {
		Title              string   `json:"title"`
		Description        string   `json:"description"`
		Company            string   `json:"company"`
		Location           string   `json:"location"`
		SalaryRange        string   `json:"salary_range"`
		JobType            string   `json:"job_type"`
		ExperienceRequired string   `json:"experience_required"`
		SkillsRequired     []string `json:"skills_required"`
	}

	if err := c.ShouldBindJSON(&job); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid request data",
			"error":   err.Error(),
		})
		return
	}

	// Convert skills array to JSON
	skillsJSON := "[]"
	if len(job.SkillsRequired) > 0 {
		if s, err := json.Marshal(job.SkillsRequired); err == nil {
			skillsJSON = string(s)
		}
	}

	query := `
		UPDATE jobs 
		SET title = ?, description = ?, company = ?, location = ?, salary_range = ?,
		    job_type = ?, experience_required = ?, skills_required = ?, updated_at = NOW()
		WHERE id = ?
	`

	_, err = jc.db.Exec(query,
		job.Title, job.Description, job.Company, job.Location,
		job.SalaryRange, job.JobType, job.ExperienceRequired, skillsJSON, id,
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to update job",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Job updated successfully",
	})
}

// DeleteJob handles deleting a job
func (jc *JobController) DeleteJob(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid job ID",
		})
		return
	}

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}
	role, _ := c.Get("role")

	// Check ownership if not admin
	if role != "admin" {
		var postedBy sql.NullInt64
		err = jc.db.QueryRow("SELECT posted_by FROM jobs WHERE id = ?", id).Scan(&postedBy)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Job not found"})
			return
		}
		if !postedBy.Valid || int(postedBy.Int64) != userID.(int) {
			c.JSON(http.StatusForbidden, gin.H{"success": false, "message": "You don't have permission to delete this job"})
			return
		}
	}

	// Soft delete by setting is_active to false
	query := "UPDATE jobs SET is_active = false, updated_at = NOW() WHERE id = ?"
	_, err = jc.db.Exec(query, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to delete job",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Job deleted successfully",
	})
}

// ApplyJob handles applying for a job
func (jc *JobController) ApplyJob(c *gin.Context) {
	jobID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid job ID",
		})
		return
	}

	// Get user ID from context (should be set by auth middleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}

	// Check if job exists and is active
	var jobExists bool
	jc.db.QueryRow("SELECT EXISTS(SELECT 1 FROM jobs WHERE id = ? AND is_active = true)", jobID).Scan(&jobExists)

	if !jobExists {
		c.JSON(http.StatusNotFound, gin.H{
			"success": false,
			"message": "Job not found or not active",
		})
		return
	}

	// Check if user has already applied
	var alreadyApplied bool
	jc.db.QueryRow("SELECT EXISTS(SELECT 1 FROM job_applications WHERE user_id = ? AND job_id = ?)", userID, jobID).Scan(&alreadyApplied)

	if alreadyApplied {
		c.JSON(http.StatusConflict, gin.H{
			"success": false,
			"message": "You have already applied for this job",
		})
		return
	}

	// Create job application
	query := `
		INSERT INTO job_applications (user_id, job_id, application_date, status)
		VALUES (?, ?, NOW(), 'pending')
	`

	_, err = jc.db.Exec(query, userID, jobID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to submit application",
			"error":   err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success": true,
		"message": "Job application submitted successfully",
	})
}

// GetMyJobs handles fetching jobs posted by the user (for alumni employers)
func (jc *JobController) GetMyJobs(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}

	query := `
		SELECT id, title, description, company, location, salary_range, 
		       job_type, experience_required, skills_required, is_active, 
		       created_at, updated_at
		FROM jobs 
		WHERE posted_by = ?
		ORDER BY created_at DESC
	`

	rows, err := jc.db.Query(query, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch jobs",
			"error":   err.Error(),
		})
		return
	}
	defer rows.Close()

	var jobs []Job
	for rows.Next() {
		var job Job
		err := rows.Scan(
			&job.ID, &job.Title, &job.Description, &job.Company, &job.Location,
			&job.SalaryRange, &job.JobType, &job.ExperienceRequired, &job.SkillsRequired,
			&job.IsActive, &job.CreatedAt, &job.UpdatedAt,
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to parse job data",
				"error":   err.Error(),
			})
			return
		}
		jobs = append(jobs, job)
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    jobs,
	})
}

// GetJobApplications handles fetching job applications (for employers)
func (jc *JobController) GetJobApplications(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "User not authenticated",
		})
		return
	}

	jobID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Invalid job ID",
		})
		return
	}

	// Check if user owns this job
	var ownsJob bool
	jc.db.QueryRow(`
		SELECT EXISTS(
			SELECT 1 FROM jobs 
			WHERE id = ? AND posted_by = ? AND is_active = true
		)
	`, jobID, userID).Scan(&ownsJob)

	if !ownsJob {
		c.JSON(http.StatusForbidden, gin.H{
			"success": false,
			"message": "You don't have permission to view applications for this job",
		})
		return
	}

	query := `
		SELECT ja.id, ja.application_date, ja.status, 
		       a.first_name, a.last_name, a.email, a.phone_number
		FROM job_applications ja
		JOIN alumni a ON ja.user_id = a.id
		WHERE ja.job_id = ?
		ORDER BY ja.application_date DESC
	`

	rows, err := jc.db.Query(query, jobID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"message": "Failed to fetch applications",
			"error":   err.Error(),
		})
		return
	}
	defer rows.Close()

	var applications []gin.H
	for rows.Next() {
		var id int
		var applicationDate, status, firstName, lastName, email, phoneNumber string
		err := rows.Scan(&id, &applicationDate, &status, &firstName, &lastName, &email, &phoneNumber)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"success": false,
				"message": "Failed to parse application data",
				"error":   err.Error(),
			})
			return
		}
		applications = append(applications, gin.H{
			"id":               id,
			"application_date": applicationDate,
			"status":           status,
			"applicant": gin.H{
				"first_name":   firstName,
				"last_name":    lastName,
				"email":        email,
				"phone_number": phoneNumber,
			},
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    applications,
	})
}

// Helper functions
func (jc *JobController) getUniqueCompanies() ([]string, error) {
	rows, err := jc.db.Query("SELECT DISTINCT company FROM jobs WHERE is_active = true ORDER BY company")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var companies []string
	for rows.Next() {
		var company string
		rows.Scan(&company)
		companies = append(companies, company)
	}
	return companies, nil
}

func (jc *JobController) getUniqueLocations() ([]string, error) {
	rows, err := jc.db.Query("SELECT DISTINCT location FROM jobs WHERE is_active = true ORDER BY location")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var locations []string
	for rows.Next() {
		var location string
		rows.Scan(&location)
		locations = append(locations, location)
	}
	return locations, nil
}

// GetPendingJobs returns jobs with is_active = false for admin review
func (jc *JobController) GetPendingJobs(c *gin.Context) {
	query := `
		SELECT j.id, j.title, j.description, j.company, j.location, j.salary_range,
		       j.job_type, j.experience_required, j.skills_required, j.is_active,
		       j.created_at, j.updated_at, COALESCE(j.posted_by, 0),
		       COALESCE(u.first_name, ''), COALESCE(u.last_name, ''), COALESCE(u.email, '')
		FROM jobs j
		LEFT JOIN users u ON j.posted_by = u.id
		WHERE j.is_active = false
		ORDER BY j.created_at DESC
	`

	rows, err := jc.db.Query(query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to fetch pending jobs", "error": err.Error()})
		return
	}
	defer rows.Close()

	var jobs []gin.H
	for rows.Next() {
		var id, postedBy int
		var title, description, company, location, salaryRange, jobType, experienceRequired, skillsRequired, createdAt, updatedAt string
		var isActive bool
		var posterFirst, posterLast, posterEmail string
		err := rows.Scan(&id, &title, &description, &company, &location, &salaryRange,
			&jobType, &experienceRequired, &skillsRequired, &isActive, &createdAt, &updatedAt,
			&postedBy, &posterFirst, &posterLast, &posterEmail)
		if err != nil {
			continue
		}
		jobs = append(jobs, gin.H{
			"id": id, "title": title, "description": description, "company": company,
			"location": location, "salary_range": salaryRange, "job_type": jobType,
			"experience_required": experienceRequired, "skills_required": skillsRequired,
			"is_active": isActive, "created_at": createdAt, "updated_at": updatedAt,
			"posted_by": postedBy,
			"poster": gin.H{"firstName": posterFirst, "lastName": posterLast, "email": posterEmail},
		})
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "data": jobs})
}

// ApproveJob sets a job's is_active to true
func (jc *JobController) ApproveJob(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid job ID"})
		return
	}

	result, err := jc.db.Exec("UPDATE jobs SET is_active = true, updated_at = NOW() WHERE id = ?", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to approve job", "error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Job not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Job approved successfully"})
}

// RejectJob deletes a pending job posting
func (jc *JobController) RejectJob(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"success": false, "message": "Invalid job ID"})
		return
	}

	result, err := jc.db.Exec("DELETE FROM jobs WHERE id = ? AND is_active = false", id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"success": false, "message": "Failed to reject job", "error": err.Error()})
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"success": false, "message": "Job not found or already active"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"success": true, "message": "Job rejected and removed"})
}
