CREATE TABLE `rooms` (
	`id` text PRIMARY KEY NOT NULL,
	`join_code` text NOT NULL,
	`state` text NOT NULL,
	`rev` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL
);
