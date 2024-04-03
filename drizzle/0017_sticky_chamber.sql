CREATE TABLE `tokens` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`objective` enum('reset','change','verify','security') NOT NULL,
	`token` varchar(256) NOT NULL,
	`token_type` enum('') NOT NULL,
	`expired_at` timestamp(6) NOT NULL,
	`verified` boolean NOT NULL DEFAULT false,
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	CONSTRAINT `tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `otps` RENAME COLUMN `credential` TO `objective`;--> statement-breakpoint
ALTER TABLE `otps` DROP FOREIGN KEY `otps_otp_type_otp_types_id_fk`;
--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `id` bigint unsigned AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `otp_type` enum('email','phone') NOT NULL;--> statement-breakpoint
ALTER TABLE `otps` MODIFY COLUMN `objective` enum('reset','change','verify','security') NOT NULL;--> statement-breakpoint
CREATE INDEX `user_idx` ON `tokens` (`user`);--> statement-breakpoint
ALTER TABLE `tokens` ADD CONSTRAINT `tokens_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;
DROP TABLE `otp_types`;--> statement-breakpoint