import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiClock, FiStar, FiArrowRight } from 'react-icons/fi';
import { providersApi } from '../services/api';
import ProviderCard from '../components/ProviderCard';
import LoadingSpinner from '../components/LoadingSpinner';

function Home() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    providersApi
      .getAll()
      .then((res) => setProviders(res.data.data?.providers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Appointments with Ease
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Find the best service providers and schedule your appointment instantly — no signup required.
          </p>
          <Link
            to="/providers"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3 rounded-full hover:bg-blue-50 transition-colors text-lg"
          >
            Browse Providers <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">Why Choose AppointMe?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: FiUsers, title: 'Top Providers', desc: 'Browse verified service providers across specialties', color: 'text-blue-600' },
              { icon: FiCalendar, title: 'Easy Booking', desc: 'Select a time slot and book in seconds', color: 'text-green-600' },
              { icon: FiClock, title: 'Flexible Scheduling', desc: 'Find available slots that fit your schedule', color: 'text-purple-600' },
              { icon: FiStar, title: 'Trusted Reviews', desc: 'Read reviews from verified customers', color: 'text-yellow-500' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="text-center p-6 rounded-xl bg-gray-50">
                <Icon className={`text-3xl mx-auto mb-3 ${color}`} />
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Providers</h2>
            <Link to="/providers" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
              View all <FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.slice(0, 3).map((p) => (
                <ProviderCard key={p.id} provider={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
