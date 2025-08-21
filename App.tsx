import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MessagesPage from './pages/MessagesPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import ClassesPage from './pages/ClassesPage';
import ReportsPage from './pages/ReportsPage';
import BillingPage from './pages/BillingPage';
import ProfilePage from './pages/ProfilePage';
import SupportPage from './pages/SupportPage';
import EditReportPage from './pages/EditReportPage';
import TimetablePage from './pages/TimetablePage'; // Import the new page
import { UserRole } from './types';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import SupportManagementPage from './pages/admin/SupportManagementPage';

const ProtectedRoute: React.FC<{ roles?: UserRole[] }> = ({ roles }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    // If a user with a specific role tries to access a page not for them, redirect.
    // Admins are redirected to their dashboard, others to the general one.
    const homePath = user?.role === UserRole.ADMIN ? '/admin/dashboard' : '/';
    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to={homePath} replace />; 
    }

    return (
        <Layout>
            <Outlet />
        </Layout>
    );
};


const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                
                {/* Routes for Parents and Teachers */}
                <Route element={<ProtectedRoute roles={[UserRole.PARENT, UserRole.TEACHER]} />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/announcements" element={<AnnouncementsPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/timetable" element={<TimetablePage />} />
                </Route>
                
                {/* Profile is accessible to all logged-in users */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>

                {/* Teacher-specific routes */}
                <Route element={<ProtectedRoute roles={[UserRole.TEACHER]} />}>
                    <Route path="/classes" element={<ClassesPage />} />
                    <Route path="/class/:classId/student/:studentId/report" element={<EditReportPage />} />
                </Route>

                {/* Parent-specific routes */}
                <Route element={<ProtectedRoute roles={[UserRole.PARENT]} />}>
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/billing" element={<BillingPage />} />
                </Route>

                {/* Admin-specific routes */}
                <Route element={<ProtectedRoute roles={[UserRole.ADMIN]} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/users" element={<UserManagementPage />} />
                    <Route path="/admin/support" element={<SupportManagementPage />} />
                     {/* Admins also need access to announcements to create them */}
                    <Route path="/announcements" element={<AnnouncementsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

const App: React.FC = () => {
  return (
    <AuthProvider>
        <AppRoutes/>
    </AuthProvider>
  );
};

export default App;
