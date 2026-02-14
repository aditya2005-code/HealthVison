import React, { useState, useEffect } from 'react';
import doctorService from '../../services/doctor.service';
import { User, Star, MapPin, Clock } from 'lucide-react';

const DoctorSelection = ({ onSelect, selectedDoctorId }) => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const data = await doctorService.getAllDoctors();
            setDoctors(data.data || []); // Adjust based on API response structure
        } catch (err) {
            setError('Failed to load doctors. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-600 bg-red-50 rounded-xl border border-red-200">
                <p>{error}</p>
                <button
                    onClick={fetchDoctors}
                    className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (doctors.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                <p>No doctors available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doctor) => (
                <div
                    key={doctor._id}
                    onClick={() => onSelect(doctor)}
                    className={`cursor-pointer border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${selectedDoctorId === doctor._id
                            ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600 ring-offset-2'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                >
                    <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                            {doctor.image ? (
                                <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                                    <User className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-900">{doctor.name}</h3>
                            <p className="text-sm text-blue-600 font-medium mb-1">{doctor.specialization}</p>

                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <span>{doctor.rating} ({doctor.reviews} reviews)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{doctor.experience} yrs exp</span>
                                </div>
                            </div>

                            <div className="mt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-900">₹{doctor.fees || 500}</span>
                                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DoctorSelection;
