import React from 'react';
import { Link } from 'react-router-dom';

function CreditCards() {
  return (
    <div>
      <h2>Credit Cards</h2>
      <p>Please select an option:</p>
      <Link to="/creditcards/add">
        <button>Add New Credit Card</button>
      </Link>
      <br />
      <Link to="/creditcards/view">
        <button>View Existing Credit Cards</button>
      </Link>
    </div>
  );
}

export default CreditCards;