-- Migration: Add approval columns to users table
-- This script adds approval workflow columns to the existing users table

ALTER TABLE users ADD COLUMN IF NOT EXISTS approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by INT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS approval_notes TEXT;

-- Add index for approval status filtering
ALTER TABLE users ADD INDEX IF NOT EXISTS idx_approval_status (approval_status);

-- Add foreign key constraint for approved_by
ALTER TABLE users ADD CONSTRAINT fk_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL;

-- Update existing users to approved status (since they were already in the system)
UPDATE users SET approval_status = 'approved' WHERE approval_status IS NULL;

-- Log migration completion
SELECT 'Migration: approval_status, approved_by, approved_at, approval_notes added to users table' as migration_status;
