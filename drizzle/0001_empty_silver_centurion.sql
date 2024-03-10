CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` varchar(256),
	`activity_type` enum('users','persons') NOT NULL,
	`disabled` boolean NOT NULL DEFAULT false,
	`added_by` int NOT NULL,
	`updated_by` int,
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	`updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`),
	CONSTRAINT `activities_title_unique` UNIQUE(`title`)
);
--> statement-breakpoint
CREATE TABLE `persons_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`activity` int NOT NULL,
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	CONSTRAINT `persons_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`activity` int NOT NULL,
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	CONSTRAINT `users_history_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `title_idx` ON `activities` (`title`);--> statement-breakpoint
CREATE INDEX `activity_type_idx` ON `activities` (`activity_type`);--> statement-breakpoint
CREATE INDEX `activity_idx` ON `persons_history` (`activity`);--> statement-breakpoint
CREATE INDEX `activity_idx` ON `users_history` (`activity`);--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `activities` ADD CONSTRAINT `activities_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons_history` ADD CONSTRAINT `persons_history_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons_history` ADD CONSTRAINT `persons_history_activity_activities_id_fk` FOREIGN KEY (`activity`) REFERENCES `activities`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_history` ADD CONSTRAINT `users_history_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_history` ADD CONSTRAINT `users_history_activity_activities_id_fk` FOREIGN KEY (`activity`) REFERENCES `activities`(`id`) ON DELETE no action ON UPDATE no action;