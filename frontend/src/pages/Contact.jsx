import { FiMail, FiGithub, FiCalendar } from 'react-icons/fi';

function Contact() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <FiCalendar className="text-5xl text-blue-600 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-8">
        Have questions or need help? We're here for you.
      </p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-left space-y-4">
        <div className="flex items-center gap-3 text-gray-700">
          <FiMail className="text-blue-600 text-xl flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Email Support</p>
            <a href="mailto:support@appointme.com" className="text-sm text-blue-600 hover:underline">
              support@appointme.com
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <FiGithub className="text-blue-600 text-xl flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">GitHub Repository</p>
            <a
              href="https://github.com/ShreeyashPatil2708/online-appointment-booking-application"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline break-all"
            >
              github.com/ShreeyashPatil2708/online-appointment-booking-application
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
