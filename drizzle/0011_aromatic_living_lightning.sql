CREATE TABLE `prop_firm_transaction` (
	`id` text PRIMARY KEY NOT NULL,
	`trading_account_id` text NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`amount` real NOT NULL,
	`currency` text NOT NULL,
	`month` text NOT NULL,
	`note` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`trading_account_id`) REFERENCES `trading_account`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
