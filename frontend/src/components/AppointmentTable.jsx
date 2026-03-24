import { STATUS_COLORS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

function AppointmentTable({ appointments, onAction }) {
  if (!appointments || appointments.length === 0) {
    return <p className="text-center text-gray-500 py-8">No appointments found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Provider', 'Service', 'Date', 'Time', 'Status', 'Actions'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {appointments.map((apt) => (
            <tr key={apt.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">{apt.providerName || apt.providerId}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{apt.serviceName || '—'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatDate(apt.date)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{apt.startTime}</td>
              <td className="px-4 py-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[apt.status] || ''}`}
                >
                  {apt.status}
                </span>
              </td>
              <td className="px-4 py-3">
                {onAction && apt.status === 'pending' && (
                  <button
                    onClick={() => onAction('cancel', apt.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentTable;
