-- ----------------------------------------------------------------------------
-- MySQL Workbench Migration
-- Migrated Schemata: desktop
-- Source Schemata: groupomania
-- Created: Wed Jan 26 16:56:44 2022
-- Workbench Version: 8.0.26
-- ----------------------------------------------------------------------------

SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------------------------------------------------------
-- Schema desktop
-- ----------------------------------------------------------------------------
DROP SCHEMA IF EXISTS `desktop` ;
CREATE SCHEMA IF NOT EXISTS `desktop` ;

-- ----------------------------------------------------------------------------
-- Table desktop.comments
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `desktop`.`comments` (
  `id` INT UNSIGNED NOT NULL,
  `userId` INT UNSIGNED NOT NULL,
  `publicationId` INT UNSIGNED NOT NULL,
  `commentContent` TEXT NOT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  UNIQUE INDEX `id` (`id` ASC) VISIBLE,
  INDEX `comments_ibfk_1` (`userId` ASC) VISIBLE,
  INDEX `comments_ibfk_2` (`publicationId` ASC) VISIBLE,
  CONSTRAINT `comments_ibfk_1`
    FOREIGN KEY (`userId`)
    REFERENCES `desktop`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2`
    FOREIGN KEY (`publicationId`)
    REFERENCES `desktop`.`publications` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 18
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table desktop.likes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `desktop`.`likes` (
  `id` INT UNSIGNED NOT NULL,
  `userId` INT UNSIGNED NOT NULL,
  `publicationId` INT UNSIGNED NOT NULL,
  `rate` TINYINT NOT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  UNIQUE INDEX `id` (`id` ASC) VISIBLE,
  INDEX `likes_ibfk_1` (`userId` ASC) VISIBLE,
  INDEX `likes_ibfk_2` (`publicationId` ASC) VISIBLE,
  CONSTRAINT `likes_ibfk_1`
    FOREIGN KEY (`userId`)
    REFERENCES `desktop`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `likes_ibfk_2`
    FOREIGN KEY (`publicationId`)
    REFERENCES `desktop`.`publications` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 8
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table desktop.notifications
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `desktop`.`notifications` (
  `id` INT UNSIGNED NOT NULL,
  `userId` INT UNSIGNED NOT NULL,
  `publicationId` INT UNSIGNED NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  UNIQUE INDEX `id` (`id` ASC) VISIBLE,
  INDEX `notifications_ibfk_1` (`userId` ASC) VISIBLE,
  INDEX `notifications_ibfk_2` (`publicationId` ASC) VISIBLE,
  CONSTRAINT `notifications_ibfk_1`
    FOREIGN KEY (`userId`)
    REFERENCES `desktop`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `notifications_ibfk_2`
    FOREIGN KEY (`publicationId`)
    REFERENCES `desktop`.`publications` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 25
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table desktop.publications
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `desktop`.`publications` (
  `id` INT UNSIGNED NOT NULL,
  `userId` INT UNSIGNED NOT NULL,
  `publiContent` TEXT NULL DEFAULT NULL,
  `imageUrl` VARCHAR(255) NULL DEFAULT NULL,
  `rate` INT NULL DEFAULT '0',
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  UNIQUE INDEX `id` (`id` ASC) VISIBLE,
  INDEX `publications_ibfk_1` (`userId` ASC) VISIBLE,
  CONSTRAINT `publications_ibfk_1`
    FOREIGN KEY (`userId`)
    REFERENCES `desktop`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 31
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

-- ----------------------------------------------------------------------------
-- Table desktop.sequelizemeta
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `desktop`.`sequelizemeta` (
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8
COLLATE = utf8_unicode_ci;

-- ----------------------------------------------------------------------------
-- Table desktop.users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `desktop`.`users` (
  `id` INT UNSIGNED NOT NULL,
  `userName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `imageUrl` VARCHAR(255) NULL DEFAULT NULL,
  `isModerator` TINYINT(1) NULL DEFAULT '0',
  `createdAt` DATETIME NULL DEFAULT NULL,
  `updatedAt` DATETIME NULL DEFAULT NULL,
  UNIQUE INDEX `id` (`id` ASC) VISIBLE,
  UNIQUE INDEX `userName` (`userName` ASC) VISIBLE,
  UNIQUE INDEX `email` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 88
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;
SET FOREIGN_KEY_CHECKS = 1;
