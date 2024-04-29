import React, { useState, useEffect } from 'react';

function ViewCreditCards() {
  const [creditCards, setCreditCards] = useState([]);
  const userID = sessionStorage.getItem('userID');

  const fetchCreditCards = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get_data?table_name=CreditCard&userID=${userID}`, {
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
        CardID: row[0],
        UserID: row[1],
        CardInfo: row[2],
        AvailableCredit: row[3],
        CurrentBalance: row[4],
        InterestRate: row[5]
      }));
      setCreditCards(formattedData);
    } catch (error) {
      console.error('Error fetching credit cards:', error);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchCreditCards();
    }
  }, [userID]);

  const handleUpdate = async (cardID) => {
    const options = ['CardInfo', 'AvailableCredit', 'CurrentBalance', 'InterestRate'];
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
          table_name: 'CreditCard',
          update_values: { [selectedOption]: newValue },
          condition: `CardID=${cardID}`,
        }),
      });
  
      if (response.ok) {
        alert('Credit card updated successfully');
        fetchCreditCards(); // Refresh the credit cards list after updating
      } else {
        alert('Failed to update credit card. Please try again.');
      }
    } catch (error) {
      console.error('Error updating credit card:', error);
      alert('Failed to update credit card. Please try again.');
    }
  };

  const handleDelete = async (cardID) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/delete_data', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          table_name: 'CreditCard',
          condition: `CardID=${cardID}`,
        }),
      });

      if (response.ok) {
        alert('Credit card deleted successfully');
        fetchCreditCards(); // Refresh the credit cards list after deleting
      } else {
        alert('Failed to delete credit card. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting credit card:', error);
      alert('Failed to delete credit card. Please try again.');
    }
  };

  return (
    <div>
      <h2>View Existing Credit Cards</h2>
      <table>
        <thead>
          <tr>
            <th>Card Info</th>
            <th>Available Credit</th>
            <th>Current Balance</th>
            <th>Interest Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {creditCards.map(card => (
            <tr key={card.CardID}>
              <td>{card.CardInfo}</td>
              <td>{card.AvailableCredit}</td>
              <td>{card.CurrentBalance}</td>
              <td>{card.InterestRate}</td>
              <td>
                <button onClick={() => handleUpdate(card.CardID)}>
                  Update
                </button>
                <button onClick={() => handleDelete(card.CardID)}>
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

export default ViewCreditCards;