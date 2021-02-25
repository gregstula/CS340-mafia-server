SELECT * FROM Families;

--SELECT
--search individuals
-- colon denotes variables when nodeJS mysql module processes it
SELECT * FROM Individuals 
WHERE firstName = ? AND lastName = ?;
-- [firstNameInput, lastNameInput]

--search businesses
SELECT * FROM Businesses
WHERE name = ?;
-- [nameInput]

--search laws
SELECT * from Laws
WHERE lawName = ?;
-- [lawNameInput]

--INSERT
--add family
INSERT INTO `Families` (`familyName`) VALUES
(?)
-- [familyNameInput]

--add individual
INSERT INTO `Individuals` (`firstName`, `lastName`, `age`) VALUES
(?, ?, ?);
-- [fistNameInput, lastNameInput, ageInput]

--add business
INSERT INTO `Businesses` (`businessName`, `buildingNumber`, `streetName`, `city`, `state`, `zip`) VALUES
(?, ?, ?, ?, ?, ?);
-- [businessNameInput, buildingNumberInput, streetInput, cityInput, stateInput, zipInput)]

--add law
INSERT INTO `Laws` (`lawName`, `sentence`) VALUES
(?, ?);
-- [lawNameInput, sentenceInput]

--add individual to family
UPDATE Individuals 
SET mafiaFamily = ?, mafiaRole = ?
WHERE individualId = ?;
--[familyID, roleInput, individualID]

--add that a particular individual broke a particular law a number of times (assuming that that individual hasn't broken that law before)
--add row to LawsBrokenByIndividual table
INSERT INTO `LawsBrokenByIndividuals` (`lawID`, `individualID`, `count`) VALUES 
((SELECT lawID FROM Laws WHERE lawName = ?), (SELECT individualID FROM Individuals WHERE firstName = ? AND lastName = ?), 1); 
-- [lawNameInput, firstNameInput, lastNameInput]


--REMOVE
--remove family
DELETE FROM Families WHERE familyID = ?;
-- [familyID]

--remove individual
DELETE FROM Individuals WHERE individualID = ?;
-- [individualID]

--remove business
DELETE FROM Businesses WHERE businessID = ?;
--[businessID]

--remove law
DELETE FROM Laws WHERE lawID = ?;
-- [lawID]

--UPDATE
--update family
UPDATE Families
SET familyName = :?
WHERE familyId = ?;
-- [newFamilyName, familyID]

--update individual
UPDATE Individuals
SET firstName = ?, lastName = ?, age = ?, mafiaFamily = ?, mafiaRole = ?
WHERE individualID = ?;
-- [newFirstName, newLastName, newAge, newMafiaFamily, newMafiaRole, individualID]

--update business
UPDATE Businesses
SET businessName = ?, buildingNumber = ?, streetName = ?, city = ?, state = ?, zip = ?, individualOwner = ?, familyOwner = ?
WHERE businessID = ?;
-- [newBusinessName, newBuildingNumber, newStreetName, newCity, newState, newZip, newIndividualOwner, newFamilyOwner, businessID]

--change business individual owner
UPDATE Businesses
SET individualOwner = ?
WHERE businessID = ?;
-- [newIndividualOwner, businessID]

--change (or add) mafia owner
UPDATE Businesses
SET familyOwner = ?;
WHERE businessID = ?;
-- [newFamilyOwner, businessID]

--update law
UPDATE Laws
SET lawName = ?, sentence = ?
WHERE lawID = ?;
-- [newLawName, newSentence, lawID]

