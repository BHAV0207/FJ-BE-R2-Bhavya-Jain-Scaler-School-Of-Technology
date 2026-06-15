import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { User, Mail, Lock, DollarSign, ArrowRight, Wallet } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', preferredCurrency: 'USD' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', formData);
      navigate('/login', { state: { message: 'Account created! Please sign in with your new credentials.' } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-page bg-gradient">
      <div className="card glass auth-card" style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'inline-flex', padding: '12px', background: 'rgba(99, 102, 241, 0.1)', 
            borderRadius: '16px', color: 'var(--primary)', marginBottom: '16px' 
          }}>
            <Wallet size={32} />
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Join us!</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Step into a smarter financial future</p>
        </div>

        {error && <div className="error-alert" style={{ marginBottom: '24px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input name="name" type="text" onChange={handleChange} required placeholder="Full name" style={{ paddingLeft: '44px' }} />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input name="email" type="email" onChange={handleChange} required placeholder="name@company.com" style={{ paddingLeft: '44px' }} />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input name="password" type="password" onChange={handleChange} required placeholder="••••••••" style={{ paddingLeft: '44px' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '32px' }}>
            <label>Preferred Currency</label>
            <div style={{ position: 'relative' }}>
              <DollarSign size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <select name="preferredCurrency" onChange={handleChange} value={formData.preferredCurrency} style={{ paddingLeft: '44px' }}>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="INR">INR — Indian Rupee</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', justifyContent: 'center' }} disabled={loading}>
            {loading ? <div className="loading-spinner"></div> : (
              <>
                <span>Create Free Account</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Sign in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
