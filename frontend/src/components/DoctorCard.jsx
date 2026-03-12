import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock } from 'lucide-react';

export default function DoctorCard({ doctor }) {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        {doctor.avatarUrl ? (
                            <img
                                src={doctor.avatarUrl}
                                alt={doctor.name}
                                className="w-16 h-16 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-2xl">
                                {doctor.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{doctor.name}</h3>
                            <p className="text-blue-600 font-medium text-sm">{doctor.specialization}</p>
                            {/* Optional: Show qualification if needed but might clutter card */}
                        </div>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700 text-xs font-bold">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        {doctor.rating}
                    </div>
                </div>

                <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{doctor.experience} years experience</span>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="line-clamp-1">{doctor.location || 'Kanpur, India'}</span>
                    </div>

                    <div className="flex items-center text-gray-500 text-sm">
                        <span className="font-semibold text-gray-900 mr-2">₹{doctor.fee}</span>
                        <span>Consultation Fee</span>
                    </div>
                </div>

                <Link
                    to={`/doctors/${doctor._id}`}
                    className="block w-full text-center py-2.5 px-4 bg-gray-50 hover:bg-blue-600 text-blue-600 hover:text-white font-medium rounded-lg transition-colors duration-300 border border-blue-200 hover:border-blue-600"
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
}
