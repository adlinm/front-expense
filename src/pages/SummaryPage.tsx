// src/pages/SummaryPage.tsx
import React, { useEffect, useState } from 'react';
import { Table, Select, Title, Loader, Group, Text } from '@mantine/core';
import { getExpenses } from '../api/api';
import { Expense } from '../types/types';
import { DonutChart } from '@mantine/charts';
import './SummaryPage.css';

interface Summary {
  label: string;
  total: number;
  spent: number;
  count: number;
}

const SummaryPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summaryType, setSummaryType] = useState<'category' | 'month'>('category');
  const [summaryData, setSummaryData] = useState<Summary[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  // Define a color palette for the donut chart
  const colorPalette = ['#231651', '#4DCCBD', '#2374AB', '#FF8484', '#D1F5BE', '#694D75'];

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const fetchedExpenses = await getExpenses();
        setExpenses(fetchedExpenses);

        // Calculate total income, spending, and balance
        const income = fetchedExpenses
          .filter((expense) => expense.amount > 0)
          .reduce((acc, expense) => acc + expense.amount, 0);
        const spending = fetchedExpenses
          .filter((expense) => expense.amount < 0)
          .reduce((acc, expense) => acc + expense.amount, 0);

        setTotalBalance(income + spending); // Remaining balance after spending
        setTotalSpent(spending); // Total spending (negative amounts)
      } catch (err) {
        setError('Failed to fetch expenses.');
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    const getSummary = (groupBy: 'category' | 'month') => {
      const keySelector = (expense: Expense) =>
        groupBy === 'category'
          ? typeof expense.category === 'object' && expense.category
            ? expense.category.title
            : 'Uncategorized'
          : new Date(expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });

      const summary = expenses.reduce((acc: { [key: string]: { total: number; spent: number; count: number } }, expense) => {
        const key = keySelector(expense);
        if (!acc[key]) {
          acc[key] = { total: 0, spent: 0, count: 0 };
        }
        if (expense.amount > 0) {
          acc[key].total += expense.amount; // Only positive amounts are added to total
        } else {
          acc[key].spent += expense.amount; // Negative amounts are summed separately for spending
        }
        acc[key].count += 1;
        return acc;
      }, {});
      return Object.entries(summary).map(([label, { total, spent, count }]) => ({ label, total, spent, count }));
    };

    setSummaryData(getSummary(summaryType));
  }, [expenses, summaryType]);

  // Prepare data for Donut Chart with only negative amounts (spent)
  const donutChartData = summaryData
    .filter(({ spent }) => spent < 0) // Include only entries with spending
    .map(({ label, spent }, index) => ({
      name: label,
      value: Math.abs(spent), // Use absolute value for chart visualization
      color: colorPalette[index % colorPalette.length], // Assign unique color per entry
    }));

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="summary-container">
      <Title order={2} className="summary-header">
        Expense Summary
      </Title>

      {/* Display Total Balance and Total Spending */}
      <Text size="lg" fw="bold" className="summary-balance">
        Balance: RM {totalBalance.toFixed(2)}
      </Text>
      <Text size="lg" fw="bold" color="red" className="summary-spend">
        Spending: RM {totalSpent.toFixed(2)}
      </Text>

      <Group className="summary-select-group">
        <Select
          label="Group by"
          value={summaryType}
          onChange={(value) => setSummaryType(value as 'category' | 'month')}
          data={[
            { value: 'category', label: 'Category' },
            { value: 'month', label: 'Month' },
          ]}
        />
      </Group>

      {/* Donut Chart with only negative amounts */}
      <DonutChart
        data={donutChartData}
        withLabels
        paddingAngle={5}
        tooltipDataSource="segment"
        size={250}
        mx="auto"
        thickness={20}
        chartLabel={summaryType === 'category' ? 'Spent by Category' : 'Spent by Month'}
      />

      <Table striped highlightOnHover className="summary-table">
        <thead>
          <tr>
            <th>{summaryType === 'category' ? 'Category' : 'Month'}</th>
            <th>Total Amount</th>
            <th>Total Amount Spent</th>
          </tr>
        </thead>
        <tbody>
          {summaryData.map(({ label, total, spent }) => (
            <tr key={label}>
              <td>{label}</td>
              <td style={{ color: 'green' }}>RM {total.toFixed(2)}</td>
              <td style={{ color: 'red' }}>RM {spent.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default SummaryPage;
