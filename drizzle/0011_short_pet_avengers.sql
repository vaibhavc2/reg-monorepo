ALTER TABLE `user_sessions` DROP FOREIGN KEY `user_sessions_device_devices_id_fk`;
--> statement-breakpoint
DROP INDEX `device_idx` ON `user_sessions`;--> statement-breakpoint
ALTER TABLE `user_sessions` DROP INDEX `user_sessions_user_unique`;--> statement-breakpoint
ALTER TABLE `user_sessions` DROP INDEX `user_sessions_device_unique`;--> statement-breakpoint
ALTER TABLE `devices` ADD `user` int NOT NULL;--> statement-breakpoint
CREATE INDEX `user_idx` ON `user_sessions` (`user`);--> statement-breakpoint
ALTER TABLE `devices` ADD CONSTRAINT `devices_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_sessions` DROP COLUMN `device`;