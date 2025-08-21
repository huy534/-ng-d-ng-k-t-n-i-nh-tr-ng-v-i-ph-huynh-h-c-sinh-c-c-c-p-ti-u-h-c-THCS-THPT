
import React, { useState, useEffect } from 'react';
import { api } from '../services/mockApi';
import { Announcement } from '../types';

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnnouncements().then(data => {
      setAnnouncements(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>Đang tải thông báo...</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Thông báo</h2>
      <div className="bg-white rounded-lg shadow-md">
        <ul className="divide-y divide-gray-200">
          {announcements.map(announcement => (
            <li key={announcement.id} className="p-6 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-primary-700">{announcement.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Đăng bởi <strong>{announcement.author}</strong> vào lúc {new Date(announcement.timestamp).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full">MỚI</span>
              </div>
              <p className="mt-4 text-gray-700 whitespace-pre-line">{announcement.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
