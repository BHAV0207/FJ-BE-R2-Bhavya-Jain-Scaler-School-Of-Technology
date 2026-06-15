import React, { useState, useEffect } from 'react';
import api from '../api';
import { Trash2, Plus, Info, Tag, Layers, TrendingUp, TrendingDown } from 'lucide-react';

interface Category { id: string; name: string; type: string; isSystem: boolean; }

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [error, setError] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/categories', { name, type });
      setName('');
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add category.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? This may affect existing transactions.')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Cannot delete this category.');
    }
  };

  const incomeCategories = categories.filter(c => c.type === 'income');
  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div style={{ height: '100%' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Categories</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Organize your wealth with custom categories</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '32px' }}>
        {/* Add Form */}
        <div style={{ position: 'sticky', top: '0' }}>
          <div className="card glass" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px', color: 'white' }}>
                <Plus size={20} />
              </div>
              <h3 style={{ fontWeight: 700 }}>Add Category</h3>
            </div>
            {error && <div className="error-alert" style={{ marginBottom: '20px' }}>{error}</div>}
            <form onSubmit={handleAdd}>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label>Category Name</label>
                <div style={{ position: 'relative' }}>
                  <Tag size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    placeholder="e.g. Health & Fitness" 
                    style={{ paddingLeft: '44px' }}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Type</label>
                <div style={{ position: 'relative' }}>
                  <Layers size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <select 
                    value={type} 
                    onChange={e => setType(e.target.value)}
                    style={{ paddingLeft: '44px' }}
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', justifyContent: 'center' }}>
                <span>Create Category</span>
              </button>
            </form>
          </div>
        </div>

        {/* Category Lists */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '8px', borderRadius: '10px', color: 'var(--danger)' }}>
                  <TrendingDown size={20} />
                </div>
                <h3 style={{ fontWeight: 700 }}>Expense Categories</h3>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px' }}>
                {expenseCategories.length} items
              </span>
            </div>

            {loading ? <div style={{ padding: '32px', textAlign: 'center' }}><div className="loading-spinner"></div></div> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {expenseCategories.map(c => (
                  <div key={c.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px 16px', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '12px',
                    transition: 'all 0.2s'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                      {c.isSystem && (
                        <div title="System defined" style={{ color: 'var(--text-secondary)' }}><Info size={14} /></div>
                      )}
                    </div>
                    {!c.isSystem && (
                      <button onClick={() => handleDelete(c.id)} style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '6px', cursor: 'pointer', padding: '6px', display: 'flex' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card glass" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '10px', color: 'var(--accent)' }}>
                  <TrendingUp size={20} />
                </div>
                <h3 style={{ fontWeight: 700 }}>Income Categories</h3>
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '20px' }}>
                {incomeCategories.length} items
              </span>
            </div>

            {loading ? <div style={{ padding: '32px', textAlign: 'center' }}><div className="loading-spinner"></div></div> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {incomeCategories.map(c => (
                  <div key={c.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px 16px', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                      {c.isSystem && (
                        <div title="System defined" style={{ color: 'var(--text-secondary)' }}><Info size={14} /></div>
                      )}
                    </div>
                    {!c.isSystem && (
                      <button onClick={() => handleDelete(c.id)} style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '6px', cursor: 'pointer', padding: '6px', display: 'flex' }}>
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
