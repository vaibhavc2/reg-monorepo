CREATE TABLE `email_credentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`email` varchar(256) NOT NULL,
	`google_auth` boolean NOT NULL DEFAULT false,
	`password` varchar(256),
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	`updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6),
	CONSTRAINT `email_credentials_id` PRIMARY KEY(`id`),
	CONSTRAINT `email_credentials_user_unique` UNIQUE(`user`),
	CONSTRAINT `email_credentials_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `phone_details` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`phone` varchar(20) NOT NULL,
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	`updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6),
	CONSTRAINT `phone_details_id` PRIMARY KEY(`id`),
	CONSTRAINT `phone_details_user_unique` UNIQUE(`user`),
	CONSTRAINT `phone_details_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
DROP TABLE `user_credentials`;--> statement-breakpoint
CREATE INDEX `user_idx` ON `email_credentials` (`user`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `email_credentials` (`email`);--> statement-breakpoint
CREATE INDEX `phone_idx` ON `phone_details` (`phone`);--> statement-breakpoint
ALTER TABLE `email_credentials` ADD CONSTRAINT `email_credentials_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `phone_details` ADD CONSTRAINT `phone_details_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;