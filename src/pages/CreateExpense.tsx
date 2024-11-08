import React, { useState, useEffect } from 'react';
import { createExpense, getCategories, getSubcategories } from '../api/api';
import { Expense, Category, Subcategory } from '../types/types';
import './CreateExpense.css';

const CreateExpense = () => {
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [showIncompletePopup, setShowIncompletePopup] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        try {
          const fetchedSubcategories = await getSubcategories(selectedCategory);
          setSubcategories(fetchedSubcategories);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      } else {
        setSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [selectedCategory]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!amount || !description || !date || !selectedCategory || !selectedSubcategory) {
      setShowIncompletePopup(true);
      setTimeout(() => setShowIncompletePopup(false), 3000);
      return;
    }

    const expenseData: Expense = {
      amount,
      description,
      date,
      category: selectedCategory,
      subCategory: selectedSubcategory,
    };

    try {
      const createdExpense = await createExpense(expenseData);
      console.log("Expense created:", createdExpense);

      setAmount(0);
      setDescription('');
      setDate('');
      setSelectedCategory('');
      setSelectedSubcategory('');
      setShowSuccessPopup(true);

      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const isFormIncomplete = !amount || !description || !date || !selectedCategory || !selectedSubcategory;

  return (
    <>
      <form onSubmit={handleSubmit} className="create-expense-form">
        <label>Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} />

        <label>Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

        <label>Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>

        <label>Subcategory</label>
        <select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.title}
            </option>
          ))}
        </select>

        <button type="submit" disabled={isFormIncomplete}>Create Expense</button>
      </form>

      {showSuccessPopup && (
        <div id="popup" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #ccc',
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        }}>
          Expense created successfully!
        </div>
      )}

      {showIncompletePopup && (
        <div id="popup" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'lightcoral',
          padding: '20px',
          border: '1px solid #ccc',
          zIndex: 1000,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          color: 'white',
          fontWeight: 'bold',
        }}>
          Please fill in all fields before submitting.
        </div>
      )}
    </>
  );
};

export default CreateExpense;
