// App.tsx
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import '@mantine/charts/styles.css';
import theme from './theme';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home.page';
import SummaryPage from './pages/SummaryPage';
import './App.css';

function App() {
  return (
    <Router>
      <MantineProvider theme={theme}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/summary" element={<SummaryPage />} /> {/* Add route for summary */}
        </Routes>
      </MantineProvider>
    </Router>
  );
}

export default App;
