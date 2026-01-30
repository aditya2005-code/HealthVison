import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

export default function Header() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow p-4 flex justify-between items-center z-10">
            <h1 className="text-xl font-bold text-blue-600">HealthVision</h1>
            <div className="flex space-x-4">
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-red-600 hover:text-red-800 font-medium"
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600">Login</Link>
                        <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Signup</Link>
                    </>
                )}
            </div>
        </header>
    );
}
