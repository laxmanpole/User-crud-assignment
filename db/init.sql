create database if not exists `users`;

USE `users`;

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email_id` varchar(255) NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_no` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 = Active, 2 = Inactive',
  `deleted` int(11) NOT NULL DEFAULT '0' COMMENT '0 = False, >=1 = True',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_uk` (`email_id`,`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$
USE users$$
DROP TRIGGER IF EXISTS users_on_delete_trigger $$
CREATE
    TRIGGER users_on_delete_trigger BEFORE UPDATE ON users
    FOR EACH ROW BEGIN
	IF (NEW.deleted_at IS NULL) THEN SET NEW.deleted = 0; ELSE SET NEW.deleted = OLD.id; END IF;
    END;
$$
DELIMITER ;
