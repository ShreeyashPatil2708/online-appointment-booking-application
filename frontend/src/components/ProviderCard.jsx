import { Link } from 'react-router-dom';
import { FiStar, FiMapPin } from 'react-icons/fi';

function ProviderCard({ provider }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{provider.name}</h3>
          <p className="text-blue-600 text-sm font-medium">{provider.specialty}</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            provider.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {provider.isActive ? 'Available' : 'Unavailable'}
        </span>
      </div>

      {provider.bio && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{provider.bio}</p>
      )}

      <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
        {provider.location && (
          <span className="flex items-center gap-1">
            <FiMapPin className="text-xs" />
            {provider.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <FiStar className="text-yellow-400" />
          {provider.averageRating?.toFixed(1) || 'New'} ({provider.totalReviews || 0} reviews)
        </span>
      </div>

      <div className="flex gap-2 flex-wrap mb-4">
        {provider.services?.slice(0, 3).map((svc, i) => (
          <span key={i} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
            {svc.name}
          </span>
        ))}
        {provider.services?.length > 3 && (
          <span className="text-xs text-gray-400">+{provider.services.length - 3} more</span>
        )}
      </div>

      <Link
        to={`/providers/${provider.id}`}
        className="block w-full text-center py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
      >
        Book Appointment
      </Link>
    </div>
  );
}

export default ProviderCard;
