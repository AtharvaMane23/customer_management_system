import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import config from '../config';

function CustomerList() {
  const [customers, setCustomers] = useState([]);

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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Customers</h2>
        <Link to="/add" className="btn btn-primary">Add Customer</Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.faam_id}>
              <td>{customer.faam_id}</td>
              <td>{customer.faam_name}</td>
              <td>{customer.faam_mobile}</td>
              <td>
                <Link to={`/edit/${customer.faam_id}`} className="btn btn-sm btn-warning me-2">Edit</Link>
                <button onClick={() => handleDelete(customer.faam_id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomerList;