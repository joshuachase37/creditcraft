import React from 'react';
import { Link } from 'react-router-dom';

function Features() {
  return (
    <div>
      <h2>Features</h2>
      <p>Please select a feature:</p>
      <Link to="/assets">
        <button>Assets</button>
      </Link>
      <br />
      <Link to="/bankaccounts">
        <button>Bank Accounts</button>
      </Link>
      <br />
      <Link to="/creditcards">
        <button>Credit Cards</button>
      </Link>
      <br />
      <Link to="/transactions">
        <button>Transactions</button>
      </Link>
    </div>
  );
}

export default Features;