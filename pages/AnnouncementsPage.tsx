
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Announcement, UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';

const CreateAnnouncementModal: React.FC<{ onClose: () => void, onAdd: (newAnnouncement: Announcement) => void }> = ({ onClose, onAdd }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      const newAnnouncement = await api.createAnnouncement(content);
      onAdd(newAnnouncement);
      onClose();
    } catch (error) {
      console.error("Failed to create announcement", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">Tạo thông báo mới</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Nhập nội dung thông báo..."
            className="w-full h-40 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <div className="flex justify-end space-x-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-primary-300">
              {isSubmitting ? 'Đang gửi...' : 'Gửi thông báo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    api.getAnnouncements().then(data => {
      const sortedData = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setAnnouncements(sortedData);
      setLoading(false);
    });
  }, []);

  const handleAddAnnouncement = (newAnnouncement: Announcement) => {
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  if (loading) {
    return <div className="text-center p-8">Đang tải thông báo...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Thông báo từ nhà trường</h2>
        {user?.role === UserRole.ADMIN && (
          <button onClick={() => setShowCreateModal(true)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Tạo thông báo mới
          </button>
        )}
      </div>

      {showCreateModal && <CreateAnnouncementModal onClose={() => setShowCreateModal(false)} onAdd={handleAddAnnouncement} />}

      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {announcements.map(announcement => (
            <li key={announcement.id} className="p-6">
              <div className="flex justify-between items-start mb-2">
                  <p className="text-sm text-gray-500">
                    Ngày đăng: {new Date(announcement.timestamp).toLocaleString('vi-VN')}
                  </p>
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">MỚI</span>
              </div>
              <p className="text-gray-800 whitespace-pre-line">{announcement.content}</p>
            </li>
          ))}
        </ul>
        {announcements.length === 0 && (
          <p className="text-center text-gray-500 p-8">Không có thông báo nào.</p>
        )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
