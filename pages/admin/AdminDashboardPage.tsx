
import React, { useEffect, useState } from 'react';
import { api } from '../../services/mockApi';
import { AdminStats } from '../../types';
import { UsersIcon, SupportIcon } from '../../components/icons';
import { UserManagementIcon } from '../../components/icons';

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div className={`p-4 rounded-full mr-4 ${color}`}>
            <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-md font-medium text-gray-500">{title}</p>
        </div>
    </div>
);

const AdminDashboardPage: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getAdminDashboardStats()
            .then(setStats)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <p>Đang tải dữ liệu...</p>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Bảng điều khiển Quản trị</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={UsersIcon}
                    title="Tổng số giáo viên"
                    value={stats?.totalTeachers.toString() || '0'}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={UserManagementIcon}
                    title="Tổng số phụ huynh"
                    value={stats?.totalParents.toString() || '0'}
                    color="bg-green-500"
                />
                <StatCard
                    icon={UsersIcon}
                    title="Tổng số học sinh"
                    value={stats?.totalStudents.toString() || '0'}
                    color="bg-yellow-500"
                />
                <StatCard
                    icon={SupportIcon}
                    title="Yêu cầu hỗ trợ"
                    value={stats?.pendingSupportRequests.toString() || '0'}
                    color="bg-red-500"
                />
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-800">Chào mừng Quản trị viên!</h3>
              <p className="text-gray-600 mt-2">Đây là trung tâm điều hành của bạn. Từ đây, bạn có thể quản lý người dùng, xem báo cáo, và duy trì hoạt động của hệ thống.</p>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
