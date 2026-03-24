import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiStar, FiMapPin, FiCalendar } from 'react-icons/fi';
import { providersApi } from '../services/api';
import TimeSlotPicker from '../components/TimeSlotPicker';
import BookingForm from '../components/BookingForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate } from '../utils/helpers';

function ProviderDetail() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    providersApi
      .getById(id)
      .then((res) => setProvider(res.data.data?.provider || res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !selectedDate) return;
    setSlotsLoading(true);
    providersApi
      .getSlots(id, selectedDate)
      .then((res) => setSlots(res.data.data?.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [id, selectedDate]);

  if (loading) return <LoadingSpinner />;
  if (!provider) return <p className="text-center py-20 text-gray-500">Provider not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Provider Info */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
            <p className="text-blue-600 font-medium">{provider.specialty}</p>
          </div>
          <span className="flex items-center gap-1 text-sm text-gray-600">
            <FiStar className="text-yellow-400" />
            {provider.averageRating?.toFixed(1) || 'New'} ({provider.totalReviews || 0})
          </span>
        </div>

        {provider.bio && <p className="text-gray-600 mb-4">{provider.bio}</p>}

        {provider.location && (
          <p className="flex items-center gap-1 text-sm text-gray-500 mb-4">
            <FiMapPin /> {provider.location}
          </p>
        )}

        {provider.services && provider.services.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Services Offered</h3>
            <div className="flex flex-wrap gap-2">
              {provider.services.map((svc, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">
                  {svc.name} — ${svc.price}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiCalendar /> Book an Appointment
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot(null);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Available Slots for {formatDate(selectedDate)}
          </h3>
          {slotsLoading ? (
            <LoadingSpinner size="sm" text="Loading slots..." />
          ) : (
            <TimeSlotPicker slots={slots} selectedSlot={selectedSlot} onSelect={setSelectedSlot} />
          )}
        </div>

        {selectedSlot && !showBooking && (
          <button
            onClick={() => setShowBooking(true)}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book Selected Slot ({selectedSlot.startTime})
          </button>
        )}

        {showBooking && (
          <BookingForm
            provider={provider}
            slot={selectedSlot}
            onSuccess={() => {
              setShowBooking(false);
              setSelectedSlot(null);
            }}
            onCancel={() => setShowBooking(false)}
          />
        )}
      </div>
    </div>
  );
}

export default ProviderDetail;
