// api.ts
import axios from 'axios';
import { Expense, Category, Subcategory } from '../types/types';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

// Fetch all expenses
export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const response = await api.get('/expenses', {
      params: {
        populate: ['category', 'subCategory'],
        limit: 0, // Ensure related fields are populated
      },
    });
    console.log('API response:', response.data); // Log to check structure
    return response.data.docs || response.data;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

// Fetch all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/categories');
    console.log('Fetched categories:', response.data.docs); // Log categories
    return response.data.docs;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// Create a new expense
export const createExpense = async (expenseData: Expense): Promise<Expense> => {
  try {
    const response = await api.post('/expenses', expenseData); // payload expects the ID structure as mentioned
    console.log('Expense created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
};


// Fetch subcategories by category
export const getSubcategories = async (categoryId: string): Promise<Subcategory[]> => {
  try {
    const response = await api.get(`/subcategories?category=${categoryId}`);
    console.log('Fetched subcategories:', response.data.docs); // Log subcategories
    return response.data.docs;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

export default api;
