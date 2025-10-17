import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import CustomerList from './components/CustomerList';
import AddCustomer from './components/AddCustomer';
import EditCustomer from './components/EditCustomer';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <h1 className="text-center mb-4">Customer Management System</h1>
        <Routes>
          <Route path="/" element={<CustomerList />} />
          <Route path="/add" element={<AddCustomer />} />
          <Route path="/edit/:id" element={<EditCustomer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
