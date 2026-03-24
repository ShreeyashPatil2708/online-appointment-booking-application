import { Link, NavLink } from 'react-router-dom';
import { FiCalendar, FiLogOut, FiLogIn, FiUser } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

function Navbar() {
  const { user, logout } = useApp();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-700 text-white' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-blue-700 text-lg">
            <FiCalendar className="text-xl" />
            AppointMe
          </Link>

          <div className="flex items-center gap-1">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/providers" className={linkClass}>Providers</NavLink>
            <NavLink to="/my-appointments" className={linkClass}>My Bookings</NavLink>
            <NavLink to="/reviews" className={linkClass}>Reviews</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={linkClass}>Admin</NavLink>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-gray-600 flex items-center gap-1">
                  <FiUser /> {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/providers"
                className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                <FiLogIn /> Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
