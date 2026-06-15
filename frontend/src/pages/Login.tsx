import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { LogIn, Mail, Lock, AlertCircle, Globe } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data.data;
      login(accessToken, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    window.location.href = `${backendUrl}/api/v1/auth/google`;
  };

  return (
    <div className="auth-page bg-gradient">
      <div className="auth-card glass">
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            background: 'var(--primary)', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.2)'
          }}>
            <LogIn size={32} color="white" />
          </div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your wealth with precision</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label htmlFor="password">Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8125rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Forgot Password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: '44px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? <div className="loading-spinner"></div> : (
              <>
                <LogIn size={18} />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div style={{ margin: '24px 0', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border)', zIndex: 0 }}></div>
          <span style={{ position: 'relative', background: 'var(--bg-secondary)', padding: '0 16px', color: 'var(--text-secondary)', fontSize: '0.8125rem', borderRadius: '4px' }}>OR</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline"
          style={{ width: '100%', gap: '12px' }}
        >
          <Globe size={18} />
          <span>Continue with Google</span>
        </button>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          New here? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>Create an account</Link>
        </p>
      </div>

      {/* Decorative elements */}
      <div style={{ 
        position: 'absolute', 
        top: '-10%', 
        right: '-5%', 
        width: '40%', 
        height: '40%', 
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        zIndex: 0
      }}></div>
      <div style={{ 
        position: 'absolute', 
        bottom: '-10%', 
        left: '-5%', 
        width: '40%', 
        height: '40%', 
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
        zIndex: 0
      }}></div>
    </div>
  );
};

export default Login;
