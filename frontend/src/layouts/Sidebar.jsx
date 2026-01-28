import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <aside className="w-64 bg-gray-50 h-[calc(100vh-64px)] p-4 border-r hidden md:block">
            <nav className="flex flex-col space-y-2">
                <Link to="/" className="p-2 hover:bg-gray-200 rounded font-medium text-gray-700">Dashboard</Link>
                <Link to="/appointments" className="p-2 hover:bg-gray-200 rounded font-medium text-gray-700">Appointments</Link>
                <Link to="/reports" className="p-2 hover:bg-gray-200 rounded font-medium text-gray-700">Reports</Link>
                <Link to="/chat" className="p-2 hover:bg-gray-200 rounded font-medium text-gray-700">Symptom Chat</Link>
            </nav>
        </aside>
    );
}
