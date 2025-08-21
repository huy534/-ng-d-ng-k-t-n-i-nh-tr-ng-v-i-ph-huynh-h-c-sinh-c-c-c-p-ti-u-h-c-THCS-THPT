
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { AnnouncementIcon, BillingIcon, MessageIcon, ReportIcon } from '../components/icons';

const DashboardCard: React.FC<{ icon: React.ElementType, title: string, value: string, detail: string, color: string }> = ({ icon: Icon, title, value, detail, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-start">
        <div className={`p-3 rounded-full mr-4 ${color}`}>
            <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-400">{detail}</p>
        </div>
    </div>
);

const ParentDashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
                icon={MessageIcon}
                title="Tin nhắn mới"
                value="1"
                detail="Từ cô Mai"
                color="bg-blue-500"
            />
            <DashboardCard
                icon={ReportIcon}
                title="Học bạ mới"
                value="0"
                detail="Chưa có học bạ mới"
                color="bg-green-500"
            />
            <DashboardCard
                icon={BillingIcon}
                title="Học phí chưa thanh toán"
                value="4.000.000đ"
                detail="Hạn chót: 30/05/2024"
                color="bg-red-500"
            />
        </div>
    );
};

const TeacherDashboard: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
                icon={MessageIcon}
                title="Tin nhắn chưa đọc"
                value="0"
                detail="Từ phụ huynh bé An"
                color="bg-blue-500"
            />
            <DashboardCard
                icon={AnnouncementIcon}
                title="Sĩ số lớp"
                value="2 học sinh"
                detail="Lớp Mầm 1"
                color="bg-yellow-500"
            />
            <DashboardCard
                icon={ReportIcon}
                title="Báo cáo cần hoàn thành"
                value="2"
                detail="Học kỳ 2"
                color="bg-purple-500"
            />
        </div>
    );
};


const DashboardPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Bảng điều khiển</h2>
            {user?.role === UserRole.PARENT && <ParentDashboard />}
            {user?.role === UserRole.TEACHER && <TeacherDashboard />}
        </div>
    );
};

export default DashboardPage;
