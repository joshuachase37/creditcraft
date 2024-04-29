import React, { useState, useEffect } from 'react';

function ViewTransactions() {
  const [transactions, setTransactions] = useState([]);
  const userID = sessionStorage.getItem('userID');

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(`http://127.0.0.1:5000/get_data?table_name=Transactions&userID=${userID}`, {
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
          TransactionID: row[0],
          UserID: row[1],
          CardID: row[2],
          AccountID: row[3],
          Merchant: row[4],
          Date: row[5],
          Amount: row[6],
          Category: row[7]
        }));
        setTransactions(formattedData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    }
	
    if (userID) { // If the userID exist, then call the API
      fetchTransactions();
    }
  }, [userID]);

  return (
    <div>
      <h2>View Existing Transactions</h2>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.TransactionID}>
            {transaction.Merchant} - {transaction.Date} - {transaction.Amount} - {transaction.Category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewTransactions;
