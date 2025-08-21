
import React, { useEffect, useState } from 'react';
import { api } from '../../services/mockApi';
import { User, UserRole } from '../../types';

const UserTable: React.FC<{ users: User[] }> = ({ users }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-gray-50">
                <tr>
                    <th className="p-3 font-medium text-sm text-gray-600">Họ và Tên</th>
                    <th className="p-3 font-medium text-sm text-gray-600">Email</th>
                    <th className="p-3 font-medium text-sm text-gray-600">Số điện thoại</th>
                    <th className="p-3 font-medium text-sm text-gray-600">Hành động</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-3 flex items-center">
                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-3" />
                            <span className="text-gray-800 font-medium">{user.name}</span>
                        </td>
                        <td className="p-3 text-gray-700">{user.email}</td>
                        <td className="p-3 text-gray-700">{user.phone}</td>
                        <td className="p-3">
                            <button className="text-blue-500 hover:underline text-sm font-semibold">Xem chi tiết</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<UserRole>(UserRole.TEACHER);

    useEffect(() => {
        setLoading(true);
        api.getAllUsers().then(data => {
            setUsers(data);
            setLoading(false);
        });
    }, []);

    const filteredUsers = users.filter(user => user.role === activeTab);

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Người dùng</h2>
            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6 px-6">
                        <button
                            onClick={() => setActiveTab(UserRole.TEACHER)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === UserRole.TEACHER ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Giáo viên
                        </button>
                        <button
                            onClick={() => setActiveTab(UserRole.PARENT)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === UserRole.PARENT ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Phụ huynh
                        </button>
                    </nav>
                </div>
                {loading ? (
                    <p className="p-6">Đang tải danh sách người dùng...</p>
                ) : (
                    <UserTable users={filteredUsers} />
                )}
            </div>
        </div>
    );
};

export default UserManagementPage;
