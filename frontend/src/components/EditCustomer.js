import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import config from '../config';
import '../styles/modern.css';

function EditCustomer() {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchCustomer = useCallback(async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/api/customers/${id}/`);
      setName(response.data.faam_name);
      setMobile(response.data.faam_mobile);
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${config.API_BASE_URL}/api/customers/${id}/`, {
        faam_name: name,
        faam_mobile: mobile
      });
      navigate('/');
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  return (
    <div className="modern-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="modern-title">Edit Customer</h2>
        <Link to="/" className="btn btn-modern-primary shine-button">
          <i className="fas fa-arrow-left me-2"></i>Back to List
        </Link>
      </div>
      <div className="modern-form">
        <form onSubmit={handleSubmit} className="fade-in">
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
          <div className="d-flex justify-content-end gap-2">
            <Link to="/" className="btn btn-modern-warning shine-button">
              <i className="fas fa-times me-2"></i>Cancel
            </Link>
            <button type="submit" className="btn btn-modern-primary shine-button">
              <i className="fas fa-save me-2"></i>Update Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCustomer;