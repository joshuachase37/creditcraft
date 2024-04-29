import React, { useState } from 'react';

function NewAssets() {
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const userID = sessionStorage.getItem('userID');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = 'http://127.0.0.1:5000/insert_asset';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: userID,
          Type: type,
          Name: name,
          CurrentValue: amount,
        }),
      });

      if (response.ok) {
        alert('Asset added successfully');
        setType('');
        setName('');
        setAmount('');
      } else {
        alert('Failed to add asset. Please try again.');
      }
    } catch (error) {
      console.error('Error adding asset:', error);
      alert('Failed to add asset. Please try again.');
    }
  };

  return (
    <div>
      <h2>Add New Asset</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Type:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>
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
        <button type="submit" className="btn btn-primary">
          Add Asset
        </button>
      </form>
    </div>
  );
}

export default NewAssets;