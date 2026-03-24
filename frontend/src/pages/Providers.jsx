import { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { providersApi } from '../services/api';
import ProviderCard from '../components/ProviderCard';
import LoadingSpinner from '../components/LoadingSpinner';

function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    providersApi
      .getAll()
      .then((res) => setProviders(res.data.data?.providers || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = providers.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.specialty?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Providers</h1>
        <p className="text-gray-600">Find and book appointments with our verified providers.</p>
      </div>

      <div className="relative mb-8 max-w-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No providers found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Providers;
