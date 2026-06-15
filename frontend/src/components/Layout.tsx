import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ReceiptText, ListTree, PieChart, LogOut } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/transactions', icon: <ReceiptText size={20} />, label: 'Transactions' },
    { to: '/categories', icon: <ListTree size={20} />, label: 'Categories' },
    { to: '/budgets', icon: <PieChart size={20} />, label: 'Budgets' },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--primary)' }}>Finance Tracker</h2>
          <div className="text-muted" style={{ marginTop: '4px' }}>{user?.name}</div>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
              style={{ justifyContent: 'flex-start', textDecoration: 'none' }}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button className="btn btn-outline" onClick={handleLogout} style={{ border: 'none', justifyContent: 'flex-start', color: 'var(--danger)' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
