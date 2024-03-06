CREATE TABLE `display_names` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`value` varchar(20) NOT NULL,
	`set_by` int NOT NULL,
	`updated_by` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `display_names_id` PRIMARY KEY(`id`),
	CONSTRAINT `display_names_user_unique` UNIQUE(`user`),
	CONSTRAINT `display_names_value_unique` UNIQUE(`value`)
);
--> statement-breakpoint
CREATE TABLE `duties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`value` varchar(256) NOT NULL,
	`disabled` boolean NOT NULL DEFAULT false,
	`added_by` int NOT NULL,
	`updated_by` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `duties_id` PRIMARY KEY(`id`),
	CONSTRAINT `duties_title_unique` UNIQUE(`title`),
	CONSTRAINT `duties_value_unique` UNIQUE(`value`)
);
--> statement-breakpoint
CREATE TABLE `old_passwords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`password` varchar(256) NOT NULL,
	`salt` varchar(256) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `old_passwords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `otps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`type` enum('login','register','reset','deletion','verification') NOT NULL,
	`credential` enum('email','phone') NOT NULL,
	`code` varchar(6) NOT NULL,
	`expired_at` timestamp NOT NULL,
	`verified` boolean NOT NULL DEFAULT false,
	`attempts` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `otps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `persons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`age` tinyint NOT NULL,
	`full_name` varchar(256) NOT NULL,
	`display_name` varchar(20),
	`disabled` boolean NOT NULL DEFAULT false,
	`phone` varchar(20) NOT NULL,
	`email` varchar(256),
	`address` varchar(256),
	`city` varchar(256),
	`state` varchar(256),
	`added_by` int NOT NULL,
	`updated_by` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `persons_id` PRIMARY KEY(`id`),
	CONSTRAINT `persons_phone_unique` UNIQUE(`phone`),
	CONSTRAINT `persons_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `persons_duties` (
	`id` int AUTO_INCREMENT NOT NULL,
	`person` int NOT NULL,
	`duty` int NOT NULL,
	`added_by` int NOT NULL,
	`updated_by` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `persons_duties_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `persons_relations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`person1` int NOT NULL,
	`person2` int NOT NULL,
	`relation` int NOT NULL,
	`added_by` int NOT NULL,
	`updated_by` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `persons_relations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `relations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(256) NOT NULL,
	`value` varchar(256) NOT NULL,
	`disabled` boolean NOT NULL DEFAULT false,
	`added_by` int NOT NULL,
	`updated_by` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `relations_id` PRIMARY KEY(`id`),
	CONSTRAINT `relations_title_unique` UNIQUE(`title`),
	CONSTRAINT `relations_value_unique` UNIQUE(`value`)
);
--> statement-breakpoint
CREATE TABLE `requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sender` int NOT NULL,
	`title` varchar(256),
	`description` varchar(256),
	`accepted` boolean NOT NULL DEFAULT false,
	`added_by` int,
	`accepted_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `requests_sender_unique` UNIQUE(`sender`)
);
--> statement-breakpoint
CREATE TABLE `user_credentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`email` varchar(256) NOT NULL,
	`auth_provider` enum('google','apple','email') NOT NULL DEFAULT 'email',
	`phone` varchar(20) NOT NULL,
	`salt` varchar(256) NOT NULL,
	`password` varchar(256),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `user_credentials_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_credentials_user_unique` UNIQUE(`user`),
	CONSTRAINT `user_credentials_email_unique` UNIQUE(`email`),
	CONSTRAINT `user_credentials_phone_unique` UNIQUE(`phone`),
	CONSTRAINT `user_credentials_password_unique` UNIQUE(`password`)
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`device_id` varchar(256) NOT NULL,
	`device_name` varchar(256) NOT NULL,
	`token` varchar(256) NOT NULL,
	`expired_at` timestamp NOT NULL,
	`revoked` boolean NOT NULL DEFAULT false,
	`revoked_at` timestamp,
	`revoked_by` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	CONSTRAINT `user_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_sessions_user_unique` UNIQUE(`user`),
	CONSTRAINT `user_sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`dark_mode` boolean NOT NULL DEFAULT false,
	`language` varchar(10) NOT NULL DEFAULT 'en',
	`notifications` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `user_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_settings_user_unique` UNIQUE(`user`)
);
--> statement-breakpoint
CREATE TABLE `usernames` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`value` varchar(20) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `usernames_id` PRIMARY KEY(`id`),
	CONSTRAINT `usernames_user_unique` UNIQUE(`user`),
	CONSTRAINT `usernames_value_unique` UNIQUE(`value`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(256) NOT NULL,
	`avatar` varchar(256),
	`cover` varchar(256),
	`role` enum('user','moderator','admin') NOT NULL DEFAULT 'user',
	`verified` boolean NOT NULL DEFAULT false,
	`disabled` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` int NOT NULL,
	`reg_number` varchar(20) NOT NULL,
	`disabled` boolean NOT NULL DEFAULT false,
	`added_by` int NOT NULL,
	`updated_by` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicles_reg_number_unique` UNIQUE(`reg_number`)
);
--> statement-breakpoint
CREATE TABLE `vehicles_owners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicle` int NOT NULL,
	`person` int NOT NULL,
	`added_by` int NOT NULL,
	`updated_by` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `vehicles_owners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles_types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(20) NOT NULL,
	`description` varchar(256),
	`disabled` boolean NOT NULL DEFAULT false,
	`added_by` int NOT NULL,
	`updated_by` int,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `vehicles_types_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicles_types_title_unique` UNIQUE(`title`)
);
--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user` int NOT NULL,
	`status` boolean NOT NULL DEFAULT false,
	`email_verified` boolean NOT NULL DEFAULT false,
	`phone_verified` boolean NOT NULL DEFAULT false,
	`verified_by` int,
	`verified_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3),
	CONSTRAINT `verifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `verifications_user_unique` UNIQUE(`user`)
);
--> statement-breakpoint
CREATE INDEX `value_idx` ON `display_names` (`value`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `duties` (`title`);--> statement-breakpoint
CREATE INDEX `value_idx` ON `duties` (`value`);--> statement-breakpoint
CREATE INDEX `code_idx` ON `otps` (`code`);--> statement-breakpoint
CREATE INDEX `name_idx` ON `persons` (`full_name`);--> statement-breakpoint
CREATE INDEX `display_name_idx` ON `persons` (`display_name`);--> statement-breakpoint
CREATE INDEX `phone_idx` ON `persons` (`phone`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `persons` (`email`);--> statement-breakpoint
CREATE INDEX `city_idx` ON `persons` (`city`);--> statement-breakpoint
CREATE INDEX `state_idx` ON `persons` (`state`);--> statement-breakpoint
CREATE INDEX `person_duty_idx` ON `persons_duties` (`person`,`duty`);--> statement-breakpoint
CREATE INDEX `person_relation_idx` ON `persons_relations` (`person1`,`person2`,`relation`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `relations` (`title`);--> statement-breakpoint
CREATE INDEX `value_idx` ON `relations` (`value`);--> statement-breakpoint
CREATE INDEX `sender_idx` ON `requests` (`sender`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `requests` (`title`);--> statement-breakpoint
CREATE INDEX `email_idx` ON `user_credentials` (`email`);--> statement-breakpoint
CREATE INDEX `phone_idx` ON `user_credentials` (`phone`);--> statement-breakpoint
CREATE INDEX `device_idx` ON `user_sessions` (`device_id`);--> statement-breakpoint
CREATE INDEX `token_idx` ON `user_sessions` (`token`);--> statement-breakpoint
CREATE INDEX `value_idx` ON `usernames` (`value`);--> statement-breakpoint
CREATE INDEX `full_name_idx` ON `users` (`full_name`);--> statement-breakpoint
CREATE INDEX `type_idx` ON `vehicles` (`type`);--> statement-breakpoint
CREATE INDEX `reg_number_idx` ON `vehicles` (`reg_number`);--> statement-breakpoint
CREATE INDEX `vehicle_person_idx` ON `vehicles_owners` (`vehicle`,`person`);--> statement-breakpoint
CREATE INDEX `title_idx` ON `vehicles_types` (`title`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `verifications` (`user`);--> statement-breakpoint
ALTER TABLE `display_names` ADD CONSTRAINT `display_names_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `display_names` ADD CONSTRAINT `display_names_set_by_users_id_fk` FOREIGN KEY (`set_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `display_names` ADD CONSTRAINT `display_names_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `duties` ADD CONSTRAINT `duties_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `duties` ADD CONSTRAINT `duties_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `old_passwords` ADD CONSTRAINT `old_passwords_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `otps` ADD CONSTRAINT `otps_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons` ADD CONSTRAINT `persons_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons` ADD CONSTRAINT `persons_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons_duties` ADD CONSTRAINT `persons_duties_person_persons_id_fk` FOREIGN KEY (`person`) REFERENCES `persons`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons_duties` ADD CONSTRAINT `persons_duties_duty_duties_id_fk` FOREIGN KEY (`duty`) REFERENCES `duties`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons_duties` ADD CONSTRAINT `persons_duties_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons_duties` ADD CONSTRAINT `persons_duties_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons_relations` ADD CONSTRAINT `persons_relations_person1_persons_id_fk` FOREIGN KEY (`person1`) REFERENCES `persons`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons_relations` ADD CONSTRAINT `persons_relations_person2_persons_id_fk` FOREIGN KEY (`person2`) REFERENCES `persons`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons_relations` ADD CONSTRAINT `persons_relations_relation_relations_id_fk` FOREIGN KEY (`relation`) REFERENCES `relations`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons_relations` ADD CONSTRAINT `persons_relations_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `persons_relations` ADD CONSTRAINT `persons_relations_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `relations` ADD CONSTRAINT `relations_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `relations` ADD CONSTRAINT `relations_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `requests` ADD CONSTRAINT `requests_sender_users_id_fk` FOREIGN KEY (`sender`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `requests` ADD CONSTRAINT `requests_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_credentials` ADD CONSTRAINT `user_credentials_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_sessions` ADD CONSTRAINT `user_sessions_revoked_by_users_id_fk` FOREIGN KEY (`revoked_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `usernames` ADD CONSTRAINT `usernames_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_type_vehicles_types_id_fk` FOREIGN KEY (`type`) REFERENCES `vehicles_types`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles_owners` ADD CONSTRAINT `vehicles_owners_vehicle_vehicles_id_fk` FOREIGN KEY (`vehicle`) REFERENCES `vehicles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles_owners` ADD CONSTRAINT `vehicles_owners_person_persons_id_fk` FOREIGN KEY (`person`) REFERENCES `persons`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles_owners` ADD CONSTRAINT `vehicles_owners_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles_owners` ADD CONSTRAINT `vehicles_owners_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles_types` ADD CONSTRAINT `vehicles_types_added_by_users_id_fk` FOREIGN KEY (`added_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles_types` ADD CONSTRAINT `vehicles_types_updated_by_users_id_fk` FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `verifications` ADD CONSTRAINT `verifications_user_users_id_fk` FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `verifications` ADD CONSTRAINT `verifications_verified_by_users_id_fk` FOREIGN KEY (`verified_by`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;