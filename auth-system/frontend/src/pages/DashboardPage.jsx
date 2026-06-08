import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  return (
    <div className="dashboard-page">
      <nav className="dash-nav">
        <div className="dash-brand">⬡ AuthSystem</div>
        <button onClick={handleLogout} className="btn-logout">
          Sign Out
        </button>
      </nav>

      <main className="dash-main">
        <div className="dash-welcome">
          <div className="avatar">{initials}</div>
          <div>
            <h1>Welcome, {user?.name}!</h1>
            <p>You're securely logged in.</p>
          </div>
        </div>

        <div className="dash-grid">
          <div className="dash-card">
            <div className="dash-card-icon">👤</div>
            <div className="dash-card-label">Full Name</div>
            <div className="dash-card-value">{user?.name}</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-icon">📧</div>
            <div className="dash-card-label">Email Address</div>
            <div className="dash-card-value">{user?.email}</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-icon">📅</div>
            <div className="dash-card-label">Member Since</div>
            <div className="dash-card-value">{joinDate}</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-icon">🔐</div>
            <div className="dash-card-label">Auth Status</div>
            <div className="dash-card-value status-active">Active Session</div>
          </div>
        </div>

        <div className="dash-token-info">
          <h3>🛡️ How Your Session Works</h3>
          <p>
            You're authenticated via a <strong>JWT token</strong> stored securely in localStorage.
            It expires in <strong>24 hours</strong>. Every API request automatically
            sends this token in the <code>Authorization: Bearer &lt;token&gt;</code> header.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
