import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatAmount, getCurrencySymbol } from '../utils/currency';

interface ReportData {
  expenseByCategory: { categoryName: string; totalAmount: string }[];
  monthlyTrend: { month: string; income: number; expense: number }[];
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const Reports = () => {
  const { user } = useAuth();
  const currency = user?.preferredCurrency ?? 'USD';
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports')
      .then(res => setData(res.data.data))
      .catch(err => console.error('Reports fetch error', err))
      .finally(() => setLoading(false));
  }, [user?.preferredCurrency]);

  if (loading) return <div style={{ padding: '64px', textAlign: 'center' }}><div className="loading-spinner"></div></div>;

  const pieData = data?.expenseByCategory.map(item => ({
    name: item.categoryName,
    value: parseFloat(item.totalAmount)
  })) || [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>Financial Reports</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Detailed breakdown of your spending and income</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px', marginBottom: '24px' }}>
        <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '24px' }}>Expenses by Category</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: 'var(--shadow-lg)' }}
                  formatter={(value: number) => [formatAmount(value, currency), 'Total']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {pieData.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>
                <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                <span style={{ fontWeight: 600 }}>{formatAmount(item.value, currency)}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '24px' }}>Monthly Comparison</h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickFormatter={(v) => `${getCurrencySymbol(currency)}${v.toLocaleString()}`} />
                <Tooltip 
                  cursor={{ fill: 'var(--bg-secondary)' }}
                  contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: 'var(--shadow-lg)' }}
                  formatter={(value: number) => [formatAmount(value, currency), '']}
                />
                <Legend />
                <Bar dataKey="income" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" fill="var(--danger)" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', gap: '24px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--primary)' }}></div>
              <span style={{ color: 'var(--text-secondary)' }}>Income</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--danger)' }}></div>
              <span style={{ color: 'var(--text-secondary)' }}>Expenses</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
