import React, { useEffect, useState } from 'react';
import { Activity, Calendar, FileText, MessageSquare, Search, PlusCircle, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import authService from '../services/auth.service';
import dashboardService from '../services/dashboard.service';
import appointmentService from '../services/appointment.service';
import StatCard from '../components/Dashboard/StatCard';
import AppointmentHistory from '../components/Dashboard/AppointmentHistory';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const [stats, setStats] = useState({
        appointments: { total: 0, pending: 0 },
        reports: 0,
        consultations: 0
    });
    const [appointments, setAppointments] = useState([]);
    const [appointmentData, setAppointmentData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, appointmentsRes] = await Promise.all([
                    dashboardService.getStats(),
                    appointmentService.getAppointments()
                ]);

                if (statsRes.success) {
                    setStats(statsRes.data);
                }

                if (appointmentsRes.success) {
                    const fetchedAppointments = appointmentsRes.data;
                    setAppointments(fetchedAppointments);
                    processChartData(fetchedAppointments);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const processChartData = (appointments) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const data = days.map(day => ({ name: day, appointments: 0 }));

        appointments.forEach(apt => {
            const date = new Date(apt.date);
            const dayIndex = date.getDay();
            data[dayIndex].appointments += 1;
        });

        // Reorder to start from Mon
        const monSunData = [...data.slice(1), data[0]];
        setAppointmentData(monSunData);
    };

    const statsCards = [
        {
            title: 'Total Appointments',
            value: stats.appointments.total.toString(),
            icon: Calendar,
            color: 'bg-blue-500',
            description: `${stats.appointments.pending} Pending`
        },
        {
            title: 'Medical Reports',
            value: stats.reports.toString(),
            icon: FileText,
            color: 'bg-green-500',
            description: 'Analyzed with AI'
        },
        {
            title: 'Completed Consultations',
            value: stats.consultations.toString(),
            icon: Activity,
            color: 'bg-purple-500',
            description: 'Successfully completed'
        },
    ];

    // Map appointments for display
    const formattedAppointments = appointments.map(apt => ({
        id: apt._id,
        doctorName: apt.doctorId?.name ? (typeof apt.doctorId.name === 'string' ? apt.doctorId.name : `${apt.doctorId.name.first} ${apt.doctorId.name.last}`) : 'Unknown Doctor',
        specialization: apt.doctorId?.specialization || 'General',
        date: new Date(apt.date).toLocaleDateString(),
        time: apt.time,
        status: apt.status
    })).slice(0, 5); // Show only recent 5

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Welcome back, {user?.name?.first || 'Guest'}!
                    </h1>
                    <p className="text-gray-500 mt-1">Here's your health overview for today.</p>
                </div>
                <button
                    onClick={() => navigate('/appointments/book')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-colors shadow-sm font-medium"
                >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    New Appointment
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {statsCards.map((stat, index) => (
                                <StatCard key={index} {...stat} />
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6 flex items-center">
                                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                                    Appointment Trends
                                </h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={appointmentData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                cursor={{ fill: '#F3F4F6' }}
                                            />
                                            <Bar dataKey="appointments" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6 flex items-center">
                                    <Activity className="w-5 h-5 mr-2 text-green-600" />
                                    Health Activity
                                </h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={appointmentData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                            <YAxis axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                            <Line type="monotone" dataKey="appointments" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Recent Appointments */}
                        <AppointmentHistory appointments={formattedAppointments} />

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

                                <div
                                    onClick={() => navigate('/chat')}
                                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 cursor-pointer hover:shadow-md transition-all group"
                                >
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
                        {/* Appointment History Placeholder - could be a separate component */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {stats.appointments.total > 0 ? (
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 mr-3"></div>
                                        <div>
                                            <p className="text-sm text-gray-800 font-medium">You have {stats.appointments.total} appointments</p>
                                            <p className="text-xs text-gray-500">Check appointment history</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No recent activity</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
