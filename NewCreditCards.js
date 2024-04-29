import React, { useState } from 'react';

function NewCreditCards() {
  const [expirydate, setExpiryDate] = useState('');
  const [cardnumber, setCardNumber] = useState('');
  const [cardtype, setCardType] = useState('');
  const [availablecredit, setAvailableCredit] = useState('');
  const [currentbalance, setCurrentBalance] = useState('');
  const [interestrate, setInterestRate] = useState('');
  const userID = sessionStorage.getItem('userID');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = 'http://127.0.0.1:5000/insert_creditcard';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: userID,
          ExpiryDate: expirydate,
          CardNumber: cardnumber,
          CardType: cardtype,
          AvailableCredit: availablecredit,
          CurrentBalance: currentbalance,
          InterestRate: interestrate,
        }),
      });

      if (response.ok) {
        alert('Credit card added successfully');
        setExpiryDate('');
        setCardNumber('');
        setCardType('');
        setAvailableCredit('');
        setCurrentBalance('');
        setInterestRate('');
      } else {
        alert('Failed to add credit card. Please try again.');
      }
    } catch (error) {
      console.error('Error adding credit card:', error);
      alert('Failed to add credit card. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add New credit Card</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Expiry Date:</label>
          <input
            type="text"
            value={expirydate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Card Number:</label>
          <input
            type="number"
            value={cardnumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Card Type:</label>
          <input
            type="text"
            value={cardtype}
            onChange={(e) => setCardType(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Available Credit:</label>
          <input
            type="number"
            value={availablecredit}
            onChange={(e) => setAvailableCredit(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Current Balance:</label>
          <input
            type="number"
            value={currentbalance}
            onChange={(e) => setCurrentBalance(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Interest Rate:</label>
          <input
            type="number"
            value={interestrate}
            onChange={(e) => setInterestRate(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Credit Card
        </button>
      </form>
    </div>
  );
}

export default NewCreditCards;