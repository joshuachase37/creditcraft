import React, { useState, useEffect } from 'react';

function ViewBankAccounts() {
  const [bankaccounts, setBankAccounts] = useState([]);
  const userID = sessionStorage.getItem('userID'); // Ensure userID is retrieved correctly

  useEffect(() => {
    async function fetchBankAccounts() {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get_data?table_name=BankAccount&userID=${userID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const formattedData = data.data.map(row => ({
          AccountID: row[0],
          UserID: row[1],
          AccountInfo: row[2],
          BankName: row[3],
          Balance: row[4]
        }));
        setBankAccounts(formattedData);
      } catch (error) {
        console.error('Error fetching bank accounts:', error);
      }
    }

    if (userID) { // If the userID exists, then call the API
	  console.log("Bank: ");
      fetchBankAccounts();
    }
  }, [userID]);

  return (
    <div>
      <h2>View Existing Bank Accounts</h2>
      <ul>
        {bankaccounts.map(bankaccount => (
          <li key={bankaccount.AccountID}>
            {bankaccount.AccountInfo} - {bankaccount.BankName} - {bankaccount.Balance}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewBankAccounts;
