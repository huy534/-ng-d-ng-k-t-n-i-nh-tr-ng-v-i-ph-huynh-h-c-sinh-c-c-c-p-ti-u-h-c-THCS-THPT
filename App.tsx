
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
import { UserRole } from './types';


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
    
    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/" replace />; // Or a dedicated "Access Denied" page
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
                
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/messages" element={<MessagesPage />} />
                    <Route path="/announcements" element={<AnnouncementsPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
                
                <Route element={<ProtectedRoute roles={[UserRole.TEACHER]} />}>
                    <Route path="/classes" element={<ClassesPage />} />
                </Route>

                <Route element={<ProtectedRoute roles={[UserRole.PARENT]} />}>
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/billing" element={<BillingPage />} />
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
