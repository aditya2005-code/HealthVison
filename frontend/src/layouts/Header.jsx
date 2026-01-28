import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-white shadow p-4 flex justify-between items-center z-10">
            <h1 className="text-xl font-bold text-blue-600">HealthVision</h1>
            <div className="flex space-x-4">
                <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Signup</Link>
            </div>
        </header>
    );
}
