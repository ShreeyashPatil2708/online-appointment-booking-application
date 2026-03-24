import { useEffect, useState } from 'react';
import { appointmentsApi } from '../services/api';
import AppointmentTable from '../components/AppointmentTable';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    appointmentsApi
      .getMy()
      .then((res) => setAppointments(res.data.data?.appointments || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAction = async (action, id) => {
    try {
      if (action === 'cancel') {
        await appointmentsApi.cancel(id);
        toast.success('Appointment cancelled');
        fetchAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Appointments</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <AppointmentTable appointments={appointments} onAction={handleAction} />
        </div>
      )}
    </div>
  );
}

export default MyAppointments;
