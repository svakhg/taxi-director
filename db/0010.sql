-- #timestamp <20140418161100>

ALTER TABLE `tblTaxi`
	ADD COLUMN `phone` VARCHAR(15) DEFAULT NULL,
	ADD COLUMN `codeactivation` VARCHAR(50) DEFAULT NULL,
	ADD COLUMN `codeuser` VARCHAR(10) DEFAULT NULL
	;
	