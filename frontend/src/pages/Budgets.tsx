import React, { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { formatAmount, getCurrencySymbol } from '../utils/currency';
import { Trash2, Pencil, X, Bell, AlertTriangle, Plus, Target, Calendar } from 'lucide-react';

interface Category { id: string; name: string; type: string; }
interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: string;
  budgetPeriod: string;
  spent: string;
  remaining: string;
  percentageUsed: number;
  isOverBudget: boolean;
  notificationSent: boolean;
}

const emptyForm = {
  categoryId: '',
  amount: '',
  budgetPeriod: new Date().toISOString().split('T')[0].slice(0, 7) + '-01',
};

const Budgets = () => {
  const { user } = useAuth();
  const currency = user?.preferredCurrency ?? 'USD';
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([
        api.get('/budgets/progress'),
        api.get('/categories'),
      ]);
      setBudgets(bRes.data.data || []);
      setCategories((cRes.data.data || []).filter((c: Category) => c.type === 'expense'));
    } catch (err) {
      console.error('Failed to fetch budgets', err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [user?.preferredCurrency]);

  const openCreate = () => { setEditId(null); setFormData(emptyForm); setFormError(''); setShowModal(true); };

  const openEdit = (b: Budget) => {
    setEditId(b.id);
    const date = b.budgetPeriod ? new Date(b.budgetPeriod) : new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    setFormData({
      categoryId: b.categoryId,
      amount: b.amount,
      budgetPeriod: `${year}-${month}-01`,
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const payload = { 
        ...formData, 
        amount: parseFloat(formData.amount),
        budgetPeriod: formData.budgetPeriod.split('-').slice(0, 2).join('-') + '-01'
      };
      
      if (editId) {
        await api.put(`/budgets/${editId}`, payload);
      } else {
        await api.post('/budgets', payload);
      }
      setShowModal(false);
      setFormData(emptyForm);
      setEditId(null);
      fetchData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save budget.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this budget?')) return;
    try {
      await api.delete(`/budgets/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Budgets</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Master your spending with precision</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate} style={{ padding: '12px 24px' }}>
          <Plus size={20} /> New Budget
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Target size={20} className="text-primary" /> Active Budgets
        </h2>
        
        {loading ? (
          <div style={{ padding: '64px', textAlign: 'center' }}><div className="loading-spinner"></div></div>
        ) : budgets.length === 0 ? (
          <div className="card glass" style={{ padding: '48px', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No budgets set yet. Start by creating your first spending limit!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {budgets.map(b => {
              const pct = b.percentageUsed;
              const over = b.isOverBudget;
              const statusColor = over ? 'var(--danger)' : (pct > 80 ? 'orange' : 'var(--accent)');
              
              return (
                <div key={b.id} className="card glass" style={{ 
                  padding: '24px', 
                  border: over ? '1px solid #fee2e2' : '1px solid var(--border)',
                  boxShadow: over ? '0 10px 15px -3px rgba(239, 68, 68, 0.1)' : 'var(--shadow-md)',
                  transition: 'transform 0.2s',
                  background: 'var(--surface)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{b.categoryName}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                        <Calendar size={12} />
                        {new Date(b.budgetPeriod).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        {b.notificationSent && <Bell size={12} color="var(--accent)" />}
                      </div>
                    </div>
                    <div className="flex" style={{ gap: '8px' }}>
                      <button onClick={() => openEdit(b)} style={{ border: 'none', background: 'var(--bg-secondary)', borderRadius: '8px', cursor: 'pointer', padding: '8px', display: 'flex' }} title="Edit">
                        <Pencil size={14} color="var(--text-secondary)" />
                      </button>
                      <button onClick={() => handleDelete(b.id)} style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', cursor: 'pointer', padding: '8px', display: 'flex' }} title="Delete">
                        <Trash2 size={14} color="var(--danger)" />
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
                      <span style={{ fontWeight: 600, color: statusColor }}>{Math.round(pct)}% Used</span>
                      <span style={{ color: 'var(--text-secondary)' }}>Limit: {formatAmount(b.amount, currency)}</span>
                    </div>
                    <div style={{ height: '10px', background: 'var(--bg-secondary)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${Math.min(100, pct)}%`, 
                        background: over ? 'var(--danger)' : `linear-gradient(90deg, var(--primary), ${statusColor})`,
                        boxShadow: `0 0 10px ${statusColor}40`,
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' 
                      }} />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-secondary)', borderRadius: '12px', fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>Spent</span>
                      <span style={{ fontWeight: 700 }}>{formatAmount(b.spent, currency)}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>Remaining</span>
                      <span style={{ fontWeight: 700, color: over ? 'var(--danger)' : 'var(--accent)' }}>
                        {over ? '-' : ''}{formatAmount(Math.abs(parseFloat(b.remaining)), currency)}
                      </span>
                    </div>
                  </div>

                  {over && (
                    <div style={{ 
                      marginTop: '16px', 
                      padding: '8px 12px', 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      color: 'var(--danger)',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      <AlertTriangle size={14} />
                      Budget exceeded by {formatAmount(Math.abs(parseFloat(b.remaining)), currency)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 }}>
          <div className="card glass" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
            <div className="flex justify-between" style={{ marginBottom: '24px' }}>
              <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{editId ? 'Edit Budget' : 'New Budget'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24} /></button>
            </div>
            {formError && <div className="error-alert" style={{ marginBottom: '20px' }}>{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Target Category</label>
                <div style={{ position: 'relative' }}>
                  <Target size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <select 
                    value={formData.categoryId} 
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })} 
                    required
                    style={{ paddingLeft: '44px' }}
                  >
                    <option value="">Select expense category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Monthly Limit ({getCurrencySymbol(currency)})</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600 }}>{getCurrencySymbol(currency)}</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    min="0.01" 
                    value={formData.amount} 
                    onChange={e => setFormData({ ...formData, amount: e.target.value })} 
                    required 
                    placeholder="0.00" 
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '32px' }}>
                <label>Budget Month</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    type="month" 
                    value={formData.budgetPeriod.slice(0, 7)} 
                    onChange={e => setFormData({ ...formData, budgetPeriod: e.target.value + '-01' })} 
                    required 
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', justifyContent: 'center' }}>
                {editId ? 'Update Budget' : 'Establish Budget'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budgets;
