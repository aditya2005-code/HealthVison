import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import UserProfile from '../components/Dashboard/UserProfile';

export default function Header() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const [showProfile, setShowProfile] = useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow p-4 flex justify-between items-center z-10 relative">
            <h1 className="text-xl font-bold text-blue-600">HealthVision</h1>
            <div className="flex space-x-4 items-center">
                {user ? (
                    <>
                        <div
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            onClick={() => setShowProfile(!showProfile)}
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                {user.name?.first ? user.name.first.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <span className="text-gray-700 font-medium">{user.name?.first || 'User'}</span>
                        </div>

                        {showProfile && (
                            <div className="absolute top-16 right-4 w-80 z-50">
                                <UserProfile user={user} />
                            </div>
                        )}

                        <button
                            onClick={handleLogout}
                            className="ml-2 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </>
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
