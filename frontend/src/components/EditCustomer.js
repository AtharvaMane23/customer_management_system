import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import config from '../config';

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
    <div>
      <h2>Edit Customer</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mobile:</label>
          <input
            type="text"
            className="form-control"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Customer</button>
      </form>
    </div>
  );
}

export default EditCustomer;