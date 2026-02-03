import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './layouts/Layout';
import AuthLayout from './layouts/AuthLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import DoctorsList from './pages/Doctors/DoctorsList';
import DoctorDetail from './pages/Doctors/DoctorDetail';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="*" element={<div className="p-4">404 Not Found</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
// commented and pushed code just to create a new pull request and merge it with main
export default App;
