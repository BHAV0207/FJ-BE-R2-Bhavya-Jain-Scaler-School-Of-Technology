import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthSuccess = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      console.log('OAuth token found, logging in...');
      login(token, null);
      navigate('/', { replace: true });
    } else {
      console.error('No token found in OAuth success URL');
      navigate('/login', { replace: true });
    }
  }, [location, login, navigate]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Authenticating...</h2>
        <div className="loading-spinner"></div>
      </div>
    </div>
  );
};

export default OAuthSuccess;
