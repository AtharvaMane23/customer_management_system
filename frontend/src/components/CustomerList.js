import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config';
import '../styles/modern.css';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      console.log('Fetching from:', `${config.API_BASE_URL}/api/customers/`);
      const response = await axios.get(`${config.API_BASE_URL}/api/customers/`);
      console.log('Response:', response.data);
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error.response || error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`${config.API_BASE_URL}/api/customers/${id}/`);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  return (
    <div className="modern-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="modern-title">Customer Management</h2>
        <Link to="/add" className="btn btn-modern-primary shine-button">
          <i className="fas fa-plus me-2"></i>Add Customer
        </Link>
      </div>
      <div className="modern-table-container">
        {customers.length === 0 ? (
          <div className="text-center p-5">
            <i className="fas fa-users fa-3x mb-3 text-muted"></i>
            <h3 className="text-muted">No Customers Found</h3>
            <p className="text-muted mb-3">Start by adding your first customer</p>
            <Link to="/add" className="btn btn-modern-primary shine-button">
              <i className="fas fa-plus me-2"></i>Add Customer
            </Link>
          </div>
        ) : (
          <table className="table modern-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.faam_id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <td>{customer.faam_id}</td>
                  <td>{customer.faam_name}</td>
                  <td>{customer.faam_mobile}</td>
                  <td>
                    <Link 
                      to={`/edit/${customer.faam_id}`} 
                      className="btn btn-sm btn-modern-warning shine-button me-2"
                    >
                      <i className="fas fa-edit me-1"></i>Edit
                    </Link>
                    <button 
                      onClick={() => handleDelete(customer.faam_id)} 
                      className="btn btn-sm btn-modern-danger shine-button"
                    >
                      <i className="fas fa-trash-alt me-1"></i>Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CustomerList;