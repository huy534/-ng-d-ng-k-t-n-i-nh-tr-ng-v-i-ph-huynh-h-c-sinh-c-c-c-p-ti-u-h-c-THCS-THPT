
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <p>Đang tải thông tin người dùng...</p>;
    }

    const ProfileField: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
        <div>
            <label className="block text-sm font-medium text-gray-500">{label}</label>
            <p className="mt-1 text-lg text-gray-900">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Hồ sơ cá nhân</h2>
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                <div className="flex items-center space-x-6 mb-8">
                    <img className="h-24 w-24 rounded-full" src={user.avatarUrl} alt="Avatar" />
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
                        <p className="text-gray-500">{user.role}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                    <ProfileField label="Địa chỉ Email" value={user.email} />
                    <ProfileField label="Số điện thoại" value={user.phone} />
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                    <button className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100">Đổi mật khẩu</button>
                    <button className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Cập nhật thông tin</button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
