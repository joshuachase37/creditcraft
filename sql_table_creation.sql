/* - SQL Changes: Added auto increment and not null to primary key, please see example_sql_entries.sql for table definitions */

CREATE DATABASE CreditCraft;

CREATE TABLE CreditCraft.User(
    UserID INT AUTO_INCREMENT NOT NULL,
    Name VARCHAR(50) NOT NULL,
    DOB DATE NOT NULL,
    Age INT NOT NULL,
    PRIMARY KEY(UserID)
);

CREATE TABLE CreditCraft.Authentication(
    LoginID INT AUTO_INCREMENT NOT NULL,
    UserID INT NOT NULL,
    Password VARCHAR(256) NOT NULL,
    Email VARCHAR(50) NOT NULL,
    Username VARCHAR(50) NOT NULL,
    PRIMARY KEY(LoginID),
    FOREIGN KEY(UserID) REFERENCES User(UserID)
);

CREATE TABLE CreditCraft.BankAccount(
    AccountID INT AUTO_INCREMENT NOT NULL,
    UserID INT NOT NULL,
    AccountInfo VARCHAR(100),
    BankName VARCHAR(50),
    Balance DECIMAL(11, 2),
    PRIMARY KEY(AccountID),
    FOREIGN KEY(UserID) REFERENCES User(UserID)
);

CREATE TABLE CreditCraft.Asset(
    AssetID INT AUTO_INCREMENT NOT NULL,
    UserID INT NOT NULL,
    Type VARCHAR(50),
    Name VARCHAR(50),
    CurrentValue DECIMAL(11, 2),
    PRIMARY KEY(AssetID),
    FOREIGN KEY(UserID) REFERENCES User(UserID)
);

CREATE TABLE CreditCraft.CreditCard(
    CardID INT AUTO_INCREMENT NOT NULL,
    UserID INT NOT NULL, 
    CardInfo VARCHAR(255),
    AvailableCredit DECIMAL(11, 2),
    CurrentBalance DECIMAL(11, 2),
    InterestRate DECIMAL(5, 2),
    PRIMARY KEY(CardID),
    FOREIGN KEY(UserID) REFERENCES User(UserID)
);

CREATE TABLE CreditCraft.Transactions(
    TransactionId INT AUTO_INCREMENT NOT NULL,
    UserID INT NOT NULL,
    CardID INT,
    AccountID INT,
    Merchant VARCHAR(100),
    Date DATE,
    Amount DECIMAL(11, 2),
    Category VARCHAR(50),
    PRIMARY KEY(TransactionID),
    FOREIGN KEY(UserID) REFERENCES User(UserID),
    FOREIGN KEY(CardID) REFERENCES CreditCard(CardID),
    FOREIGN KEY(AccountID) REFERENCES BankAccount(AccountID)
);