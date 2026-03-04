import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Configurator from './pages/Configurator';
import AdminHome from './pages/admin/AdminHome';
import AdminCategories from './pages/admin/AdminCategories';
import AdminPartners from './pages/admin/AdminPartners';
import AdminComponents from './pages/admin/AdminComponents';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/configurator"
          element={
            <PrivateRoute>
              <Configurator />
            </PrivateRoute>
          }
        />
        <Route
          path="/configurator/:id"
          element={
            <PrivateRoute>
              <Configurator />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminHome />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminCategories />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/partners"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminPartners />
              </AdminRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/components"
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminComponents />
              </AdminRoute>
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
