CREATE TABLE `otp_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255) NOT NULL,
	`disabled` boolean NOT NULL DEFAULT false,
	`added_by` int NOT NULL,
	`updated_by` int,
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	`updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6),
	CONSTRAINT `otp_types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `otps` RENAME COLUMN `type` TO `otp_type`;--> statement-breakpoint
DROP INDEX `code_idx` ON `otps`;--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `otp_type` int NOT NULL;--> statement-breakpoint
CREATE INDEX `title_idx` ON `otp_types` (`name`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `otps` (`user`);--> statement-breakpoint
ALTER TABLE `otps` ADD CONSTRAINT `otps_otp_type_otp_types_id_fk` FOREIGN KEY (`otp_type`) REFERENCES `otp_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `otp_types` ADD CONSTRAINT `otp_types_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `otp_types` ADD CONSTRAINT `otp_types_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;