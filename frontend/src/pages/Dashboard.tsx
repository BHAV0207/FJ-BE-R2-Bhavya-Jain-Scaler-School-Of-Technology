import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Wallet, ArrowUpCircle, ArrowDownCircle, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { formatAmount, getCurrencySymbol } from '../utils/currency';

interface DashboardData {
  summary: {
    totalIncome: string;
    totalExpense: string;
    totalRefund: string;
    netSavings: string;
    savingRate: number;
  };
  budget: {
    monthlyBudget: string;
    budgetUsed: string;
    budgetRemaining: string;
    budgetPercentage: number;
    isOverBudget: boolean;
  };
  recentTransactions: any[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const currency = user?.preferredCurrency ?? 'USD';
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data.data))
      .catch(err => console.error('Dashboard fetch error', err))
      .finally(() => setLoading(false));
  }, [user?.preferredCurrency]);

  if (loading) return <div style={{ padding: '64px', textAlign: 'center' }}><div className="loading-spinner"></div></div>;

  const stats = [
    { label: 'Total Balance', value: formatAmount(data?.summary?.netSavings || '0', currency), icon: <Wallet size={18} />, color: 'var(--primary)', bg: 'rgba(79, 70, 229, 0.05)' },
    { label: 'Total Income', value: formatAmount(data?.summary?.totalIncome || '0', currency), icon: <ArrowUpCircle size={18} />, color: 'var(--accent)', bg: 'rgba(16, 185, 129, 0.05)' },
    { label: 'Total Expense', value: formatAmount(data?.summary?.totalExpense || '0', currency), icon: <ArrowDownCircle size={18} />, color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.05)' },
  ];

  const chartData = (data as any)?.weeklyTrend || [
    { name: 'W1', income: 0, expense: 0 },
    { name: 'W2', income: 0, expense: 0 },
    { name: 'W3', income: 0, expense: 0 },
    { name: 'W4', income: 0, expense: 0 },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Financial summary at a glance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ color: s.color, background: s.bg, padding: '6px', borderRadius: '6px', display: 'flex' }}>
                {s.icon}
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{s.label}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '24px' }}>Weekly Performance</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ border: 'none', borderRadius: '8px', boxShadow: 'var(--shadow-lg)', fontSize: '12px' }}
                    cursor={{ stroke: 'var(--primary)', strokeWidth: 1 }}
                    formatter={(value: number) => [`${getCurrencySymbol(currency)}${value.toLocaleString()}`, '']}
                  />
                  <Area type="monotone" dataKey="income" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.05} strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" stroke="var(--danger)" fill="var(--danger)" fillOpacity={0.05} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700 }}>Recent Transactions</h3>
              <Link to="/transactions" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>View All</Link>
            </div>
            <div style={{ padding: '0 24px' }}>
              {data?.recentTransactions.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No recent activity.</div>
              ) : (
                data?.recentTransactions.map((t, i) => (
                  <div key={t.id} style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '12px 0', borderBottom: i === (data?.recentTransactions.length ?? 0) - 1 ? 'none' : '1px solid var(--border)' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{t.description}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(t.transactionDate).toLocaleDateString()}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: t.transactionType === 'income' ? 'var(--accent)' : 'var(--text-primary)' }}>
                      {t.transactionType === 'income' ? '+' : '-'}{formatAmount(t.amount, t.currency || currency)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ padding: '24px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px' }}>Monthly Budget</h3>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
              {formatAmount(data?.budget?.budgetUsed || '0', currency)} <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-secondary)' }}>/ {formatAmount(data?.budget?.monthlyBudget || '0', currency)}</span>
            </div>
            <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden', marginBottom: '16px' }}>
              <div style={{ 
                height: '100%', 
                width: `${Math.min(100, (data?.budget?.budgetPercentage || 0))}%`, 
                background: 'var(--primary)', borderRadius: '2px' 
              }}></div>
            </div>
            <Link to="/budgets" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
              Details <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '16px', color: 'var(--text-secondary)' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link to="/transactions" className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '0.75rem' }}>Add Transaction</Link>
              <Link to="/categories" className="btn btn-outline" style={{ justifyContent: 'center', fontSize: '0.75rem' }}>New Category</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
