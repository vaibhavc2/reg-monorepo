DROP TABLE `old_passwords`;--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `auth_type` enum('email','google','phone') NOT NULL DEFAULT 'google';