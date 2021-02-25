SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS bsg_planets;
DROP TABLE IF EXISTS bsg_people;
SET FOREIGN_KEY_CHECKS = 1;



CREATE TABLE `Families` (
    `familyID` int(11) NOT NULL AUTO_INCREMENT,
    `familyName` varchar(255) NOT NULL,
PRIMARY KEY (`familyID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Families` (`familyID`, `familyName`) VALUES
(1, 'Omerta'),
(2, 'Murphy'),
(3, 'Scott'),
(4, 'Soprano');



CREATE TABLE `Individuals` (
    `individualID` int(11) NOT NULL AUTO_INCREMENT,
    `firstName` varchar(255) NOT NULL,
    `lastName` varchar(255) DEFAULT NULL,
    `age` int(11) DEFAULT NULL,
    `mafiaFamily` int DEFAULT NULL,
    `mafiaRole` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`individualID`),
    FOREIGN KEY (`mafiaFamily`) REFERENCES `Families` (`familyID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Individuals` (`individualID`, `firstName`, `lastName`, `age`, `mafiaFamily`, `mafiaRole`) VALUES
(1, 'Bill', 'Omerta', 40, 1, 'Godfather'),
(2, 'Bob', 'Odenkirk', 45, NULL, NULL),
(3, 'Elon', 'Musk', 49, NULL, NULL),
(4, 'Bill', 'Omerta', 30, 1, 'Accountant'),
(5, 'Matthew', 'Omerta', 25, 1, 'Scatman'),
(6, 'Brian', 'Murphy', 37, 2, "'Interrogater'"),
(7, 'John', 'Murphy', 32, 2, "Emotional Support"),
(8, 'Michael', 'Scott', 40, 3, 'Regional Manager'),
(9, 'Dwight', 'Schrute', 40, 3, 'Assistant to the Regional Manager'),
(10, 'Tony', 'Soprano', 50, 4, 'Head');



CREATE TABLE `Businesses` (
    `businessID` int(11) NOT NULL AUTO_INCREMENT,
    `businessName` varchar(255) NOT NULL,
    `buildingNumber` int(11) DEFAULT NULL,
    `streetName` varchar(255) DEFAULT NULL,
    `city` varchar(255) DEFAULT NULL,
    `state` varchar(255) DEFAULT NULL,
    `zip` int(11) DEFAULT NULL,
    `individualOwner` int(11) NOT NULL,
    `familyOwner` int(11) DEFAULT NULL,
    PRIMARY KEY (`businessID`),
    FOREIGN KEY (`individualOwner`) REFERENCES `Individuals` (`individualID`) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (`familyOwner`) REFERENCES `Families` (`familyID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Businesses` (`businessID`, `businessName`, `buildingNumber`, `streetName`, `city`, `state`, `zip`, `individualOwner`, `familyOwner`) VALUES
(1, "Joe's Pizza", 320, 'Main St', 'New York', 'New York', 32212, 10, 4),
(2, "Tesla", 210, 'Wall St', 'New York', 'New York', 80192, 3, NULL),
(3, 'Dunder Mifflin', 4120, '22nd St', 'Scranton', 'Pennsylvania', 54292, 8, 3);



CREATE TABLE `Laws` (
    `lawID` int(11) NOT NULL AUTO_INCREMENT,
    `lawName` varchar(255) NOT NULL,
    `sentence` varchar(255) NOT NULL,
    PRIMARY KEY (`lawID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Laws` (`lawID`, `lawName`, `sentence`) VALUES
(1, 'Extortion', '3 years'),
(2, 'Fraud', '10 years'),
(3, 'Tax Evasion', '15 years');



CREATE TABLE `LawsBrokenByIndividuals` (
    `pairingID` int(11) NOT NULL AUTO_INCREMENT,
    `lawID` int(11) NOT NULL,
    `individualID` int(11) NOT NULL,
    `count` int(11) DEFAULT 0,
    PRIMARY KEY (`pairingID`),
    FOREIGN KEY (`lawID`) REFERENCES `Laws` (`lawID`) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (`individualID`) REFERENCES `Individuals` (`individualID`) ON DELETE RESTRICT ON UPDATE CASCADE
)ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `LawsBrokenByIndividuals` (`pairingID`, `lawID`, `individualID`, `count`) VALUES
(1, 1, 2, 4),
(2, 3, 3, 1),
(3, 2, 8, 3); 