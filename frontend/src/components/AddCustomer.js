import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import config from '../config';
import '../styles/modern.css';

function AddCustomer() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.API_BASE_URL}/api/customers/`, {
        faam_name: name,
        faam_mobile: mobile
      });
      navigate('/');
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  return (
    <div className="modern-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="modern-title">Add New Customer</h2>
        <Link to="/" className="btn btn-modern-primary shine-button">
          <i className="fas fa-arrow-left me-2"></i>Back to List
        </Link>
      </div>
      <div className="modern-form">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="modern-label">
              <i className="fas fa-user me-2"></i>Name
            </label>
            <input
              type="text"
              className="form-control modern-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter customer name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="modern-label">
              <i className="fas fa-mobile-alt me-2"></i>Mobile
            </label>
            <input
              type="text"
              className="form-control modern-input"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter mobile number"
              required
            />
          </div>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-modern-primary shine-button">
              <i className="fas fa-plus me-2"></i>Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCustomer;