import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Globe, Save } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  preferredCurrency: string;
}

const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY', 'CNY'];

const Profile = () => {
  const { login } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({ name: '', preferredCurrency: 'USD' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get('/users/me')
      .then(res => {
        const data = res.data.data;
        setProfile(data);
        setFormData({ name: data.name, preferredCurrency: data.preferredCurrency });
      })
      .catch(err => console.error('Profile fetch error', err))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/users/profile', formData);
      setProfile(res.data.data);
      // Update local storage/context if name changed
      login(localStorage.getItem('accessToken')!, res.data.data);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '64px', textAlign: 'center' }}><div className="loading-spinner"></div></div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>Account Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Update your personal information and preferences</p>
      </div>

      <div style={{ padding: '32px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
        <form onSubmit={handleUpdate}>
          {message.text && (
            <div style={{ 
              padding: '12px', borderRadius: '4px', marginBottom: '24px', fontSize: '0.875rem',
              background: message.type === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
              color: message.type === 'success' ? 'var(--accent)' : 'var(--danger)',
              border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`
            }}>
              {message.text}
            </div>
          )}

          <div className="form-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required 
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                value={profile?.email} 
                disabled 
                style={{ paddingLeft: '38px', background: 'var(--bg-secondary)', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Preferred Currency</label>
            <div style={{ position: 'relative' }}>
              <Globe size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <select 
                value={formData.preferredCurrency} 
                onChange={(e) => setFormData({ ...formData, preferredCurrency: e.target.value })}
                style={{ paddingLeft: '38px' }}
              >
                {CURRENCY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} disabled={saving}>
            {saving ? <div className="loading-spinner" style={{ borderTopColor: 'white' }}></div> : (
              <>
                <Save size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
