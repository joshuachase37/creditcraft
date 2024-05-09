import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Home from './Home';
import Features from './Features';
import Assets from './Assets';
import BankAccounts from './Bank-Accounts';
import CreditCards from './Credit-Cards';
import Transactions from './Transactions';
import ViewAssets from './ViewAssets';
import ViewBankAccounts from './ViewBankAccounts';
import ViewCreditCards from './ViewCreditCards';
import ViewTransactions from './ViewTransactions';
import NewAssets from './NewAssets';
import NewBankAccounts from './NewBankAccounts';
import NewCreditCards from './NewCreditCards';
import NewTransaction from './NewTransaction';
import ViewUser from './ViewUser';

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
        <Route path="/assets/view" element={<ViewAssets />} />
        <Route path="/bankaccounts/view" element={<ViewBankAccounts />} />
        <Route path="/creditcards/view" element={<ViewCreditCards />} />
        <Route path="/transactions/view" element={<ViewTransactions />} />
        <Route path="/assets/add" element={<NewAssets />} />
        <Route path="/bankaccounts/add" element={<NewBankAccounts />} />
        <Route path="/creditcards/add" element={<NewCreditCards />} />
        <Route path="/transactions/add" element={<NewTransaction />} />
        <Route path="/user-info" element={<ViewUser />} />
      </Routes>
    </Router>
  );
}

export default App;