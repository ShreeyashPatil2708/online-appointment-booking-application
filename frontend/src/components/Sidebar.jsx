import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiCalendar, FiBarChart2 } from 'react-icons/fi';

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-56 bg-white border-r border-gray-200 min-h-full p-4 space-y-1">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
        Admin Panel
      </p>
      <NavLink to="/admin" end className={linkClass}>
        <FiGrid /> Dashboard
      </NavLink>
      <NavLink to="/admin/users" className={linkClass}>
        <FiUsers /> Users
      </NavLink>
      <NavLink to="/admin/appointments" className={linkClass}>
        <FiCalendar /> Appointments
      </NavLink>
      <NavLink to="/admin/stats" className={linkClass}>
        <FiBarChart2 /> Statistics
      </NavLink>
    </aside>
  );
}

export default Sidebar;
