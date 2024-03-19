CREATE TABLE `devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`model` varchar(256) NOT NULL,
	`type` enum('android','iphone','desktop','other') NOT NULL,
	`manufacturer` varchar(256) NOT NULL,
	`os` varchar(256) NOT NULL,
	`os_version` varchar(256) NOT NULL,
	`disabled` boolean NOT NULL DEFAULT false,
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	CONSTRAINT `devices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `user_sessions` RENAME COLUMN `device_id` TO `device`;--> statement-breakpoint
DROP INDEX `token_idx` ON `user_sessions`;--> statement-breakpoint
DROP INDEX `device_idx` ON `user_sessions`;--> statement-breakpoint
ALTER TABLE `user_sessions` MODIFY COLUMN `device` int NOT NULL;--> statement-breakpoint
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_device_unique` UNIQUE(`device`);--> statement-breakpoint
CREATE INDEX `os_idx` ON `devices` (`os`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `devices` (`type`);--> statement-breakpoint
CREATE INDEX `auth_type_idx` ON `user_sessions` (`auth_type`);--> statement-breakpoint
CREATE INDEX `device_idx` ON `user_sessions` (`device`);--> statement-breakpoint
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_device_devices_id_fk` FOREIGN KEY (`device`) REFERENCES `devices`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_sessions` DROP COLUMN `device_name`;