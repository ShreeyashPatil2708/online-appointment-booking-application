import { useState } from 'react';
import { appointmentsApi } from '../services/api';
import toast from 'react-hot-toast';

function BookingForm({ provider, slot, onSuccess, onCancel }) {
  const [notes, setNotes] = useState('');
  const [serviceIndex, setServiceIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const services = provider?.services || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!slot) {
      toast.error('Please select a time slot');
      return;
    }
    setLoading(true);
    try {
      await appointmentsApi.book({
        providerId: provider.id,
        slotId: slot.id,
        serviceId: services[serviceIndex]?.id,
        notes,
      });
      toast.success('Appointment booked successfully!');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
        <select
          value={serviceIndex}
          onChange={(e) => setServiceIndex(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {services.map((svc, i) => (
            <option key={i} value={i}>
              {svc.name} — ${svc.price} ({svc.duration} min)
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Selected Slot</label>
        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          {slot ? `${slot.date} at ${slot.startTime}` : 'No slot selected'}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Any additional information..."
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading || !slot}
          className="flex-1 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default BookingForm;
