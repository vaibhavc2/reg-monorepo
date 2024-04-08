CREATE TABLE `email-validations` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`email` varchar(256) NOT NULL,
	`verified` boolean NOT NULL DEFAULT false,
	`disabled` boolean NOT NULL DEFAULT false,
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	`updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6),
	CONSTRAINT `email-validations_id` PRIMARY KEY(`id`),
	CONSTRAINT `email-validations_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `phone-validations` (
	`id` bigint unsigned AUTO_INCREMENT NOT NULL,
	`phone` varchar(20) NOT NULL,
	`verified` boolean NOT NULL DEFAULT false,
	`disabled` boolean NOT NULL DEFAULT false,
	`created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
	`updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) on update CURRENT_TIMESTAMP(6),
	CONSTRAINT `phone-validations_id` PRIMARY KEY(`id`),
	CONSTRAINT `phone-validations_phone_unique` UNIQUE(`phone`)
);
--> statement-breakpoint
CREATE INDEX `email_idx` ON `email-validations` (`email`);--> statement-breakpoint
CREATE INDEX `phone_idx` ON `phone-validations` (`phone`);