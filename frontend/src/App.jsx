import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="login" element={<div className="p-4">Login Page</div>} />
          <Route path="signup" element={<div className="p-4">Signup Page</div>} />
          <Route path="*" element={<div className="p-4">404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
