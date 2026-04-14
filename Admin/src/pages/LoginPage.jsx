import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, session, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (session) {
      navigate('/admin/products', { replace: true });
    }
  }, [navigate, session]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/admin/products', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please try again.');
    }
  };

  return (
    <main className="login-screen">
      <section className="auth-card">
        <div className="auth-copy">
          <h1>Welcome to Admin Portal</h1>
          <p>Manage sustainability ecosystem: products, users, providers, pickups & orders. Building greener future together.</p>
          <div className="auth-note">
            <strong>Sustainability Connect Admin</strong><br/>
            Secure access to eco-management dashboard
          </div>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Sign In</h2>
          <div className="field">
            <span>Email</span>
            <input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              type="email" 
              placeholder="admin@example.com"
              required 
            />
          </div>
          <div className="field">
            <span>Password</span>
            <input 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              placeholder="••••••••"
              required 
            />
          </div>
          {error && <p className="form-message error">{error}</p>}
          <button type="submit" className="primary-button button-block" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </section>
    </main>
  );
}
