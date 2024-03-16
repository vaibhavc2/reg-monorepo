ALTER TABLE `user_credentials` RENAME COLUMN `google_auth` TO `auth_type`;--> statement-breakpoint
ALTER TABLE `user_credentials` MODIFY COLUMN `auth_type` enum('password','google') NOT NULL DEFAULT 'google';--> statement-breakpoint
ALTER TABLE `user_sessions` ADD `auth_type` enum('password','google') DEFAULT 'google' NOT NULL;