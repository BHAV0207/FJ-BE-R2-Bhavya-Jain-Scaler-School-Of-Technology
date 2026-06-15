import { useEffect, useState } from 'react';
import api from '../api';
import { TrendingUp, TrendingDown, Landmark, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardData {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  savingRate: number;
  recentTransactions: any[];
  categorySpending: { category_name: string; total_amount: number }[];
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard/summary');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!data) return <div>Error loading data.</div>;

  const stats = [
    { label: 'Total Income', value: data.totalIncome, icon: <TrendingUp color="var(--success)" />, color: 'var(--success)' },
    { label: 'Total Expense', value: data.totalExpense, icon: <TrendingDown color="var(--danger)" />, color: 'var(--danger)' },
    { label: 'Net Savings', value: data.netSavings, icon: <Landmark color="var(--primary)" />, color: 'var(--primary)' },
    { label: 'Saving Rate', value: `${data.savingRate}%`, icon: <Wallet color="var(--text-muted)" />, color: 'var(--text-muted)' },
  ];

  return (
    <div>
      <h1 className="mb-sm">Financial Overview</h1>
      <p className="text-muted mb-sm">Track your spending and savings in real-time.</p>

      <div className="grid mt-md">
        {stats.map((stat, i) => (
          <div key={i} className="card">
            <div className="flex justify-between mb-sm">
              <span className="text-muted">{stat.label}</span>
              {stat.icon}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
              {typeof stat.value === 'number' ? `$${stat.value.toLocaleString()}` : stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid mt-md" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card">
          <h3 className="mb-sm">Spending by Category</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.categorySpending}>
                <XAxis dataKey="category_name" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Bar dataKey="total_amount" radius={[4, 4, 0, 0]}>
                  {data.categorySpending.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'var(--primary)' : 'var(--accent-secondary)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="mb-sm">Recent Transactions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {data.recentTransactions.slice(0, 5).map((t, i) => (
              <div key={i} className="flex justify-between" style={{ paddingBottom: '8px', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 500 }}>{t.description || t.category_name}</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>{new Date(t.date).toLocaleDateString()}</div>
                </div>
                <div style={{ fontWeight: 600, color: t.type === 'expense' ? 'var(--danger)' : 'var(--success)' }}>
                  {t.type === 'expense' ? '-' : '+'}${Math.abs(t.amount).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
