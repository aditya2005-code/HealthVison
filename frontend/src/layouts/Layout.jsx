import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Header />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
}
