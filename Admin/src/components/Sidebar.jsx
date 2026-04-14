import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const navItems = [
  { id: 'products', label: 'Products', path: 'products' },
  { id: 'users', label: 'Users', path: 'users' },
  { id: 'providers', label: 'Providers', path: 'providers' },
  { id: 'pickups', label: 'Pickups', path: 'pickups' },
  { id: 'orders', label: 'Orders', path: 'orders' },
];

export default function Sidebar({ activeView }) {
  const { logout, session } = useAuth();
  const navigate = useNavigate();
  const profile = session?.user || {};

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar">
      <div>
        <p className="eyebrow">Admin Dashboard</p>
        <h2>{profile.name || profile.email || 'Admin'}</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) => 
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>{profile.name || profile.email}</p>
        <span>{profile.email}</span>
        <button className="secondary-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </aside>
  );
}

