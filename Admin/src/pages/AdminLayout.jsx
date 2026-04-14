import { Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api.js';
import Sidebar from '../components/Sidebar.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../AuthContext.jsx';

export default function AdminLayout() {
  const { session } = useAuth();
  const location = useLocation();
  const activeView = location.pathname.split('/').pop() || 'products';

  const [statsList, setStatsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session?.token) {
      setLoading(false);
      return;
    }

    async function loadStats() {
      try {
        setLoading(true);
        setError('');
        const [products, userscount, pickupscount, orders, centers] = await Promise.all([
          api.fetchProducts(session.token),
          api.fetchUsers(session.token),
          api.fetchPickups(session.token),
          api.fetchOrders(session.token),
          api.fetchCenters(session.token)
        ]);

        setStatsList([
          { label: 'Total Products', value: products?.length ?? 0, hint: 'Eco-friendly items' },
          { label: 'Active Users', value: userscount.users?.length ?? 0, hint: 'Registered' },
          { label: 'Pickups', value: pickupscount.pickups?.length ?? 0, hint: 'Scheduled' },
          { label: 'Orders', value: orders?.length ?? 0, hint: 'Placed' },
          { label: 'Recycling Centers', value: centers?.length ?? 0, hint: 'Total centers' }
        ]);
      } catch (err) {
        setError(err.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [session?.token]);



  return (
    <div className="dashboard-shell">
      <Sidebar activeView={activeView} />
      <main className="dashboard-content container">
        <div className="stats-grid">
          {loading ? (
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="stat-card skeleton">
                <div style={{fontSize: '2rem', background: '#e0e0e0', height: '2.5rem', width: '3rem', borderRadius: '8px', animation: 'pulse 1.5s ease-in-out infinite'}}></div>
                <div style={{fontSize: '0.875rem', opacity: 0.6, background: '#f0f0f0', height: '1rem', width: '100%', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite 0.2s'}}></div>
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8 text-red-500">
              {error}
            </div>
          ) : (
            statsList.map((stat, index) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                hint={stat.hint}
              />
            ))
          )}
        </div>
        <section className="panel">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
