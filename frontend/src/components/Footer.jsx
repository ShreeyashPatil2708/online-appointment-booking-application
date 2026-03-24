import { Link } from 'react-router-dom';
import { FiCalendar, FiGithub } from 'react-icons/fi';

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <FiCalendar />
            AppointMe
          </div>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/providers" className="hover:text-white transition-colors">Providers</Link>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-2 text-sm">
            <FiGithub />
            <a
              href="https://github.com/ShreeyashPatil2708/online-appointment-booking-application"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} AppointMe. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
