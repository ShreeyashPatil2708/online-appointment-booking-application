import { FiClock } from 'react-icons/fi';

function TimeSlotPicker({ slots, selectedSlot, onSelect }) {
  if (!slots || slots.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center py-4">
        No available time slots for this date.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => (
        <button
          key={slot.id}
          disabled={slot.isBooked || slot.isBlocked}
          onClick={() => onSelect(slot)}
          className={`flex items-center justify-center gap-1 p-2 rounded-lg text-sm font-medium border transition-colors
            ${
              selectedSlot?.id === slot.id
                ? 'bg-blue-600 text-white border-blue-600'
                : slot.isBooked || slot.isBlocked
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'
            }`}
        >
          <FiClock className="text-xs" />
          {slot.startTime}
        </button>
      ))}
    </div>
  );
}

export default TimeSlotPicker;
