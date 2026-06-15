import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ReceiptText, ListTree, PieChart, BarChart2, User, LogOut, Wallet } from 'lucide-react';

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
    { to: '/reports', icon: <BarChart2 size={20} />, label: 'Reports' },
    { to: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  return (
    <div className="app-layout bg-gradient" style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="sidebar glass" style={{ 
        width: '280px', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: 'var(--spacing-lg)',
        borderRight: '1px solid var(--glass-border)',
        zIndex: 10
      }}>
        <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            background: 'var(--primary)', 
            padding: '8px', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <Wallet size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Finance</h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
              style={{ 
                justifyContent: 'flex-start', 
                textDecoration: 'none',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)'
              }}
            >
              {({ isActive }) => (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  width: '100%',
                  position: 'relative'
                }}>
                  {isActive && <div style={{ 
                    position: 'absolute', 
                    left: '-24px', 
                    width: '4px', 
                    height: '24px', 
                    background: 'var(--primary)', 
                    borderRadius: '0 4px 4px 0' 
                  }} />}
                  <span style={{ 
                    color: isActive ? 'var(--primary)' : 'inherit',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {item.icon}
                  </span>
                  <span style={{ fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        <div style={{ 
          marginTop: 'auto', 
          paddingTop: '24px', 
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 8px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'var(--bg-secondary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: 700,
              color: 'var(--primary)',
              border: '1px solid var(--border)'
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          </div>
          
          <button className="btn btn-outline" onClick={handleLogout} style={{ 
            justifyContent: 'flex-start', 
            color: 'var(--danger)',
            gap: '12px',
            padding: '12px 16px',
            width: '100%',
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)'
          }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="main" style={{ flex: 1, padding: 'var(--spacing-xl)', background: 'var(--bg-primary)', position: 'relative' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
