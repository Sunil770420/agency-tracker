import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeDetailsPage from './pages/admin/EmployeeDetailsPage';

import DigitalEmployeeDashboard from './pages/employee/DigitalEmployeeDashboard';
import DevelopmentEmployeeDashboard from './pages/employee/DevelopmentEmployeeDashboard';

import MetaAdsPage from './pages/shared/MetaAdsPage';
import GoogleAdsPage from './pages/shared/GoogleAdsPage';
import ProjectTrackerPage from './pages/shared/ProjectTrackerPage';
import ReportsPage from './pages/shared/ReportsPage';

import ProtectedRoute from './components/common/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/register"
          element={
            <ProtectedRoute roles={['admin']}>
              <Register />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/employees/:id"
          element={
            <ProtectedRoute roles={['admin']}>
              <EmployeeDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/digital"
          element={
            <ProtectedRoute roles={['employee', 'admin']}>
              <DigitalEmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee/development"
          element={
            <ProtectedRoute roles={['employee', 'admin']}>
              <DevelopmentEmployeeDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meta-ads"
          element={
            <ProtectedRoute roles={['admin', 'employee']}>
              <MetaAdsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/google-ads"
          element={
            <ProtectedRoute roles={['admin', 'employee']}>
              <GoogleAdsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute roles={['admin', 'employee']}>
              <ProjectTrackerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={['admin', 'employee']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;