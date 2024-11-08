// types.ts
export interface Expense {
  id?: string;
  amount: number;
  category: { id: string; title: string } | string | null;  // Accepts full object or ID
  subCategory: { id: string; title: string } | string | null;
  description?: string;
  date: string;
}

export interface Category {
  id: string;
  title: string;
}

export interface Subcategory {
  id: string;
  title: string;
}
