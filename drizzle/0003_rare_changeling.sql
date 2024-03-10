ALTER TABLE `user_credentials` RENAME COLUMN `auth_provider` TO `google_auth`;--> statement-breakpoint
ALTER TABLE `user_credentials` MODIFY COLUMN `google_auth` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `user_credentials` MODIFY COLUMN `google_auth` boolean NOT NULL DEFAULT false;