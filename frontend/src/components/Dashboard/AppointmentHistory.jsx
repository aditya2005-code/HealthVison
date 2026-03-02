import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppointmentHistory = ({ appointments }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Confirmed': return <CheckCircle className="w-4 h-4 mr-1" />;
            case 'Pending': return <AlertCircle className="w-4 h-4 mr-1" />;
            case 'Cancelled': return <XCircle className="w-4 h-4 mr-1" />;
            case 'Completed': return <CheckCircle className="w-4 h-4 mr-1" />;
            default: return null;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-800">Upcoming Appointments</h3>
                <Link to="/appointments" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {appointments && appointments.length > 0 ? (
                            appointments.map((apt) => (
                                <tr key={apt._id || apt.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{apt.doctorName || 'Dr. Smith'}</div>
                                                <div className="text-sm text-gray-500">{apt.specialization || 'Cardiologist'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                                {apt.date || '2023-10-15'}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <Clock className="w-4 h-4 mr-1 text-gray-400" />
                                                {apt.time || '10:00 AM'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(apt.status)}`}>
                                            {getStatusIcon(apt.status)}
                                            {apt.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {(apt.status === 'Scheduled' || apt.status === 'Confirmed' || apt.status === 'Pending') ? (
                                            <>
                                                <button className="text-blue-600 hover:text-blue-900 mr-3">Reschedule</button>
                                                <button className="text-red-600 hover:text-red-900">Cancel</button>
                                            </>
                                        ) : (
                                            <span className="text-gray-400 italic">No actions available</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                    No appointments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AppointmentHistory;
