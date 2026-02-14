import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle, X } from 'lucide-react';
import appointmentService from '../services/appointment.service';
import toast from 'react-hot-toast';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await appointmentService.getAppointments();
            // Backend returns { success: true, data: [...] } or just data depending on response structure
            setAppointments(response.data || response);
        } catch (err) {
            setError('Failed to load appointments');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

        try {
            // await appointmentService.cancelAppointment(id); // Backend endpoint might not be ready
            toast.success("Appointment cancellation requested");
            // Refresh list
            fetchAppointments();
        } catch (err) {
            toast.error("Failed to cancel appointment");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6 font-primary">My Appointments</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}

            {appointments.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-900">No appointments scheduled</h3>
                    <p className="text-gray-500">Book your first consultation with our doctors.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {appointments.map((apt) => (
                        <div key={apt._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                                    {apt.doctorId?.name?.charAt(0) || 'D'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{apt.doctorId?.name || 'Unknown Doctor'}</h3>
                                    <p className="text-blue-600 text-sm font-medium">{apt.doctorId?.specialization || 'General'}</p>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(apt.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {apt.time}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${apt.status === 'Scheduled' ? 'bg-green-100 text-green-700' :
                                        apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {apt.status}
                                </span>
                                {apt.status === 'Scheduled' && (
                                    <button
                                        onClick={() => handleCancel(apt._id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Cancel Appointment"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Appointments;
