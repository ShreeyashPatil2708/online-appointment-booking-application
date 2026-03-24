import { useEffect, useState } from 'react';
import { FiUsers, FiCalendar, FiUser, FiBarChart2 } from 'react-icons/fi';
import { adminApi } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getUsers()])
      .then(([statsRes, usersRes]) => {
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data?.users || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDeactivate = async (id) => {
    try {
      await adminApi.deactivateUser(id);
      toast.success('User deactivated');
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: false } : u)));
    } catch {
      toast.error('Action failed');
    }
  };

  const handleActivate = async (id) => {
    try {
      await adminApi.activateUser(id);
      toast.success('User activated');
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: true } : u)));
    } catch {
      toast.error('Action failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {['overview', 'users'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Users" value={stats.totalUsers} icon={FiUsers} color="blue" />
          <StatCard title="Total Providers" value={stats.totalProviders} icon={FiUser} color="purple" />
          <StatCard title="Total Appointments" value={stats.totalAppointments} icon={FiCalendar} color="green" />
          <StatCard title="Completed" value={stats.completedAppointments} icon={FiBarChart2} color="orange" />
        </div>
      )}

      {tab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {u.isActive ? (
                      <button
                        onClick={() => handleDeactivate(u.id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(u.id)}
                        className="text-xs text-green-600 hover:underline"
                      >
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
