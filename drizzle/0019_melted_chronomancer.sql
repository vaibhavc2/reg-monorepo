ALTER TABLE `users` RENAME COLUMN `disabled` TO `status`;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `status` enum('active','pending','disabled') NOT NULL DEFAULT 'pending';