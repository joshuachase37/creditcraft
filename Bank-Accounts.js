import React from 'react';
import { Link } from 'react-router-dom';

function BankAccounts() {
  return (
    <div>
      <h2>Bank Accounts</h2>
      <p>Please select an option:</p>
      <Link to="/bankaccounts/add">
        <button>Add New Bank Account</button>
      </Link>
      <br />
      <Link to="/bankaccounts/view">
        <button>View Existing Bank Accounts</button>
      </Link>
    </div>
  );
}

export default BankAccounts;