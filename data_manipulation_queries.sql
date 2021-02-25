SELECT * FROM Families;

--SELECT
--search individuals
-- colon denotes variables when nodeJS processes it
SELECT * FROM Individuals 
WHERE firstName = :firstNameInput AND lastName = :lastNameInput;

--search businesses
SELECT * FROM Businesses
WHERE name = :nameInput;

--search laws
SELECT * from Laws
WHERE lawName = :lawNameInput;

--INSERT
--add family
INSERT INTO `Families` (`familyName`) VALUES
(:familyNameInput)

--add individual
INSERT INTO `Individuals` (`firstName`, `lastName`, `age`) VALUES
(:fistNameInput, :lastNameInput, :ageInput);
--add business
INSERT INTO `Businesses` (`businessName`, `buildingNumber`, `streetName`, `city`, `state`, `zip`) VALUES
(:businessNameInput, :buildingNumberInput, :streetInput, :cityInput, :stateInput, :zipInput);

--add law
INSERT INTO `Laws` (`lawName`, `sentence`) VALUES
(:lawNameInput, :sentenceInput);

--add individual to family
UPDATE Individuals 
SET mafiaFamily = :familyID, mafiaRole = :roleInput
WHERE individualId = :individualIDInput;

--add that a particular individual broke a particular law a number of times (assuming that that individual hasn't broken that law before)
--add row to LawsBrokenByIndividual table
INSERT INTO `LawsBrokenByIndividuals` (`lawID`, `individualID`, `count`) VALUES 
((SELECT lawID FROM Laws WHERE lawName = :lawNameInput), (SELECT individualID FROM Individuals WHERE firstName = :firstNameInput AND lastName = :lastNameInput), 1);


--REMOVE
--remove family
DELETE FROM Families WHERE familyID = :familyIDInput;

--remove individual
DELETE FROM Individuals WHERE individualID = :individualIDInput;

--remove business
DELETE FROM Businesses WHERE businessID = :businessIDInput;

--remove law
DELETE FROM Laws WHERE lawID = :lawIDInput

--UPDATE
--update family
UPDATE Families
SET familyName = :newFamilyName
WHERE familyId = :familyIDInput;

--update individual
UPDATE Individuals
SET firstName = :newFirstName, lastName = :newLastName, age = :newAge, mafiaFamily = :newMafiaFamily, mafiaRole = :newMafiaRole
WHERE individualID =:individualIDInput;

--update business
UPDATE Businesses
SET businessName = :newbusinessName, buildingNumber = :newBuildingNumber, streetName = :newStreetName, city = :newCity, state = :newState, zip = :newZip, individualOwner = :newIndividualOwner, familyOwner = :newFamilyOwner
WHERE businessID =:businessIDInput;

--change business individual owner
UPDATE Businesses
SET individualOwner = :newIndividualOwner
WHERE businessID = :businessIDInput;

--change (or add) mafia owner
UPDATE Businesses
SET familyOwner = :newFamilyOwner
WHERE businessID = :businessIDInput;

--update law
UPDATE Laws
SET lawName = :newLawName, sentence = :newSentence
WHERE lawID = :lawIDInput;

