// src/pages/Home.page.tsx
import React from 'react';
import { Welcome } from '../components/Welcome/Welcome';
import ExpenseList from './ExpenseList';
import CreateExpense from './CreateExpense';
import SummaryPage from './SummaryPage';
import './Home.page.css';

export function HomePage() {
  return (
    <div className="dashboard">
      <Welcome />

      <div className="section">
        <h2>Expense Summary</h2>
        <SummaryPage />
      </div>

      <div className="section">
        <h2>Expense List</h2>
        <ExpenseList />
      </div>

      <div className="section">
        <h2>Add Expense</h2>
        <CreateExpense />
      </div>
    </div>
  );
}

export default HomePage;
