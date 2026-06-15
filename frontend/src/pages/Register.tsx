import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    currency: 'USD'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--surface)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Register</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '16px', fontSize: '0.875rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-sm">
            <label className="text-muted" style={{ display: 'block', marginBottom: '4px' }}>Full Name</label>
            <input name="name" type="text" onChange={handleChange} required placeholder="John Doe" />
          </div>
          <div className="mb-sm">
            <label className="text-muted" style={{ display: 'block', marginBottom: '4px' }}>Email</label>
            <input name="email" type="email" onChange={handleChange} required placeholder="you@example.com" />
          </div>
          <div className="mb-sm">
            <label className="text-muted" style={{ display: 'block', marginBottom: '4px' }}>Password</label>
            <input name="password" type="password" onChange={handleChange} required placeholder="••••••••" />
          </div>
          <div className="mb-sm">
            <label className="text-muted" style={{ display: 'block', marginBottom: '4px' }}>Preferred Currency</label>
            <select name="currency" onChange={handleChange} value={formData.currency}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
