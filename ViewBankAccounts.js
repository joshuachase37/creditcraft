import React, { useState, useEffect } from 'react';

function ViewBankAccounts() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const userID = sessionStorage.getItem('userID');

  const fetchBankAccounts = async () => {
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
  };

  useEffect(() => {
    if (userID) {
      fetchBankAccounts();
    }
  }, [userID]);

  const handleUpdate = async (accountID) => {
    const options = ['AccountInfo', 'BankName', 'Balance'];
    const selectedOption = prompt(`Select the parameter to update:\n${options.join('\n')}`);
    if (selectedOption === null) {
      return; // User clicked Cancel
    }
    if (!options.includes(selectedOption)) {
      alert('Invalid option selected. Please try again.');
      return;
    }
    const newValue = prompt(`Enter the new ${selectedOption}:`);
    if (newValue === null) {
      return; // User clicked Cancel
    }
    try {
      const response = await fetch('http://127.0.0.1:5000/update_data', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'BankAccount',
          update_values: { [selectedOption]: newValue },
          condition: `AccountID=${accountID}`,
        }),
      });
  
      if (response.ok) {
        alert('Bank account updated successfully');
        fetchBankAccounts(); // Refresh the bank accounts list after updating
      } else {
        alert('Failed to update bank account. Please try again.');
      }
    } catch (error) {
      console.error('Error updating bank account:', error);
      alert('Failed to update bank account. Please try again.');
    }
  };

  const handleDelete = async (accountID) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/delete_data', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'BankAccount',
          condition: `AccountID=${accountID}`,
        }),
      });

      if (response.ok) {
        alert('Bank account deleted successfully');
        fetchBankAccounts(); // Refresh the bank accounts list after deleting
      } else {
        alert('Failed to delete bank account. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting bank account:', error);
      alert('Failed to delete bank account. Please try again.');
    }
  };

  return (
    <div>
      <h2>View Existing Bank Accounts</h2>
      <table>
        <thead>
          <tr>
            <th>Account Info</th>
            <th>Bank Name</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bankAccounts.map(account => (
            <tr key={account.AccountID}>
              <td>{account.AccountInfo}</td>
              <td>{account.BankName}</td>
              <td>{account.Balance}</td>
              <td>
                <button onClick={() => handleUpdate(account.AccountID)}>
                  Update
                </button>
                <button onClick={() => handleDelete(account.AccountID)}>
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

export default ViewBankAccounts;