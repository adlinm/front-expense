// ExpenseList.tsx
import React, { useEffect, useState } from 'react';
import { Pagination, Text } from '@mantine/core';
import { getExpenses } from '../api/api';
import { Expense } from '../types/types';
import './ExpenseList.css';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';

const chunk = <T,>(array: T[], size: number): T[][] => {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
};

const ExpenseList = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activePage, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const fetchedExpenses = await getExpenses();
        console.log('Fetched Expenses:', fetchedExpenses); // Verify the data structure here
        setExpenses(fetchedExpenses);
      } catch (err) {
        setError("Failed to fetch expenses.");
        console.error("Error fetching expenses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  // Chunk the expenses into pages
  const paginatedExpenses = chunk(expenses, itemsPerPage);
  
  return (
    <div className="expense-list">
      <h2>Expense List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : paginatedExpenses.length > 0 ? (
        <>
          <table className="expense-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Category</th>
                <th>Subcategory</th>
              </tr>
            </thead>
            <tbody>
              {paginatedExpenses[activePage - 1].map((expense) => (
                <tr key={expense.id}>
                  <td>{expense.description || 'No description'}</td>
                  <td>{expense.amount !== undefined ? `$${expense.amount.toFixed(2)}` : 'N/A'}</td>
                  <td>{expense.date ? new Date(expense.date).toLocaleDateString() : 'No date'}</td>
                  <td>{typeof expense.category === 'object' ? expense.category?.title : 'No category'}</td>
                  <td>{typeof expense.subCategory === 'object' ? expense.subCategory?.title : 'No subcategory'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            total={paginatedExpenses.length}
            value={activePage}
            onChange={setPage}
            mt="sm"
          />
        </>
      ) : (
        <p>No expenses found.</p>
      )}
    </div>
  );
};

export default ExpenseList;
