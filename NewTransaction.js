/*

Notes from Elijah:
- Users can only select card and account id which exist already in those respected tables
- This prevents any SQL foreign key restraint errors

*/

import React, { useState, useEffect } from 'react';

function NewTransactions() {
  const [merchant, setMerchant] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [cardID, setCardID] = useState('');
  const [accountID, setAccountID] = useState('');
  const userID = sessionStorage.getItem('userID');
  const [cards, setCards] = useState([]);
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
  const fetchCardData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_data?table_name=CreditCard&userID=${userID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch card data');
      }
      const data = await response.json();
      console.log("Card data:", data); // Add this line to log the fetched card data
      setCards(data.data);
      if (data.data.length > 0) {
        setCardID(data.data[0][0]); // Assuming CardID is the first column
      }
    } catch (error) {
      console.error('Error fetching card data:', error);
    }
  };

  const fetchAccountData = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_data?table_name=BankAccount&userID=${userID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch account data');
      }
      const data = await response.json();
      console.log("Account data:", data); // Add this line to log the fetched account data
      setAccounts(data.data);
      if (data.data.length > 0) {
        setAccountID(data.data[0][0]); // Assuming AccountID is the first column
      }
    } catch (error) {
      console.error('Error fetching account data:', error);
    }
  };

  if (userID) {
    fetchCardData();
    fetchAccountData();
  }
 }, [userID]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = 'http://127.0.0.1:5000/insert_transactions';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: userID,
          CardID: cardID,
          AccountID: accountID,
          Merchant: merchant,
          Date: date,
          Amount: amount,
          Category: category,
        }),
      });

      if (response.ok) {
        alert('Transaction added successfully');
        setMerchant('');
        setDate('');
        setAmount('');
        setCategory('');
        setCardID('');
        setAccountID('');
      } else {
        alert('Failed to add transaction. Please try again.');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

 return (
  <div>
    <h2>Add New Transaction</h2>
    <form onSubmit={handleSubmit}>
      {/* Merchant input */}
      <div className="form-group">
        <label>Merchant:</label>
        <input
          type="text"
          value={merchant}
          onChange={(e) => setMerchant(e.target.value)}
          required
          className="form-control"
        />
      </div>
      
      {/* Date input */}
      <div className="form-group">
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="form-control"
        />
      </div>
      
      {/* Amount input */}
      <div className="form-group">
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="form-control"
        />
      </div>
      
      {/* Category input */}
      <div className="form-group">
        <label>Category:</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="form-control"
        />
      </div>
      
      {/* Card and Account dropdowns */}
      <div className="form-group">
        <label>Card:</label>
        <select value={cardID} onChange={(e) => setCardID(e.target.value)} required className="form-control">
          <option value="">Select Card</option>
          {cards.map(card => (
            <option key={card[0]} value={card[0]}>{card[0]}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Account:</label>
        <select value={accountID} onChange={(e) => setAccountID(e.target.value)} required className="form-control">
          <option value="">Select Account</option>
          {accounts.map(account => (
            <option key={account[0]} value={account[0]}>{account[0]}</option>
          ))}
        </select>
      </div>
      
      {/* Submit button */}
      <button type="submit" className="btn btn-primary">
        Add Transaction
      </button>
    </form>
  </div>
 );
}

export default NewTransactions;
