import React from 'react';
import { Activity, Calendar, FileText, MessageSquare, Search, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import StatCard from '../components/Dashboard/StatCard';

export default function Dashboard() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    // Placeholder data (in a real app, this would come from an API)
    const stats = [
        { title: 'Upcoming Appointments', value: '2', icon: Calendar, color: 'bg-blue-500' },
        { title: 'Medical Reports', value: '12', icon: FileText, color: 'bg-green-500' },
        { title: 'Active Prescriptions', value: '5', icon: Activity, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome back, {user?.name?.first || 'Guest'}!
                    </h1>
                    <p className="text-gray-500 mt-1">Here's your health overview for today.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-colors shadow-sm font-medium">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    New Appointment
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {stats.map((stat, index) => (
                            <StatCard key={index} {...stat} />
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div
                                onClick={() => navigate('/doctors')}
                                className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 cursor-pointer hover:shadow-md transition-all group"
                            >
                                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    <Search className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1">Find Doctors</h3>
                                <p className="text-sm text-gray-600">Search for specialists near you</p>
                            </div>

                            <div
                                onClick={() => navigate('/reports/upload')}
                                className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 cursor-pointer hover:shadow-md transition-all group"
                            >
                                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1">Upload Report</h3>
                                <p className="text-sm text-gray-600">Analyze reports with AI</p>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 cursor-pointer hover:shadow-md transition-all group">
                                <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-bold text-gray-800 mb-1">Symptom Chat</h3>
                                <p className="text-sm text-gray-600">Chat with AI assistant</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Recent Activity Placeholder */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                                <div>
                                    <p className="text-sm text-gray-800 font-medium">Appointment confirmed</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 mr-3"></div>
                                <div>
                                    <p className="text-sm text-gray-800 font-medium">Report analysis complete</p>
                                    <p className="text-xs text-gray-500">Yesterday</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
