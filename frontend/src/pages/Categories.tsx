import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, Edit2 } from 'lucide-react';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name, type });
      setName('');
      fetchCategories();
    } catch (err) {
      console.error('Error adding category', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category', err);
    }
  };

  return (
    <div>
      <h1>Categories</h1>
      <div className="grid mt-md" style={{ gridTemplateColumns: '1fr 2fr' }}>
        <div className="card">
          <h3 className="mb-sm">Add New</h3>
          <form onSubmit={handleAdd}>
            <div className="mb-sm">
              <label className="text-muted">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Groceries" />
            </div>
            <div className="mb-sm">
              <label className="text-muted">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
              Add Category
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="mb-sm">All Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {loading ? (
              <div>Loading...</div>
            ) : categories.length === 0 ? (
              <div className="text-muted">No categories found.</div>
            ) : (
              categories.map((c: any) => (
                <div key={c.id} className="flex justify-between" style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{c.name}</span>
                    <span className="text-muted" style={{ marginLeft: '8px', fontSize: '0.75rem', textTransform: 'uppercase' }}>{c.type}</span>
                  </div>
                  <div className="flex" style={{ gap: '8px' }}>
                    <button className="btn btn-outline" style={{ padding: '4px', border: 'none' }} onClick={() => handleDelete(c.id)}>
                      <Trash2 size={16} color="var(--danger)" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
