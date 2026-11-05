import { useEffect, useState } from 'react';
import api from '../services/api';
import StatCard from '../components/StatCard';

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableCopies: 0,
    totalMembers: 0,
    currentlyIssuedBooks: 0,
    overdueBooks: 0,
    returnedBooks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');
  const [connectionError, setConnectionError] = useState(false);

  const loadStats = async () => {
    try {
      const { data } = await api.get('/dashboard');
      setStats(data);
      setConnectionError(false);
    } catch (error) {
      console.error('Dashboard load failed:', error);
      setConnectionError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSeedData = async () => {
    try {
      setSeeding(true);
      setMessage('');
      const { data } = await api.post('/dashboard/seed');
      setMessage(data.message || 'Sample data inserted successfully!');
      setConnectionError(false);
      await loadStats();
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      const serverMsg = error.response?.data?.message;
      if (serverMsg) {
        alert('Server Error: ' + serverMsg);
      } else {
        alert('Cannot reach the backend server (http://localhost:5000).\n\nPlease make sure start-app.bat is running, or in a terminal run:\ncd server && npm run dev');
      }
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <div className="panel"><p>Loading dashboard...</p></div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Dashboard</h2>
        </div>
        <button
          className="primary-btn"
          onClick={handleSeedData}
          disabled={seeding}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          {seeding ? 'Inserting Data...' : '🌱 Insert Sample Data'}
        </button>
      </div>

      {connectionError && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #f87171',
            color: '#991b1b',
            padding: '14px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '14px',
            lineHeight: '1.6',
          }}
        >
          <strong>⚠️ Backend server is not running on port 5000.</strong>
          <br />
          The web frontend cannot reach the database. Please double-click <code>start-app.bat</code> in the project folder, or run <code>cd server &amp;&amp; npm run dev</code> in your terminal.
        </div>
      )}

      {message && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #6ee7b7',
            color: '#065f46',
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontWeight: '500',
          }}
        >
          ✅ {message}
        </div>
      )}

      <div className="stats-grid dashboard-grid">
        <StatCard title="Total Books" value={stats.totalBooks} color="#4f46e5" />
        <StatCard title="Available Copies" value={stats.availableCopies} color="#10b981" />
        <StatCard title="Registered Members" value={stats.totalMembers} color="#0ea5e9" />
        <StatCard title="Currently Issued" value={stats.currentlyIssuedBooks} color="#f59e0b" />
        <StatCard title="Overdue Books" value={stats.overdueBooks} color="#ef4444" />
      </div>

      <div className="panel info-panel">
        <h3>Library overview</h3>
        <p>
          This dashboard calculates values from the live library database, including total inventory,
          current stock availability, active members, and outstanding issue records.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
