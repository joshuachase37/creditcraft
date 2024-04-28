import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Features from './Features';
import Assets from './Assets';
import BankAccounts from './Bank-Accounts';
import CreditCards from './Credit-Cards';
import Transactions from './Transactions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/bankaccounts" element={<BankAccounts />} />
        <Route path="/creditcards" element={<CreditCards />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
}

export default App;