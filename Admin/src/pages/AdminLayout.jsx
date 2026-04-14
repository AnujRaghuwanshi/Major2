import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function AdminLayout() {
  const { session } = useAuth();
  const location = useLocation();
  const activeView = location.pathname.split('/').pop() || 'products';

  const stats = [
    { label: 'Total Products', value: '5', hint: 'Eco-friendly items' },
    { label: 'Active Users', value: '2', hint: 'Registered' },
    { label: 'Pickups', value: '5', hint: 'Scheduled' },
    { label: 'Orders', value: '2', hint: 'Placed' },
  ];

  return (
    <div className="dashboard-shell">
      <Sidebar activeView={activeView} />
      <main className="dashboard-content container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              hint={stat.hint}
            />
          ))}
        </div>
        <section className="panel">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
