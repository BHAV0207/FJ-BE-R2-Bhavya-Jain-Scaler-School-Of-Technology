import React, { useState, useEffect } from 'react';
import api from '../api';
import { Trash2 } from 'lucide-react';

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ category_id: '', amount: '', period: 'monthly' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([api.get('/budgets'), api.get('/categories')]);
      setBudgets(bRes.data);
      setCategories(cRes.data.filter((c: any) => c.type === 'expense'));
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/budgets', formData);
      setFormData({ category_id: '', amount: '', period: 'monthly' });
      fetchData();
    } catch (err) {
      console.error('Error adding budget', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this budget?')) return;
    try {
      await api.delete(`/budgets/${id}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting budget', err);
    }
  };

  return (
    <div>
      <h1>Budgets</h1>
      <div className="grid mt-md" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="card">
          <h3 className="mb-sm">Set Budget</h3>
          <form onSubmit={handleAdd}>
            <div className="mb-sm">
              <label className="text-muted">Category</label>
              <select 
                value={formData.category_id} 
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })} 
                required
              >
                <option value="">Select Category</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-sm">
              <label className="text-muted">Monthly Limit</label>
              <input 
                type="number" 
                value={formData.amount} 
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
                required 
                placeholder="0.00" 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Set Budget
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="mb-sm">Active Budgets</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loading ? (
              <div>Loading...</div>
            ) : budgets.length === 0 ? (
              <div className="text-muted">No budgets set.</div>
            ) : (
              budgets.map((b: any) => {
                const percentage = Math.min(100, (b.spent_amount / b.amount) * 100);
                return (
                  <div key={b.id} className="card" style={{ boxShadow: 'none', background: 'rgba(0,0,0,0.02)' }}>
                    <div className="flex justify-between mb-sm">
                      <div style={{ fontWeight: 600 }}>{b.category_name}</div>
                      <button className="btn btn-outline" style={{ padding: '4px', border: 'none' }} onClick={() => handleDelete(b.id)}>
                        <Trash2 size={16} color="var(--danger)" />
                      </button>
                    </div>
                    <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${percentage}%`, 
                        background: percentage > 90 ? 'var(--danger)' : 'var(--primary)',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                    <div className="flex justify-between text-muted" style={{ fontSize: '0.8125rem' }}>
                      <span>${b.spent_amount.toLocaleString()} spent</span>
                      <span>Limit: ${b.amount.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budgets;
