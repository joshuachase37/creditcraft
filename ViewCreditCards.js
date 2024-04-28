import React, { useState, useEffect } from 'react';

function ViewCreditCards() {
  const [creditcards, setCreditCards] = useState([]);

  useEffect(() => {
    async function fetchCreditCards() {
      try {
        const response = await fetch('http://127.0.0.1:5000/get_data?table_name=CreditCard', {
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
          InterestRate: row[5],
        }));
        setCreditCards(formattedData);
      } catch (error) {
        console.error('Error fetching credit cards:', error);
      }
    }

    fetchCreditCards();
  }, []);

  return (
    <div>
      <h2>View Existing Credit Cards</h2>
      <ul>
        {creditcards.map(creditcard => (
          <li key={creditcard.CardID}>
            {creditcard.CardInfo} - {creditcard.AvailableCredit} - {creditcard.CurrentBalance} - {creditcard.InterestRate}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewCreditCards;