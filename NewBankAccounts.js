import React, { useState } from 'react';

function NewBankAccounts() {
  const [accounttype, setAccountType] = useState('');
  const [accountnumber, setAccountNumber] = useState('');
  const [bankname, setBankName] = useState('');
  const [balance, setBalance] = useState('');
  const userID = sessionStorage.getItem('userID');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = 'http://127.0.0.1:5000/insert_bankaccount';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: userID,
          AccountType: accounttype,
          AccountNumber: accountnumber,
          BankName: bankname,
          Balance: balance,
        }),
      });

      if (response.ok) {
        alert('Bank account added successfully');
        setAccountType('');
        setAccountNumber('');
        setBankName('');
        setBalance('');
      } else {
        alert('Failed to add bank account. Please try again.');
      }
    } catch (error) {
      console.error('Error adding bank account:', error);
      alert('Failed to add bank account. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add New Bank Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Account Type:</label>
          <input
            type="text"
            value={accounttype}
            onChange={(e) => setAccountType(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Account Number:</label>
          <input
            type="number"
            value={accountnumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Bank Name:</label>
          <input
            type="text"
            value={bankname}
            onChange={(e) => setBankName(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Balance:</label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Bank Account
        </button>
      </form>
    </div>
  );
}

export default NewBankAccounts;