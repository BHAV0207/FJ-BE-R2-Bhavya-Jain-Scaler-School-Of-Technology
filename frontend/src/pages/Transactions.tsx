import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Search, ChevronLeft, ChevronRight, X, Pencil, Trash2, Paperclip, Upload, Eye, Trash, Filter, Download } from 'lucide-react';
import { CURRENCY_SYMBOLS, getCurrencySymbol } from '../utils/currency';

interface Transaction {
  id: string;
  amount: string;
  transactionType: 'income' | 'expense' | 'refund';
  currency: string;
  description: string;
  transactionDate: string;
  categoryId: string;
  categoryName: string;
}

interface Category {
  id: string;
  name: string;
  type: string;
}

interface Receipt {
  id: string;
  transactionId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
}

const emptyForm = {
  amount: '',
  categoryId: '',
  transactionType: 'expense' as 'expense' | 'income' | 'refund',
  currency: 'USD',
  description: '',
  transactionDate: new Date().toISOString().split('T')[0],
};


const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  // Receipt state
  const [receiptModal, setReceiptModal] = useState<{ open: boolean; transactionId: string | null }>({ open: false, transactionId: null });
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [receiptLoading, setReceiptLoading] = useState(false);
  const [receiptError, setReceiptError] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 10 };
      if (typeFilter) params.transactionType = typeFilter;
      const res = await api.get('/transactions', { params });
      const d = res.data.data;
      setTransactions(d.transactions || d.data || []);
      setTotalPages(d.totalPages ?? 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); fetchCategories(); }, [page, typeFilter]);

  const openAdd = () => { setEditId(null); setFormData(emptyForm); setFormError(''); setShowModal(true); };
  const openEdit = (t: Transaction) => {
    setEditId(t.id);
    setFormData({
      amount: t.amount,
      categoryId: t.categoryId,
      transactionType: t.transactionType,
      currency: t.currency,
      description: t.description,
      transactionDate: t.transactionDate?.split('T')[0] ?? '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    try {
      const payload = { ...formData, amount: parseFloat(formData.amount) };
      if (editId) {
        await api.put(`/transactions/${editId}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      setShowModal(false);
      setFormData(emptyForm);
      setEditId(null);
      fetchTransactions();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save transaction.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return;
    await api.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  // Receipt handlers
  const openReceiptModal = async (transactionId: string) => {
    setReceiptModal({ open: true, transactionId });
    setReceipt(null);
    setReceiptError('');
    setUploadFile(null);
    setReceiptLoading(true);
    try {
      const res = await api.get(`/receipts/${transactionId}`);
      setReceipt(res.data.data);
    } catch {
      setReceipt(null);
    } finally {
      setReceiptLoading(false);
    }
  };

  const handleReceiptUpload = async () => {
    if (!uploadFile || !receiptModal.transactionId) return;
    setUploading(true);
    setReceiptError('');
    try {
      const form = new FormData();
      form.append('receipt', uploadFile);
      form.append('transactionId', receiptModal.transactionId);
      const res = await api.post('/receipts', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setReceipt(res.data.data);
      setUploadFile(null);
    } catch (err: any) {
      setReceiptError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleReceiptDelete = async () => {
    if (!receipt) return;
    if (!confirm('Delete this receipt?')) return;
    try {
      await api.delete(`/receipts/${receipt.id}`);
      setReceipt(null);
    } catch (err: any) {
      setReceiptError(err.response?.data?.message || 'Delete failed.');
    }
  };

  const typeStyles: Record<string, { color: string, bg: string }> = { 
    expense: { color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' }, 
    income: { color: 'var(--accent)', bg: 'rgba(16, 185, 129, 0.1)' }, 
    refund: { color: 'var(--primary)', bg: 'rgba(99, 102, 241, 0.1)' } 
  };

  return (
    <div style={{ height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Transactions</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track every cent of your wealth</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} style={{ padding: '12px 24px' }}>
          <Plus size={20} /> Add Transaction
        </button>
      </div>

      <div className="card glass" style={{ padding: '0', overflow: 'hidden', marginBottom: '24px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              placeholder="Search transactions..." 
              style={{ 
                paddingLeft: '44px', 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border)',
                borderRadius: '12px'
              }} 
              readOnly 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <Filter size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <select 
              value={typeFilter} 
              onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
              style={{ paddingLeft: '44px', width: '180px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '12px' }}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="refund">Refund</option>
            </select>
          </div>
          <button className="btn btn-outline" style={{ borderRadius: '12px', padding: '10px' }} title="Export CSV">
            <Download size={18} />
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                {['Date', 'Description', 'Category', 'Type', 'Amount', 'Receipt', ''].map(h => (
                  <th key={h} style={{ padding: '16px 24px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--glass-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: '64px', textAlign: 'center' }}><div className="loading-spinner"></div></td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: '64px', textAlign: 'center', color: 'var(--text-secondary)' }}>No transactions found.</td></tr>
              ) : (
                transactions.map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--glass-border)', transition: 'background 0.2s', cursor: 'default' }}>
                    <td style={{ padding: '16px 24px', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{new Date(t.transactionDate).toLocaleDateString()}</td>
                    <td style={{ padding: '16px 24px', fontWeight: 500 }}>{t.description || '—'}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{t.categoryName || 'Uncategorized'}</span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        padding: '4px 10px', 
                        borderRadius: '8px', 
                        background: typeStyles[t.transactionType]?.bg, 
                        color: typeStyles[t.transactionType]?.color, 
                        textTransform: 'capitalize',
                        fontWeight: 600
                      }}>
                        {t.transactionType}
                      </span>
                    </td>
                    <td style={{ padding: '16px 24px', fontWeight: 700, color: typeStyles[t.transactionType]?.color, fontSize: '1rem' }}>
                      {t.transactionType === 'expense' ? '-' : '+'}{getCurrencySymbol(t.currency)}{Math.abs(parseFloat(t.amount)).toLocaleString()}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <button 
                        title="Manage receipt" 
                        onClick={() => openReceiptModal(t.id)} 
                        style={{ border: 'none', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', cursor: 'pointer', padding: '8px', display: 'flex' }}
                      >
                        <Paperclip size={16} color="var(--text-secondary)" />
                      </button>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <div className="flex" style={{ gap: '8px' }}>
                        <button onClick={() => openEdit(t)} style={{ border: 'none', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', cursor: 'pointer', padding: '8px', display: 'flex' }} title="Edit">
                          <Pencil size={16} color="var(--primary)" />
                        </button>
                        <button onClick={() => handleDelete(t.id)} style={{ border: 'none', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', cursor: 'pointer', padding: '8px', display: 'flex' }} title="Delete">
                          <Trash2 size={16} color="var(--danger)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.01)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Showing page <span style={{ color: 'var(--text-primary)' }}>{page}</span> of <span style={{ color: 'var(--text-primary)' }}>{totalPages}</span>
          </span>
          <div className="flex" style={{ gap: '8px' }}>
            <button className="btn btn-outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '8px', borderRadius: '10px' }}><ChevronLeft size={18} /></button>
            <button className="btn btn-outline" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '8px', borderRadius: '10px' }}><ChevronRight size={18} /></button>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 }}>
          <div className="card glass" style={{ width: '100%', maxWidth: '480px', padding: '32px' }}>
            <div className="flex justify-between" style={{ marginBottom: '24px' }}>
              <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{editId ? 'Edit Transaction' : 'New Transaction'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24} /></button>
            </div>
            {formError && <div className="error-alert" style={{ marginBottom: '20px' }}>{formError}</div>}
            <form onSubmit={handleSubmit}>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label>Type</label>
                  <select value={formData.transactionType} onChange={e => setFormData({ ...formData, transactionType: e.target.value as any })}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                    <option value="refund">Refund</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} required>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label>Amount</label>
                  <input type="number" step="0.01" min="0.01" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} required placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select value={formData.currency} onChange={e => setFormData({ ...formData, currency: e.target.value })}>
                    {Object.keys(CURRENCY_SYMBOLS).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Description</label>
                <input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="What was this for?" />
              </div>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Transaction Date</label>
                <input type="date" value={formData.transactionDate} onChange={e => setFormData({ ...formData, transactionDate: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', justifyContent: 'center' }}>
                {editId ? 'Update Transaction' : 'Save Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}

      {receiptModal.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 }}>
          <div className="card glass" style={{ width: '100%', maxWidth: '440px', padding: '32px' }}>
            <div className="flex justify-between" style={{ marginBottom: '24px' }}>
              <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manage Receipt</h2>
              <button onClick={() => setReceiptModal({ open: false, transactionId: null })} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24} /></button>
            </div>
            {receiptError && <div className="error-alert" style={{ marginBottom: '20px' }}>{receiptError}</div>}

            {receiptLoading ? (
              <div style={{ textAlign: 'center', padding: '32px' }}><div className="loading-spinner"></div></div>
            ) : receipt ? (
              <div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', marginBottom: '24px', border: '1px solid var(--glass-border)' }}>
                  <div style={{ fontWeight: 700, marginBottom: '6px', color: 'var(--text-primary)' }}>{receipt.fileName}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {(receipt.fileSize / 1024).toFixed(1)} KB · Uploaded {new Date(receipt.uploadedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <a href={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${receipt.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ justifyContent: 'center', textDecoration: 'none', height: '44px' }}>
                    <Eye size={18} /> View
                  </a>
                  <button className="btn btn-outline" onClick={handleReceiptDelete} style={{ justifyContent: 'center', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)', height: '44px' }}>
                    <Trash size={18} /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '2px dashed var(--glass-border)', marginBottom: '24px' }}>
                  <Upload size={32} style={{ color: 'var(--text-secondary)', marginBottom: '12px' }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No receipt attached. You can upload an image or PDF.</p>
                </div>
                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label>Select File</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={e => setUploadFile(e.target.files?.[0] ?? null)}
                    className="glass"
                    style={{ padding: '10px' }}
                  />
                </div>
                <button className="btn btn-primary" onClick={handleReceiptUpload} disabled={!uploadFile || uploading} style={{ width: '100%', height: '48px', justifyContent: 'center' }}>
                  {uploading ? <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div> : (
                    <>
                      <Upload size={18} />
                      <span>Upload Receipt</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
