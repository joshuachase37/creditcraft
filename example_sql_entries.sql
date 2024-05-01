    
Insert Into CreditCraft.User(UserID, Name, DOB, Age)
	Values (1, 'John Smith', '2024-04-21', 0);
    
Insert Into CreditCraft.Asset(AssetID, UserID, Type, Name, CurrentValue)
	Values (1, 4, "Cryptocurrency", "Bitcoin", 127.62);
	
Insert Into CreditCraft.Asset(AssetID, UserID, Type, Name, CurrentValue)
	Values (2, 1, "Stock", "AWK", 15);
    
Insert Into CreditCraft.Authentication(LoginID, UserID, Password, Email, Username)
	Values(1, 4, "Password", "johnsmith@gmail.com", "johnsmith");
    
Insert Into CreditCraft.BankAccount(AccountID, UserID, AccountInfo, BankName, Balance)
	Values(1, 4, "Checkings, 123456789", "Wells Fargo", 100000);
	
Insert Into CreditCraft.BankAccount(AccountID, UserID, AccountInfo, BankName, Balance)
	Values(2, 4, "Checkings, 123456789", "Wells Fargo", 100000);
    
Insert Into CreditCraft.CreditCard(CardID, UserID, CardInfo, AvailableCredit, CurrentBalance, InterestRate)
	Values(1, 4, "07-25, 1679, Debit", 1000, 12456, 07.56);
    
Insert Into CreditCraft.Transactions(TransactionID, UserID, CardID, AccountID, Merchant, Date, Amount, Category)
	Values(1, 4, 1, 1, "Target", "2024-04-21", 25.67, "Groceries");
    
    