import React from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle } from 'lucide-react';

const BookingConfirmation = ({ doctor, date, time, onConfirm, loading }) => {
    if (!doctor || !date || !time) return null;

    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white text-center">
                <h2 className="text-2xl font-bold mb-2">Confirm Booking</h2>
                <p className="opacity-90">Please review your appointment details</p>
            </div>

            <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                    {/* Doctor Info */}
                    <div className="flex-1 w-full bg-blue-50/50 p-6 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                                {doctor.image ? (
                                    <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                                        <User className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">{doctor.name}</h3>
                                <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{doctor.clinicAddress || 'Virtual Consultation'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>{doctor.experience} years experience</span>
                            </div>
                        </div>
                    </div>

                    {/* Slot Info */}
                    <div className="flex-1 w-full space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Date</p>
                                <p className="font-bold text-gray-900">{formattedDate}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Time</p>
                                <p className="font-bold text-gray-900">{time}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Consultation Fee</p>
                                <p className="font-bold text-gray-900">₹{doctor.fees || 500}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                                Confirming...
                            </>
                        ) : (
                            'Confirm Appointment'
                        )}
                    </button>
                    <p className="text-center text-xs text-gray-400">
                        By confirming, you agree to the terms of service and cancellation policy.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
