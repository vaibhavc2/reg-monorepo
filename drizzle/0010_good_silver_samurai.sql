ALTER TABLE `user_credentials` MODIFY COLUMN `auth_type` enum('email-password','google','both') NOT NULL DEFAULT 'google';--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `auth_type` enum('email-password','google','both') NOT NULL DEFAULT 'google';--> statement-breakpoint
ALTER TABLE `user_credentials` DROP INDEX `user_credentials_password_unique`;--> statement-breakpoint
ALTER TABLE `user_credentials` DROP COLUMN `salt`;