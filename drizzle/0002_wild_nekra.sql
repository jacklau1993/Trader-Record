CREATE TABLE `trading_account` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`status` text,
	`cost` real,
	`last_payout_amount` real,
	`last_payout_date` integer,
	`total_payout` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `trade` ADD `trading_account_id` text REFERENCES trading_account(id);--> statement-breakpoint
ALTER TABLE `user_preferences` ADD `default_trading_account_id` text;