import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10, search, type };
      const response = await api.get('/transactions', { params });
      setTransactions(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      console.error('Error fetching transactions', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, search, type]);

  return (
    <div>
      <div className="flex justify-between mb-sm">
        <h1>Transactions</h1>
        <button className="btn btn-primary">
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      <div className="card mb-sm flex" style={{ gap: '16px', padding: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-muted)' }} />
          <input 
            placeholder="Search transactions..." 
            style={{ paddingLeft: '36px' }} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select style={{ width: '150px' }} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
          <option value="refund">Refund</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--surface)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '12px 16px' }}>Date</th>
              <th style={{ padding: '12px 16px' }}>Description</th>
              <th style={{ padding: '12px 16px' }}>Category</th>
              <th style={{ padding: '12px 16px' }}>Amount</th>
              <th style={{ padding: '12px 16px' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center' }}>No transactions found.</td></tr>
            ) : (
              transactions.map((t: any) => (
                <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '12px 16px' }}>{new Date(t.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px 16px' }}>{t.description}</td>
                  <td style={{ padding: '12px 16px' }}><span className="text-muted">{t.category_name}</span></td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>${Math.abs(t.amount).toLocaleString()}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      padding: '2px 8px', 
                      borderRadius: '12px',
                      background: t.type === 'expense' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                      color: t.type === 'expense' ? 'var(--danger)' : 'var(--success)',
                      textTransform: 'capitalize'
                    }}>
                      {t.type}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <div className="flex justify-between" style={{ padding: '12px 16px', background: 'var(--surface)' }}>
          <div className="text-muted">Page {page} of {totalPages}</div>
          <div className="flex" style={{ gap: '8px' }}>
            <button 
              className="btn btn-outline" 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              style={{ padding: '4px 8px' }}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages}
              style={{ padding: '4px 8px' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
