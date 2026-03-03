// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your pages
import Dashboard from './Pages/Dashboard';
import AddItem from './Pages/AddItem';
import MakeOrder from './Pages/MakeOrder';
import ReviewOrder from './Pages/ReviewOrder';
import PreviousOrders from './Pages/PreviousOrders';



function App() {
  return (
    <Router>
      <Routes>
        {/* The Home Page (Dashboard) */}
        <Route path="/" element={<Dashboard />} />
        
        {/* The 4 Feature Pages */}
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/make-order" element={<MakeOrder />} />
        <Route path="/review-order" element={<ReviewOrder />} />
        <Route path="/previous-orders" element={<PreviousOrders />} />
      </Routes>
    </Router>
  );
}

export default App;