/*

Notes from Elijah:
- Update code allows the user to update the cardID and the accountID but only for values that already exist in their respetive tables

*/

import React, { useState, useEffect } from 'react';

function ViewTransactions() {
  const [transactions, setTransactions] = useState([]);
  const userID = sessionStorage.getItem('userID');

  const fetchTransactions = async () => {
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
	  console.log("HERE");
	  
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
  };

  useEffect(() => {
    if (userID) {
      fetchTransactions();
    }
  }, [userID]);

 const handleUpdate = async (transactionID) => {
  const selectedOption = prompt(`Select the parameter to update:\nMerchant\nDate\nAmount\nCategory\nCardID\nAccountID`);

  if (selectedOption === null) {
    return; // User clicked Cancel
  }

  let newValue;
  if (selectedOption === 'CardID' || selectedOption === 'AccountID') {
    const table = selectedOption === 'CardID' ? 'CreditCard' : 'BankAccount';
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_data?table_name=${table}&userID=${userID}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${selectedOption} data`);
      }
      const data = await response.json();
      const validIDs = data.data.map(row => row[0]); // Extracting only the first column (ID)
      newValue = prompt(`Enter the new ${selectedOption}:`);

      if (newValue === null) {
        return;
      }

      const answer = validIDs.map(id => id.toString()).includes(newValue.toString());
      if (!answer) {
        alert(`Invalid ${selectedOption}. Please enter a value that already exists in the ${selectedOption === 'CardID' ? 'credit card' : 'bank account'} table.`);
        return;
      }
    } catch (error) {
      console.error(`Error fetching ${selectedOption} data:`, error);
      alert(`Failed to fetch ${selectedOption} data. Please try again.`);
      return;
    }
  } else {
    newValue = prompt(`Enter the new ${selectedOption}:`);
    if (newValue === null) {
      return; // User clicked Cancel
    }
  }

  const updatedTransaction = {
    [selectedOption]: newValue
  };

  try {
    const response = await fetch('http://127.0.0.1:5000/update_data', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table_name: 'Transactions',
        update_values: updatedTransaction,
        condition: `TransactionID=${transactionID}`,
      }),
    });

    if (response.ok) {
      alert('Transaction updated successfully');
      fetchTransactions(); // Refresh the transactions list after updating
    } else {
      alert('Failed to update transaction. Please try again.');
    }
  } catch (error) {
    console.error('Error updating transaction:', error);
    alert('Failed to update transaction. Please try again.');
  }
 };

  const handleDelete = async (transactionID) => {
   try {
    const response = await fetch('http://127.0.0.1:5000/delete_data', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        table_name: 'Transactions',
        condition: `TransactionID=${transactionID}`,
      }),
    });

    if (response.ok) {
      alert('Transaction deleted successfully');
      fetchTransactions(); // Refresh the transactions list after deleting
    } else {
      alert('Failed to delete transaction. Please try again.');
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    alert('Failed to delete transaction. Please try again.');
  }
 };


 return (
  <div>
    <h2>View Existing Transactions</h2>
    <table>
      <thead>
        <tr>
          <th>Merchant</th>
          <th>Date</th>
          <th>Amount</th>
          <th>Category</th>
          <th>Card ID</th>
          <th>Account ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(transaction => (
          <tr key={transaction.TransactionID}>
            <td>{transaction.Merchant}</td>
            <td>{transaction.Date}</td>
            <td>{transaction.Amount}</td>
            <td>{transaction.Category}</td>
            <td>{transaction.CardID}</td>
            <td>{transaction.AccountID}</td>
            <td>
              <button onClick={() => handleUpdate(transaction.TransactionID)}>
                Update
              </button>
              <button onClick={() => handleDelete(transaction.TransactionID)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
 );
}


export default ViewTransactions;
